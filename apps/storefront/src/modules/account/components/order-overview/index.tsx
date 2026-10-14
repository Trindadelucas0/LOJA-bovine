"use client"

import { Button } from "@modules/common/components/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-4 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className=""
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-3 bg-white rounded-ava-xl border border-[#E2E8F0] p-8 text-center"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi">Nada por aqui</h2>
      <p className="text-base-regular">
        Você ainda não tem pedidos, vamos mudar isso {":)"}
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <Button data-testid="continue-shopping-button">
            Continuar comprando
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
