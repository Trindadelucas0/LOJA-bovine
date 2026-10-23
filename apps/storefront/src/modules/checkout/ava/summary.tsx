import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import Thumbnail from "@modules/products/components/thumbnail"
import DiscountCode from "@modules/checkout/components/discount-code"
import Icon from "@modules/avadesk/components/icon"
import ChatButton from "@modules/avadesk/components/chatwoot/chat-button"

export default function CheckoutSummary({ cart, pixPercent, maxInstallments }: { cart: HttpTypes.StoreCart; pixPercent?: number | null; maxInstallments?: number | null }) {
  const currency = cart.currency_code
  const fmt = (n: number) => convertToLocale({ amount: n, currency_code: currency })
  const items = cart.items || []
  const count = items.reduce((a, i) => a + i.quantity, 0)
  const total = cart.total ?? 0
  const pix = pixPercent && pixPercent > 0 ? total * (1 - pixPercent / 100) : null
  return (
    <div className="flex flex-col gap-4 small:sticky small:top-6">
    <aside className="card-surface small:rounded-ava-xl p-4 small:p-6 flex flex-col gap-4" data-testid="checkout-summary">
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
        {pix !== null && (
          <div className="flex justify-between text-teal"><dt className="inline-flex items-center gap-1"><Icon name="qr_code_2" className="text-[16px]" /> Desconto especial PIX ({pixPercent}%)</dt><dd>- {fmt(total - pix)}</dd></div>
        )}
        {(cart.tax_total ?? 0) > 0 && (
          <div className="flex justify-between"><dt className="text-ink-soft">Impostos</dt><dd>{fmt(cart.tax_total ?? 0)}</dd></div>
        )}
      </dl>
      <div className="flex items-end justify-between border-t border-line pt-3">
        <span className="flex flex-col">
          <span className="font-display text-h-sm text-ink">Total a pagar</span>
          {(maxInstallments ?? 1) > 1 && <span className="text-body-sm text-ink-muted">ou até {maxInstallments}x de {fmt(total / (maxInstallments ?? 1))} sem juros</span>}
        </span>
        <div className="text-right">
          <span className="font-display text-price-display text-ink block" data-testid="cart-total">{fmt(pix ?? total)}</span>
          {pix !== null && <span className="text-body-sm text-teal font-semibold block">no PIX • {fmt(total)} no cartão</span>}
        </div>
      </div>
      <div className="rounded-ava-md bg-subtle p-3 flex gap-2 text-body-sm text-ink-soft">
        <Icon name="verified_user" className="text-[20px] text-stock-in" />
        Compra protegida: seus dados são enviados de forma segura.
      </div>
      <a href="#checkout-flow" className="hidden small:flex h-14 rounded-ava-md bg-brand hover:bg-brand-dark text-white text-label-md items-center justify-center gap-2 shadow-brand-glow uppercase tracking-wide">
        <Icon name="lock" className="text-[20px]" /> Finalizar compra com segurança
      </a>
    </aside>
    <div className="card-surface small:rounded-ava-xl p-4 border-l-4 border-stock-in">
      <p className="font-display font-bold text-ink flex items-center gap-2 text-body-md"><Icon name="verified_user" className="text-[18px] text-stock-in" /> Garantia de Compra Protegida BOVINE</p>
      <p className="text-body-sm text-ink-soft mt-1">Seu pagamento fica protegido até você receber o produto. Suporte técnico humano e devolução em até 7 dias.</p>
    </div>
    <div className="rounded-ava-lg small:rounded-ava-xl bg-navy text-white p-4 flex items-center gap-3">
      <span className="w-10 h-10 rounded-full bg-chat flex items-center justify-center shrink-0"><Icon name="forum" className="text-[20px]" /></span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-body-md">Dúvida antes de pagar?</p>
        <p className="text-body-sm text-white/70">Especialistas prontos no chat</p>
      </div>
      <ChatButton attrs={{ origem: "checkout" }} className="h-11 px-4 rounded-ava-md bg-card text-navy text-label-md shrink-0 flex items-center">Falar agora</ChatButton>
    </div>
    </div>
  )
}
