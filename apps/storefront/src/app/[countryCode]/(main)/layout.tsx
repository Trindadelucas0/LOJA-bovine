import { Metadata } from "next"

import { getAvaContent } from "@lib/data/avadesk-content"
import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { chatConfig } from "@lib/util/chat-config"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import BottomNav from "@modules/avadesk/components/bottom-nav"
import ChatwootWidget from "@modules/avadesk/components/chatwoot/widget"
import AvaFooter from "@modules/avadesk/components/footer"
import AvaHeader from "@modules/avadesk/components/header"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const [customer, cart, { settings }] = await Promise.all([
    retrieveCustomer(),
    retrieveCart(),
    getAvaContent(),
  ])
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  const chat = chatConfig(settings)
  const cartCount = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) ?? 0

  return (
    <div className="bg-canvas min-h-screen">
      <AvaHeader settings={settings} chatEnabled={chat.enabled} />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <AvaFooter settings={settings} />
      <BottomNav cartCount={cartCount} />
      {chat.enabled && (
        <ChatwootWidget
          baseUrl={chat.baseUrl}
          websiteToken={chat.websiteToken}
          user={
            customer
              ? {
                  id: customer.id,
                  email: customer.email,
                  name: [customer.first_name, customer.last_name].filter(Boolean).join(" ") || null,
                  phone: customer.phone,
                }
              : null
          }
        />
      )}
    </div>
  )
}
