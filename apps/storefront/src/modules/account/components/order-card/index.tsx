import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import Icon from "@modules/avadesk/components/icon"
import { fmtDate, orderBadge } from "./status"

const OrderCard = ({ order }: { order: HttpTypes.StoreOrder }) => {
  const qty = order.items?.reduce((a, i) => a + i.quantity, 0) ?? 0
  const badge = orderBadge(order)
  return (
    <div className="bg-white rounded-ava-xl border border-line shadow-sm p-4 small:p-5 flex flex-col gap-4" data-testid="order-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-extrabold text-ink">
              Pedido #<span data-testid="order-display-id">{String(order.display_id).padStart(6, "0")}</span>
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${badge.cls}`}>{badge.label}</span>
          </div>
          <p className="text-sm text-ink-soft mt-0.5" data-testid="order-created-at">
            Realizado em {fmtDate(order.created_at, true)} • {qty} {qty === 1 ? "item" : "itens"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold">Total</p>
          <p className="font-display text-lg small:text-xl font-extrabold text-brand" data-testid="order-amount">
            {convertToLocale({ amount: order.total, currency_code: order.currency_code })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        {order.items?.slice(0, 4).map((i) => (
          <div key={i.id} className="flex items-center gap-3 shrink-0 bg-subtle rounded-ava-lg p-2 pr-4 max-w-[280px]" data-testid="order-item">
            <div className="w-14 h-14 rounded-ava bg-white overflow-hidden shrink-0">
              {i.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.thumbnail} alt={i.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink line-clamp-1" data-testid="item-title">{i.product_title || i.title}</p>
              <p className="text-xs text-ink-muted">Qtd: <span data-testid="item-quantity">{i.quantity}</span></p>
            </div>
          </div>
        ))}
        {(order.items?.length ?? 0) > 4 && <span className="text-sm text-ink-muted shrink-0">+{(order.items?.length ?? 0) - 4}</span>}
      </div>
      <div className="flex flex-col small:flex-row gap-2 small:justify-end">
        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          data-testid="order-details-link"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-ava-md bg-navy text-white text-sm font-bold hover:bg-navy-soft"
        >
          <Icon name="receipt_long" className="text-[18px]" /> Ver detalhes e rastreio
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
