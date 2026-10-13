import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DiscountCode from "@modules/checkout/components/discount-code"
import Icon from "@modules/avadesk/components/icon"
import CartItemRow from "../ava/cart-item"
import ShippingEstimate from "../ava/shipping-estimate"

type Props = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  shippingOptions?: HttpTypes.StoreCartShippingOption[]
  pixPercent?: number | null
  maxInstallments?: number | null
}

const CartTemplate = ({ cart, customer, shippingOptions = [], pixPercent, maxInstallments }: Props) => {
  const items = cart?.items || []
  if (!cart || !items.length) {
    return (
      <div className="max-w-page mx-auto px-margin-m small:px-margin py-10" data-testid="cart-container">
        <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-4 bg-white rounded-ava-xl shadow-sm p-10" data-testid="empty-cart-message">
          <span className="w-20 h-20 rounded-full bg-subtle flex items-center justify-center text-ink-muted">
            <Icon name="shopping_cart" className="text-[40px]" />
          </span>
          <h1 className="font-display text-h-md text-ink">Seu carrinho está vazio</h1>
          <p className="text-body-md text-ink-soft">Explore o catálogo e adicione produtos para continuar.</p>
          <LocalizedClientLink href="/store" className="h-12 px-6 rounded-ava-md bg-brand text-white text-label-md flex items-center gap-2">
            <Icon name="storefront" className="text-[20px]" /> Ver produtos
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  const currency = cart.currency_code
  const fmt = (n: number) => convertToLocale({ amount: n, currency_code: currency })
  const subtotal = cart.item_subtotal ?? cart.subtotal ?? 0
  const total = cart.total ?? 0
  const pix = pixPercent && pixPercent > 0 ? total * (1 - pixPercent / 100) : null
  const count = items.reduce((a, i) => a + i.quantity, 0)
  const sorted = [...items].sort((a, b) => (String(a.created_at ?? "") > String(b.created_at ?? "") ? -1 : 1))

  return (
    <div className="max-w-page mx-auto px-margin-m small:px-margin py-4 small:py-8 pb-32 small:pb-10" data-testid="cart-container">
      <h1 className="font-display text-h-md small:text-h-lg text-ink mb-4 small:mb-6">
        Carrinho <span className="text-ink-muted text-h-sm">({count} {count === 1 ? "item" : "itens"})</span>
      </h1>
      <div className="grid grid-cols-1 small:grid-cols-[1fr_380px] gap-4 small:gap-8 items-start">
        <div className="flex flex-col gap-4">
          {!customer && (
            <div className="flex items-center justify-between gap-3 bg-white rounded-ava-lg shadow-sm p-4">
              <p className="text-body-md text-ink-soft">Já tem conta? Entre para agilizar a compra.</p>
              <LocalizedClientLink href="/account" className="h-10 px-4 rounded-ava-md border border-line text-label-sm flex items-center shrink-0">Entrar</LocalizedClientLink>
            </div>
          )}
          <ul className="bg-white rounded-ava-lg small:rounded-ava-xl shadow-sm p-4 small:p-6 flex flex-col gap-4 divide-y divide-line [&>li:not(:first-child)]:pt-4">
            {sorted.map((i) => (
              <CartItemRow key={i.id} item={i} currency={currency} />
            ))}
          </ul>
          <LocalizedClientLink href="/store" className="inline-flex items-center gap-1 text-label-sm text-brand self-start">
            <Icon name="arrow_back" className="text-[18px]" /> Continuar comprando
          </LocalizedClientLink>
        </div>

        <aside className="bg-white rounded-ava-lg small:rounded-ava-xl shadow-sm p-4 small:p-6 flex flex-col gap-4 small:sticky small:top-24" data-testid="cart-summary">
          <h2 className="font-display text-h-sm text-ink">Resumo</h2>
          <ShippingEstimate options={shippingOptions} currency={currency} />
          <DiscountCode cart={cart as any} />
          <dl className="flex flex-col gap-2 text-body-md border-t border-line pt-3">
            <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd data-testid="cart-subtotal">{fmt(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-soft">Frete</dt><dd>{cart.shipping_methods?.length ? fmt(cart.shipping_total ?? 0) : "Calculado no checkout"}</dd></div>
            {(cart.discount_total ?? 0) > 0 && (
              <div className="flex justify-between text-teal"><dt>Descontos</dt><dd>- {fmt(cart.discount_total ?? 0)}</dd></div>
            )}
          </dl>
          <div className="flex items-end justify-between border-t border-line pt-3">
            <span className="font-display text-h-sm">Total</span>
            <div className="text-right">
              <span className="font-display text-price-display text-ink block" data-testid="cart-total">{fmt(total)}</span>
              {pix !== null && <span className="text-body-sm text-teal font-semibold block">{fmt(pix)} no PIX ({pixPercent}% OFF)</span>}
              {maxInstallments && maxInstallments > 1 ? (
                <span className="text-body-sm text-ink-soft block">ou {maxInstallments}x de {fmt(total / maxInstallments)}</span>
              ) : null}
            </div>
          </div>
          <LocalizedClientLink
            href="/checkout?step=address"
            className="hidden small:flex h-12 rounded-ava-md bg-brand text-white text-label-md items-center justify-center gap-2 shadow-lg shadow-brand/20"
            data-testid="checkout-button"
          >
            <Icon name="lock" className="text-[20px]" /> Finalizar compra
          </LocalizedClientLink>
        </aside>
      </div>
      <div className="small:hidden fixed inset-x-0 bottom-16 z-40 bg-white/95 backdrop-blur-xl border-t border-line px-3 py-2 flex items-center gap-3">
        <div className="flex-1">
          <span className="block text-body-sm text-ink-soft">Total</span>
          <span className="font-display font-bold text-ink">{fmt(total)}</span>
        </div>
        <LocalizedClientLink href="/checkout?step=address" className="h-11 px-5 rounded-ava-md bg-brand text-white text-label-md flex items-center gap-1.5">
          <Icon name="lock" className="text-[18px]" /> Finalizar
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default CartTemplate
