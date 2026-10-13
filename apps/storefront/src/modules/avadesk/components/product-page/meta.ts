import { HttpTypes } from "@medusajs/types"

/**
 * Campos de metadata do produto editados pelo widget do admin
 * ("Especificações AVADESK"). Todos são strings para manter compatibilidade.
 *  - specs: uma linha por item, "Rótulo: Valor"
 *  - included_items: uma linha por item
 *  - warranty_text: texto livre
 *  - badge: selo curto (ex.: "Oficial")
 *  - max_qty_per_order: número
 */
export type ProductMeta = {
  specs: { label: string; value: string }[]
  included: string[]
  warranty: string | null
  badge: string | null
  maxQty: number | null
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null)

export const readProductMeta = (product: HttpTypes.StoreProduct): ProductMeta => {
  const m = (product.metadata || {}) as Record<string, unknown>
  const specs = (str(m.specs) || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf(":")
      return i > 0 ? { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() } : { label: l, value: "" }
    })
  const included = (str(m.included_items) || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const maxQty = Number(m.max_qty_per_order)
  return {
    specs,
    included,
    warranty: str(m.warranty_text),
    badge: str(m.badge),
    maxQty: Number.isFinite(maxQty) && maxQty > 0 ? maxQty : null,
  }
}

type V = HttpTypes.StoreProductVariant

export const variantStock = (v?: V | null): { state: "in" | "low" | "out"; qty: number | null } => {
  if (!v) return { state: "out", qty: null }
  if (!v.manage_inventory || v.allow_backorder) return { state: "in", qty: null }
  const q = v.inventory_quantity ?? 0
  if (q <= 0) return { state: "out", qty: 0 }
  if (q <= 5) return { state: "low", qty: q }
  return { state: "in", qty: q }
}
