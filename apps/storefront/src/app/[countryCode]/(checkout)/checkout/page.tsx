import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getAvaContent } from "@lib/data/avadesk-content"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import CheckoutFlow from "@modules/checkout/ava/checkout-flow"
import CheckoutSummary from "@modules/checkout/ava/summary"

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

  return (
    <div className="max-w-page mx-auto px-margin-m small:px-margin py-4 small:py-8 grid grid-cols-1 small:grid-cols-[1fr_380px] gap-4 small:gap-8 items-start">
      <CheckoutFlow
        cart={cart}
        customer={customer}
        shippingOptions={shippingOptions || []}
        providerIds={(providers || []).map((p) => p.id)}
        pixPercent={settings.pix_discount_percent}
        maxInstallments={settings.max_installments}
      />
      <CheckoutSummary cart={cart} pixPercent={settings.pix_discount_percent} />
    </div>
  )
}
