import { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"

import { getAvaContent, storeName } from "@lib/data/avadesk-content"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { chatConfig } from "@lib/util/chat-config"
import AvaProductCard, { PriceConfig } from "@modules/avadesk/components/product-card"
import Benefits from "@modules/home/components/benefits"
import ChatBlock from "@modules/home/components/chat-block"
import FeaturedTabs from "@modules/home/components/featured-tabs"
import Hero from "@modules/home/components/hero"
import TrustStrip from "@modules/home/components/hero/trust-strip"
import NewArrivals from "@modules/home/components/new-arrivals"
import PromoBanner from "@modules/home/components/promo-banner"
import SectionHeading from "@modules/home/components/section-heading"
import ServiceShortcuts from "@modules/home/components/service-shortcuts"

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getAvaContent()
  return {
    title: storeName(settings),
    description: settings.tagline || settings.footer_text || undefined,
  }
}

const productsFor = async (countryCode: string, query: Record<string, unknown>) =>
  listProducts({ countryCode, queryParams: { limit: 8, ...query } as any })
    .then(({ response }) => response.products)
    .catch(() => [] as HttpTypes.StoreProduct[])

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  if (!region) return null

  const [{ settings, banners }, { collections }] = await Promise.all([
    getAvaContent(),
    listCollections({ fields: "id,handle,title" }).catch(() => ({ collections: [] as HttpTypes.StoreCollection[] })),
  ])

  const hero = banners.find((b) => b.position === "hero")
  const promo = banners.find((b) => b.position === "promo")
  const badges = settings.hero_badges || []

  // Coleções em destaque (abas)
  const selectedCols = settings.featured_collection_ids || []
  const featuredCols = selectedCols.length
    ? selectedCols.map((id) => collections.find((c) => c.id === id)).filter(Boolean) as HttpTypes.StoreCollection[]
    : collections.slice(0, 4)

  const [allFeatured, perCollection, newest] = await Promise.all([
    productsFor(countryCode, featuredCols.length ? { collection_id: featuredCols.map((c) => c.id) } : {}),
    Promise.all(featuredCols.map((c) => productsFor(countryCode, { collection_id: [c.id] }))),
    productsFor(countryCode, { order: "-created_at", limit: 4 }),
  ])

  const chat = chatConfig(settings)
  const config: PriceConfig = {
    pixPercent: settings.pix_discount_percent,
    maxInstallments: settings.max_installments,
    sellerName: settings.store_name,
    chatEnabled: chat.enabled,
  }

  const grid = (products: HttpTypes.StoreProduct[]) => (
    <div className="grid grid-cols-2 small:grid-cols-4 gap-3 small:gap-gutter">
      {products.map((p) => (
        <AvaProductCard key={p.id} product={p} config={config} />
      ))}
    </div>
  )

  const tabs = [
    ...(allFeatured.length ? [{ id: "all", label: "Todos", content: grid(allFeatured) }] : []),
    ...(featuredCols.length > 1
      ? featuredCols
          .map((c, i) => ({ id: c.id, label: c.title, content: grid(perCollection[i]), n: perCollection[i].length }))
          .filter((t) => t.n > 0)
      : []),
  ]

  return (
    <div className="max-w-page mx-auto px-margin-m small:px-margin pt-3 small:pt-6 pb-10 flex flex-col gap-6 small:gap-10">
      <TrustStrip items={badges} />
      <Hero banner={hero} settings={settings} />
      <ServiceShortcuts settings={settings} />
      <PromoBanner banner={promo} pixText={settings.pix_discount_text} />
      {tabs.length > 0 && (
        <section>
          <SectionHeading
            eyebrow="Seleção recomendada"
            title={settings.featured_title || "Produtos em Destaque"}
            linkLabel="Ver todos"
            linkHref="/store"
          />
          <FeaturedTabs tabs={tabs.map(({ id, label, content }) => ({ id, label, content }))} />
        </section>
      )}
      {chat.enabled && <ChatBlock settings={settings} />}
      <NewArrivals title={settings.new_arrivals_title || "Recém-adicionados"} products={newest} config={config} />
      <Benefits items={settings.benefits || []} />
    </div>
  )
}
