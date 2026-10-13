import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import Thumbnail from "@modules/products/components/thumbnail"
import DiscountCode from "@modules/checkout/components/discount-code"
import Icon from "@modules/avadesk/components/icon"

export default function CheckoutSummary({ cart, pixPercent }: { cart: HttpTypes.StoreCart; pixPercent?: number | null }) {
  const currency = cart.currency_code
  const fmt = (n: number) => convertToLocale({ amount: n, currency_code: currency })
  const items = cart.items || []
  const count = items.reduce((a, i) => a + i.quantity, 0)
  const total = cart.total ?? 0
  const pix = pixPercent && pixPercent > 0 ? total * (1 - pixPercent / 100) : null
  return (
    <aside className="bg-white rounded-ava-lg small:rounded-ava-xl shadow-sm p-4 small:p-6 flex flex-col gap-4 small:sticky small:top-6" data-testid="checkout-summary">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-h-sm text-ink flex items-center gap-2">
          <Icon name="shopping_bag" className="text-[20px]" /> Resumo do pedido
        </h2>
        <span className="text-label-xs bg-subtle rounded-full px-2 py-1 text-ink-soft">{count} {count === 1 ? "item" : "itens"}</span>
      </div>
      <ul className="flex flex-col gap-3 max-h-72 overflow-y-auto">
        {items.map((i) => (
          <li key={i.id} className="flex gap-3">
            <div className="w-14 shrink-0">
              <Thumbnail thumbnail={i.thumbnail} size="square" className="!p-1 !rounded-ava-md !shadow-none" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold text-ink line-clamp-1">{i.product_title}</p>
              <p className="text-body-sm text-ink-muted line-clamp-1">{i.variant_title} • Qtd: {i.quantity}</p>
            </div>
            <span className="text-body-sm font-bold text-ink">{fmt(i.total ?? 0)}</span>
          </li>
        ))}
      </ul>
      <div className="[&_*]:!text-body-sm">
        <DiscountCode cart={cart as any} />
      </div>
      <dl className="flex flex-col gap-2 text-body-md border-t border-line pt-3">
        <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{fmt(cart.item_subtotal ?? cart.subtotal ?? 0)}</dd></div>
        <div className="flex justify-between"><dt className="text-ink-soft">Frete</dt><dd>{cart.shipping_methods?.length ? fmt(cart.shipping_total ?? 0) : "A calcular"}</dd></div>
        {(cart.discount_total ?? 0) > 0 && (
          <div className="flex justify-between text-teal"><dt>Descontos</dt><dd>- {fmt(cart.discount_total ?? 0)}</dd></div>
        )}
        {(cart.tax_total ?? 0) > 0 && (
          <div className="flex justify-between"><dt className="text-ink-soft">Impostos</dt><dd>{fmt(cart.tax_total ?? 0)}</dd></div>
        )}
      </dl>
      <div className="flex items-end justify-between border-t border-line pt-3">
        <span className="font-display text-h-sm text-ink">Total</span>
        <div className="text-right">
          <span className="font-display text-price-display text-ink block" data-testid="cart-total">{fmt(total)}</span>
          {pix !== null && <span className="text-body-sm text-teal font-semibold">{fmt(pix)} no PIX ({pixPercent}% OFF)</span>}
        </div>
      </div>
      <div className="rounded-ava-md bg-subtle p-3 flex gap-2 text-body-sm text-ink-soft">
        <Icon name="verified_user" className="text-[20px] text-stock-in" />
        Compra protegida: seus dados são enviados de forma segura.
      </div>
    </aside>
  )
}
