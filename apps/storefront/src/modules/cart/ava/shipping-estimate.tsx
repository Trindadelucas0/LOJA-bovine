"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { fetchCep, maskCEP, onlyDigits } from "@lib/util/br"
import { convertToLocale } from "@lib/util/money"
import Icon from "@modules/avadesk/components/icon"

/** Estimativa de frete por CEP: valida o CEP no ViaCEP e mostra as opções de entrega da loja. */
export default function ShippingEstimate({ options, currency }: { options: HttpTypes.StoreCartShippingOption[]; currency: string }) {
  const [cep, setCep] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle")
  const [place, setPlace] = useState("")

  const calc = async () => {
    if (onlyDigits(cep).length !== 8) return setState("error")
    setState("loading")
    const r = await fetchCep(cep)
    if (!r) return setState("error")
    setPlace(`${r.localidade}/${r.uf}`)
    setState("ok")
  }

  return (
    <div className="flex flex-col gap-2" data-testid="shipping-estimate">
      <span className="text-label-sm text-ink flex items-center gap-1.5"><Icon name="local_shipping" className="text-[18px] text-brand" /> Calcular frete</span>
      <div className="flex gap-2">
        <input
          value={cep}
          onChange={(e) => setCep(maskCEP(e.target.value))}
          onKeyDown={(e) => e.key === "Enter" && calc()}
          inputMode="numeric"
          placeholder="00000-000"
          className="flex-1 h-10 px-3 rounded-ava-md border border-line text-body-md focus:outline-none focus:ring-2 focus:ring-navy/20"
          aria-label="CEP"
        />
        <button type="button" onClick={calc} className="h-10 px-4 rounded-ava-md bg-subtle text-navy text-label-sm">
          {state === "loading" ? "..." : "Calcular"}
        </button>
      </div>
      {state === "error" && <span className="text-body-sm text-danger">CEP não encontrado.</span>}
      {state === "ok" && (
        <div className="rounded-ava-md bg-subtle p-3 flex flex-col gap-1.5">
          <span className="text-body-sm text-ink-soft">Entrega para {place}:</span>
          {options.length === 0 && <span className="text-body-sm text-ink-muted">Opções calculadas no checkout.</span>}
          {options.map((o) => (
            <div key={o.id} className="flex justify-between text-body-sm">
              <span className="text-ink">{o.name}{(o as any).type?.description ? <span className="text-ink-muted"> • {(o as any).type.description}</span> : null}</span>
              <span className="font-semibold">{(o.amount ?? 0) === 0 ? "Grátis" : convertToLocale({ amount: o.amount ?? 0, currency_code: currency })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
