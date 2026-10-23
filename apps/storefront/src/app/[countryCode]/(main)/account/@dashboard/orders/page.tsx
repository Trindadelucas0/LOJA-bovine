import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Pedidos",
  description: "Visão geral dos seus pedidos anteriores.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-4 flex flex-col gap-y-1">
        <h1 className="font-display text-xl small:text-2xl font-extrabold text-ink">Meus Pedidos</h1>
        <p className="text-sm text-ink-soft">
          Veja seus pedidos anteriores e o status de cada um. Você também pode solicitar devoluções ou trocas, se necessário.
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        <div className="h-6" />
        <div className="bg-white rounded-ava-xl border border-line shadow-sm p-5"><TransferRequestForm /></div>
      </div>
    </div>
  )
}
