import { HttpTypes } from "@medusajs/types"
import { getAvaContent } from "@lib/data/avadesk-content"
import { convertToLocale } from "@lib/util/money"
import { PAY_LABEL, PayMethod } from "@lib/util/br"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import Icon from "@modules/avadesk/components/icon"
import ChatButton from "@modules/avadesk/components/chatwoot/chat-button"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({ order }: OrderCompletedTemplateProps) {
  const { settings } = await getAvaContent()
  const fmt = (n: number) => convertToLocale({ amount: n, currency_code: order.currency_code })
  const meta = (order.metadata || {}) as Record<string, string>
  const method = (meta.payment_method as PayMethod) || "pix"
  const sa = order.shipping_address
  const saMeta = (sa?.metadata || {}) as Record<string, string>
  const pixPercent = settings.pix_discount_percent
  const pixTotal = method === "pix" && pixPercent ? (order.total ?? 0) * (1 - pixPercent / 100) : null

  const instructions: Record<PayMethod, string> = {
    pix: "Seu pedido foi recebido e está aguardando pagamento. Nossa equipe enviará a chave PIX / QR Code por e-mail ou chat. Após a confirmação do pagamento, o pedido segue para separação.",
    card: "Seu pedido foi recebido. Enviaremos um link seguro para pagamento com cartão por e-mail ou chat. Após a aprovação, o pedido segue para separação.",
    boleto: "Seu pedido foi recebido. O boleto será enviado para o seu e-mail. A compensação pode levar até 2 dias úteis.",
  }

  return (
    <div className="max-w-page mx-auto px-margin-m small:px-margin py-6 small:py-10 pb-nav" data-testid="order-complete-container">
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        <section className="bg-gradient-to-r from-navy-deep via-navy to-navy-soft text-white rounded-ava-xl p-6 small:p-10 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-stock-in/20 rounded-full blur-3xl pointer-events-none" />
          <span className="w-14 h-14 rounded-full bg-stock-in flex items-center justify-center mb-4">
            <Icon name="check" className="text-[32px]" />
          </span>
          <h1 className="font-display text-h-md small:text-h-xl font-extrabold">Pedido recebido!</h1>
          <p className="text-white/80 mt-2 text-body-lg">
            Pedido <strong data-testid="order-display-id">#{order.display_id}</strong> • confirmação enviada para{" "}
            <strong>{order.email}</strong>
          </p>
        </section>

        <section className="card-surface p-5 small:p-6 flex flex-col small:flex-row gap-4">
          <span className="w-12 h-12 rounded-ava-md bg-stock-low/10 text-stock-low flex items-center justify-center shrink-0">
            <Icon name="schedule" className="text-[26px]" />
          </span>
          <div className="flex-1">
            <p className="font-display text-h-sm text-ink">Pagamento a confirmar • {PAY_LABEL[method]}</p>
            <p className="text-body-md text-ink-soft mt-1">{instructions[method]}</p>
            {pixTotal !== null && <p className="text-body-md text-teal font-semibold mt-2">Valor no PIX: {fmt(pixTotal)} ({pixPercent}% OFF)</p>}
            {method === "card" && Number(meta.installments) > 1 && (
              <p className="text-body-md text-ink mt-2">Parcelamento escolhido: {meta.installments}x de {fmt((order.total ?? 0) / Number(meta.installments))}</p>
            )}
          </div>
          <ChatButton
            attrs={{ context: "pedido", order_id: order.id, order_number: order.display_id }}
            className="self-start h-11 px-4 rounded-ava-md bg-chat/10 text-chat text-label-md flex items-center gap-2"
          >
            <Icon name="forum" className="text-[20px]" /> Falar com a loja
          </ChatButton>
        </section>

        <div className="grid grid-cols-1 small:grid-cols-2 gap-5">
          <section className="card-surface p-5">
            <h2 className="font-display text-h-sm text-ink mb-3 flex items-center gap-2"><Icon name="location_on" className="text-[20px]" /> Entrega</h2>
            <p className="text-body-md text-ink font-semibold">{sa?.first_name} {sa?.last_name}</p>
            <p className="text-body-md text-ink-soft">{sa?.address_1}{sa?.address_2 ? ` • ${sa.address_2}` : ""}</p>
            <p className="text-body-md text-ink-soft">{saMeta.bairro ? `${saMeta.bairro} • ` : ""}{sa?.city}/{sa?.province} • CEP {sa?.postal_code}</p>
            {order.shipping_methods?.[0] && (
              <p className="text-body-md text-ink mt-2">{order.shipping_methods[0].name} • {fmt(order.shipping_methods[0].total ?? order.shipping_methods[0].amount ?? 0)}</p>
            )}
          </section>
          <section className="card-surface p-5">
            <h2 className="font-display text-h-sm text-ink mb-3 flex items-center gap-2"><Icon name="receipt" className="text-[20px]" /> Valores</h2>
            <dl className="flex flex-col gap-1.5 text-body-md">
              <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{fmt(order.item_subtotal ?? order.subtotal ?? 0)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-soft">Frete</dt><dd>{fmt(order.shipping_total ?? 0)}</dd></div>
              {(order.discount_total ?? 0) > 0 && <div className="flex justify-between text-teal"><dt>Descontos</dt><dd>- {fmt(order.discount_total ?? 0)}</dd></div>}
              <div className="flex justify-between border-t border-line pt-2 mt-1"><dt className="font-display font-bold">Total</dt><dd className="font-display font-bold text-h-sm">{fmt(order.total ?? 0)}</dd></div>
            </dl>
          </section>
        </div>

        <section className="card-surface p-5">
          <h2 className="font-display text-h-sm text-ink mb-3">Itens</h2>
          <ul className="flex flex-col gap-3">
            {(order.items || []).map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                <div className="w-14 shrink-0"><Thumbnail thumbnail={i.thumbnail} size="square" className="!p-1 !rounded-ava-md !shadow-none" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-semibold text-ink line-clamp-1">{i.product_title}</p>
                  <p className="text-body-sm text-ink-muted">{i.variant_title} • Qtd: {i.quantity}</p>
                </div>
                <span className="text-body-md font-bold">{fmt(i.total ?? 0)}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col small:flex-row gap-3 justify-center">
          <LocalizedClientLink href="/store" className="h-12 px-6 rounded-ava-md bg-brand text-white text-label-md flex items-center justify-center">Continuar comprando</LocalizedClientLink>
          <LocalizedClientLink href="/account/orders" className="h-12 px-6 rounded-ava-md bg-white border border-line text-ink text-label-md flex items-center justify-center">Meus pedidos</LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
