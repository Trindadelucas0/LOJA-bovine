import { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"
import { getAvaContent } from "@lib/data/avadesk-content"
import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Veja seu carrinho",
}

export default async function Cart() {
  const [cart, customer, { settings }] = await Promise.all([
    retrieveCart().catch(() => null),
    retrieveCustomer(),
    getAvaContent(),
  ])
  let shippingOptions: HttpTypes.StoreCartShippingOption[] = []
  if (cart?.items?.length) {
    shippingOptions = await listCartOptions().then((r) => r.shipping_options).catch(() => [])
  }

  return (
    <CartTemplate
      cart={cart}
      customer={customer}
      shippingOptions={shippingOptions}
      pixPercent={settings.pix_discount_percent}
      maxInstallments={settings.max_installments}
    />
  )
}
