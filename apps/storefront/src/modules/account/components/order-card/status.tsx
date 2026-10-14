import { HttpTypes } from "@medusajs/types"

export const fmtDate = (d: string | Date, withTime = false) =>
  new Date(d).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "America/Sao_Paulo",
  })

export const fmtLongDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", timeZone: "America/Sao_Paulo" })

/** Etapa do pedido 0..4: Confirmado, Pago, Em separação, Transportadora, Entregue */
export function orderStep(o: HttpTypes.StoreOrder): number {
  const f = (o as any).fulfillment_status as string | undefined
  const p = (o as any).payment_status as string | undefined
  if (o.status === "canceled") return -1
  if (f === "delivered") return 4
  if (f === "shipped" || f === "partially_shipped") return 3
  if (f === "fulfilled" || f === "partially_fulfilled") return 2
  if (p === "captured" || p === "partially_captured" || p === "partially_refunded") return 1
  return 0
}

export function orderBadge(o: HttpTypes.StoreOrder) {
  const s = orderStep(o)
  const p = (o as any).payment_status as string | undefined
  if (s === -1) return { label: "Cancelado", cls: "bg-red-50 text-[#EF4444]" }
  if (s === 4) return { label: "Entregue", cls: "bg-emerald-50 text-[#10B981]" }
  if (s === 3) return { label: "Em transporte", cls: "bg-blue-50 text-chat" }
  if (s === 2) return { label: "Em separação", cls: "bg-brand-light text-brand-dark" }
  if (s === 1) return { label: "Pago", cls: "bg-emerald-50 text-[#10B981]" }
  if (p === "authorized") return { label: "Pagamento aprovado", cls: "bg-emerald-50 text-[#10B981]" }
  return { label: "Aguardando pagamento", cls: "bg-amber-50 text-[#F59E0B]" }
}
