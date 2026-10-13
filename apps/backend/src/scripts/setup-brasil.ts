import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateRegionsWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Configuração operacional do Brasil — ADITIVA e idempotente.
 * Não altera nem remove dados existentes; só cria o que faltar:
 *  - local de estoque "Centro de Distribuição Brasil"
 *  - fulfillment set + zona de serviço "Brasil" (país br)
 *  - opções de entrega PAC e SEDEX em BRL (editáveis no admin)
 *  - vínculo do local com o "Default Sales Channel" e com o provider manual
 *  - garante pp_system_default na região br
 *
 * Uso: npx medusa exec ./src/scripts/setup-brasil.ts
 * Para só inspecionar: DRY_RUN=1 npx medusa exec ./src/scripts/setup-brasil.ts
 */
export default async function setupBrasil({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillment = container.resolve(Modules.FULFILLMENT)
  const dry = process.env.DRY_RUN === "1"
  const log = (m: string) => logger.info(`[setup-brasil] ${m}`)

  // Região br
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2", "payment_providers.id"],
  })
  const region = regions.find((r: any) => r.countries?.some((c: any) => c?.iso_2 === "br"))
  if (!region) throw new Error("Região com país 'br' não encontrada.")
  const providers = (region.payment_providers || []).map((p: any) => p?.id)
  log(`Região: ${region.name} (${region.currency_code}) providers=${JSON.stringify(providers)}`)
  if (!providers.includes("pp_system_default")) {
    log("Adicionando pp_system_default à região br")
    if (!dry)
      await updateRegionsWorkflow(container).run({
        input: { selector: { id: region.id }, update: { payment_providers: [...providers, "pp_system_default"] } },
      })
  }

  // Sales channel
  const { data: channels } = await query.graph({ entity: "sales_channel", fields: ["id", "name"] })
  const sc = channels.find((c: any) => c.name === "Default Sales Channel") || channels[0]
  log(`Sales channel: ${sc?.name} ${sc?.id}`)

  // Local de estoque
  const { data: locations } = await query.graph({
    entity: "stock_location",
    fields: [
      "id", "name", "address.country_code", "sales_channels.id",
      "fulfillment_sets.id", "fulfillment_sets.name", "fulfillment_sets.service_zones.id",
      "fulfillment_sets.service_zones.name", "fulfillment_sets.service_zones.geo_zones.country_code",
      "fulfillment_providers.id",
    ],
  })
  locations.forEach((l: any) =>
    log(`Local existente: ${l.name} (${l.address?.country_code}) sets=${(l.fulfillment_sets || []).map((s: any) => s?.name).join(",")}`)
  )
  let location: any = locations.find((l: any) => (l.address?.country_code || "").toLowerCase() === "br")
  if (!location) {
    log("Criando local 'Centro de Distribuição Brasil'")
    if (dry) return log("DRY_RUN: parando aqui.")
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [{ name: "Centro de Distribuição Brasil", address: { address_1: "", city: "São Paulo", country_code: "BR" } }],
      },
    })
    location = { ...result[0], sales_channels: [], fulfillment_sets: [], fulfillment_providers: [] }
  }

  if (!(location.fulfillment_providers || []).some((p: any) => p?.id === "manual_manual")) {
    log("Vinculando provider manual_manual ao local")
    if (!dry)
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
        [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
      })
  }

  if (sc && !(location.sales_channels || []).some((s: any) => s?.id === sc.id)) {
    log("Vinculando local ao Default Sales Channel")
    if (!dry) await linkSalesChannelsToStockLocationWorkflow(container).run({ input: { id: location.id, add: [sc.id] } })
  }

  // Fulfillment set + zona Brasil
  let zoneId: string | undefined
  for (const s of location.fulfillment_sets || []) {
    for (const z of s?.service_zones || []) {
      if ((z?.geo_zones || []).some((g: any) => g?.country_code === "br")) zoneId = z.id
    }
  }
  if (!zoneId) {
    log("Criando fulfillment set 'Entregas Brasil' com zona 'Brasil'")
    if (dry) return log("DRY_RUN: parando aqui.")
    const set = await fulfillment.createFulfillmentSets({
      name: `Entregas Brasil (${location.id.slice(-6)})`,
      type: "shipping",
      service_zones: [{ name: "Brasil", geo_zones: [{ country_code: "br", type: "country" }] }],
    })
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: set.id },
    })
    zoneId = set.service_zones[0].id
  }

  // Opções de entrega
  const { data: options } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "service_zone_id"],
    filters: { service_zone_id: zoneId },
  })
  log(`Opções na zona Brasil: ${options.map((o: any) => o.name).join(", ") || "(nenhuma)"}`)
  if (!options.length) {
    const { data: profiles } = await query.graph({ entity: "shipping_profile", fields: ["id", "name", "type"] })
    const profile = profiles.find((p: any) => p.type === "default") || profiles[0]
    const mk = (name: string, code: string, label: string, description: string, amount: number) => ({
      name,
      price_type: "flat" as const,
      provider_id: "manual_manual",
      service_zone_id: zoneId!,
      shipping_profile_id: profile.id,
      type: { label, description, code },
      prices: [
        { currency_code: "brl", amount },
        { region_id: region.id, amount },
      ],
      rules: [
        { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
        { attribute: "is_return", value: "false", operator: "eq" as const },
      ],
    })
    log("Criando opções PAC (R$ 19,90) e SEDEX (R$ 34,90)")
    if (!dry)
      await createShippingOptionsWorkflow(container).run({
        input: [
          mk("PAC", "pac", "Econômica", "Entrega em 4 a 8 dias úteis", 19.9),
          mk("SEDEX", "sedex", "Expressa", "Entrega em 1 a 3 dias úteis", 34.9),
        ],
      })
  }
  log("Concluído.")
}
