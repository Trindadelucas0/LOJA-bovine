"use client"

/**
 * Helpers do Chatwoot para o storefront.
 * Uso: openChat({ ... }) / openProductChat({ ... }) em componentes client.
 * Retornam false quando o Chatwoot não está configurado/carregado, para o
 * componente mostrar um fallback.
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

/** O script do widget foi inserido na página (Chatwoot configurado). */
export const isChatAvailable = () =>
  typeof window !== "undefined" &&
  (!!window.$chatwoot || !!document.getElementById("chatwoot-sdk"))

const whenReady = (fn: () => void) => {
  if (window.$chatwoot) return fn()
  window.addEventListener("chatwoot:ready", () => fn(), { once: true })
}

/** Abre o chat; opcionalmente envia atributos de contexto. Retorna false se indisponível. */
export const openChat = (attrs?: ChatAttrs): boolean => {
  if (!isChatAvailable()) return false
  whenReady(() => {
    const a = clean(attrs)
    if (Object.keys(a).length) window.$chatwoot!.setCustomAttributes(a)
    window.$chatwoot!.toggle("open")
  })
  return true
}

export type ProductChatContext = {
  id: string
  title?: string | null
  handle?: string | null
  image?: string | null
  sku?: string | null
  variant?: string | null
  variant_id?: string | null
  price?: string | null
  quantity?: number | null
  customer_email?: string | null
  customer_name?: string | null
}

export const openProductChat = (p: ProductChatContext): boolean =>
  openChat({
    context: "produto",
    product_id: p.id,
    product_title: p.title,
    product_handle: p.handle,
    product_image: p.image,
    sku: p.sku,
    variant: p.variant,
    variant_id: p.variant_id,
    price: p.price,
    quantity: p.quantity,
    customer_email: p.customer_email,
    customer_name: p.customer_name,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  })

export const openOrderChat = (o: { id: string; display_id?: number | string; status?: string }): boolean =>
  openChat({
    context: "pedido",
    order_id: o.id,
    order_number: o.display_id,
    order_status: o.status,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  })

export const setChatUser = (u: { id: string; email?: string | null; name?: string | null; phone?: string | null }) => {
  if (typeof window === "undefined") return
  whenReady(() =>
    window.$chatwoot!.setUser(u.id, clean({ email: u.email, name: u.name, phone_number: u.phone }))
  )
}
