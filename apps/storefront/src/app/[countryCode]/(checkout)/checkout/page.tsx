import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getAvaContent } from "@lib/data/avadesk-content"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import CheckoutFlow from "@modules/checkout/ava/checkout-flow"
import CheckoutSummary from "@modules/checkout/ava/summary"
import Icon from "@modules/avadesk/components/icon"
import { convertToLocale } from "@lib/util/money"

export const metadata: Metadata = {
  title: "Finalizar compra",
}

const CART_FIELDS =
  "*items,*region,*items.product,*items.variant,+items.thumbnail,+items.total,*promotions,*shipping_address,*billing_address,*shipping_methods,*payment_collection,*payment_collection.payment_sessions,+metadata,+email,+total,+subtotal,+item_subtotal,+shipping_total,+discount_total,+tax_total"

export default async function Checkout(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const cart = await retrieveCart(undefined, CART_FIELDS)

  if (!cart || !cart.items?.length) {
    redirect(`/${countryCode}/cart`)
  }

  const [customer, shippingOptions, providers, { settings }] = await Promise.all([
    retrieveCustomer(),
    listCartShippingMethods(cart.id).catch(() => []),
    listCartPaymentMethods(cart.region_id ?? cart.region?.id ?? "").catch(() => []),
    getAvaContent(),
  ])

  const pixP = settings.pix_discount_percent || 0
  const payNow = (cart.total ?? 0) * (1 - pixP / 100)
  return (
    <>
    <div className="max-w-page mx-auto px-margin-m small:px-margin pt-4 small:pt-6 flex items-center justify-between gap-3 text-body-sm">
      <div className="flex items-center gap-2 text-ink-soft min-w-0">
        <Icon name="storefront" className="text-[16px]" /> <span className="hidden xsmall:inline">Loja</span>
        <Icon name="chevron_right" className="text-[16px] text-ink-muted" />
        <span className="font-semibold text-ink">Checkout seguro</span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stock-in/10 text-stock-in text-label-xs font-bold"><Icon name="lock" className="text-[12px]" /> Sessão criptografada</span>
      </div>
    </div>
    <div className="max-w-page mx-auto px-margin-m small:px-margin py-4 small:py-6 pb-28 small:pb-8 grid grid-cols-1 small:grid-cols-[1fr_380px] gap-4 small:gap-8 items-start">
      <CheckoutFlow
        cart={cart}
        customer={customer}
        shippingOptions={shippingOptions || []}
        providerIds={(providers || []).map((p) => p.id)}
        pixPercent={settings.pix_discount_percent}
        maxInstallments={settings.max_installments}
      />
      <CheckoutSummary cart={cart} pixPercent={settings.pix_discount_percent} maxInstallments={settings.max_installments} />
    </div>
    <div className="small:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 pt-2 pb-3">
      <div className="flex justify-between text-body-sm mb-2"><span className="text-ink-soft">Total{pixP ? " com PIX" : ""}:</span><b className="text-brand">{convertToLocale({ amount: pixP ? payNow : cart.total ?? 0, currency_code: cart.currency_code })}{pixP ? " à vista" : ""}</b></div>
      <a href="#checkout-flow" className="h-12 rounded-ava-md bg-brand text-white text-label-md flex items-center justify-center gap-2 shadow-lg shadow-brand/30"><Icon name="lock" className="text-[18px]" /> Finalizar compra com segurança</a>
    </div>
    </>
  )
}
