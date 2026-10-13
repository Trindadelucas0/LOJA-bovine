"use client"

/**
 * Helpers do Chatwoot para o storefront.
 * Uso: openChat({ product_id, sku, price, url }) em qualquer componente client.
 */
type ChatAttrs = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    $chatwoot?: {
      toggle: (state?: "open" | "close") => void
      setCustomAttributes: (attrs: Record<string, unknown>) => void
      deleteCustomAttribute?: (key: string) => void
      setUser: (id: string, user: Record<string, unknown>) => void
      setLabel?: (label: string) => void
      reset?: () => void
    }
    chatwootSDK?: { run: (cfg: { websiteToken: string; baseUrl: string }) => void }
    chatwootSettings?: Record<string, unknown>
  }
}

const clean = (attrs?: ChatAttrs) => {
  const out: Record<string, string | number | boolean> = {}
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") out[k] = v
  })
  return out
}

const whenReady = (fn: () => void) => {
  if (typeof window === "undefined") return
  if (window.$chatwoot) return fn()
  window.addEventListener("chatwoot:ready", () => fn(), { once: true })
}

export const isChatAvailable = () =>
  typeof window !== "undefined" && (!!window.$chatwoot || !!window.chatwootSDK)

/** Abre o chat; opcionalmente envia atributos de contexto (produto, pedido...). */
export const openChat = (attrs?: ChatAttrs) => {
  whenReady(() => {
    const a = clean(attrs)
    if (Object.keys(a).length) window.$chatwoot!.setCustomAttributes(a)
    window.$chatwoot!.toggle("open")
  })
}

export const openProductChat = (p: {
  id: string
  title?: string
  sku?: string | null
  variant?: string | null
  price?: string | null
}) =>
  openChat({
    context: "produto",
    product_id: p.id,
    product_title: p.title,
    sku: p.sku,
    variant: p.variant,
    price: p.price,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  })

export const openOrderChat = (o: { id: string; display_id?: number | string; status?: string }) =>
  openChat({
    context: "pedido",
    order_id: o.id,
    order_number: o.display_id,
    order_status: o.status,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  })

export const setChatUser = (u: { id: string; email?: string | null; name?: string | null; phone?: string | null }) =>
  whenReady(() =>
    window.$chatwoot!.setUser(u.id, clean({ email: u.email, name: u.name, phone_number: u.phone }))
  )
