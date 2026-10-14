"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"
import ChatButton from "@modules/avadesk/components/chatwoot/chat-button"
import { convertToLocale } from "@lib/util/money"
import { fmtDate, orderBadge, orderStep } from "@modules/account/components/order-card/status"
import React from "react"

const STEPS = [
  { label: "Confirmado", icon: "check" },
  { label: "Pago", icon: "payments" },
  { label: "Em separação", icon: "inventory_2" },
  { label: "Transportadora", icon: "local_shipping" },
  { label: "Entregue", icon: "home" },
]

const OrderDetailsTemplate: React.FC<{ order: HttpTypes.StoreOrder }> = ({ order }) => {
  const money = (v?: number | null) => convertToLocale({ amount: v ?? 0, currency_code: order.currency_code })
  const step = orderStep(order)
  const badge = orderBadge(order)
  const num = String(order.display_id).padStart(6, "0")
  const a = order.shipping_address
  const ship = order.shipping_methods?.[0]
  const pay = (order as any).payment_collections?.[0]?.payments?.[0]
  const first = order.items?.[0]
  const chatAttrs = { pedido: `#${num}`, status: badge.label, produto: first?.product_title || first?.title || "", total: money(order.total) }

  return (
    <div className="grid grid-cols-1 small:grid-cols-12 gap-4 small:gap-6" data-testid="order-details-container">
      <div className="small:col-span-8 flex flex-col gap-4 small:gap-6">
        <LocalizedClientLink href="/account/orders" className="inline-flex items-center gap-1 text-sm font-bold text-ink-soft hover:text-ink w-fit" data-testid="back-to-overview-button">
          <Icon name="arrow_back" className="text-[18px]" /> Voltar para Meus Pedidos
        </LocalizedClientLink>
        <section className="bg-white rounded-ava-xl border border-[#E2E8F0] shadow-sm p-4 small:p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-3 bg-subtle rounded-ava-lg p-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl small:text-2xl font-extrabold text-ink">Pedido #<span data-testid="order-id">{num}</span></h1>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${badge.cls}`} data-testid="order-status">{badge.label}</span>
              </div>
              <p className="text-sm text-ink-soft mt-1" data-testid="order-date">Realizado em {fmtDate(order.created_at, true)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold">Valor total</p>
              <p className="font-display text-xl small:text-3xl font-extrabold text-ink">{money(order.total)}</p>
            </div>
          </div>
          {/* Linha de rastreamento */}
          <div>
            <h2 className="font-bold text-ink flex items-center gap-2 mb-4"><Icon name="local_shipping" className="text-brand" /> Linha de rastreamento</h2>
            {step === -1 ? (
              <p className="text-sm text-[#EF4444] font-bold">Pedido cancelado.</p>
            ) : (
              <ol className="grid grid-cols-5 relative">
                <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-[#E2E8F0] rounded-full" />
                <div className="absolute top-5 left-[10%] h-1 bg-brand rounded-full transition-all" style={{ width: `${(Math.max(step, 0) / 4) * 80}%` }} />
                {STEPS.map((s, i) => (
                  <li key={s.label} className="relative flex flex-col items-center text-center gap-1">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow ${i < step ? "bg-brand text-white" : i === step ? "bg-navy text-white ring-2 ring-brand" : "bg-subtle text-ink-muted"}`}>
                      <Icon name={i < step ? "check" : s.icon} className="text-[18px]" />
                    </span>
                    <span className={`text-[11px] small:text-xs font-bold ${i <= step ? "text-ink" : "text-ink-muted"}`}>{s.label}</span>
                    {i === step && <span className="text-[10px] text-brand font-bold">Status atual</span>}
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-soft bg-subtle rounded-ava-md px-3 py-2">
            <Icon name="warehouse" className="text-[18px] text-navy" /> Expedição: <b className="text-ink">Depósito BOVINE — Unaí/MG</b>
          </div>
          {/* Itens */}
          <div>
            <h2 className="text-xs uppercase tracking-wider text-ink font-extrabold mb-3">Itens deste pedido</h2>
            <ul className="flex flex-col gap-3" data-testid="products-table">
              {order.items?.map((i) => (
                <li key={i.id} className="flex flex-col small:flex-row small:items-center gap-3 bg-subtle rounded-ava-lg p-3" data-testid="product-row">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-20 h-20 rounded-ava-md bg-white overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {i.thumbnail && <img src={i.thumbnail} alt={i.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      {i.variant_sku && <span className="inline-block text-[10px] font-bold bg-[#E2E8F0] text-ink-soft px-1.5 py-0.5 rounded">SKU: {i.variant_sku}</span>}
                      <p className="font-bold text-ink line-clamp-1" data-testid="product-name">{i.product_title || i.title}</p>
                      {i.variant_title && i.variant_title !== "Padrão" && <p className="text-xs text-ink-muted">{i.variant_title}</p>}
                      <p className="text-sm text-ink-soft">Qtd: <b>{i.quantity}</b> • <b className="text-ink">{money(i.total)}</b></p>
                    </div>
                  </div>
                  {i.product_handle && (
                    <LocalizedClientLink href={`/products/${i.product_handle}`} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-ava-md bg-brand text-white text-sm font-bold hover:bg-brand-dark">
                      <Icon name="replay" className="text-[18px]" /> Comprar novamente
                    </LocalizedClientLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <div className="grid grid-cols-1 small:grid-cols-2 gap-4 small:gap-6">
          <section className="bg-white rounded-ava-xl border border-[#E2E8F0] shadow-sm p-4 small:p-5" data-testid="shipping-address-summary">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-ink flex items-center gap-2"><Icon name="location_on" className="text-brand" /> Endereço de entrega</h3>
              {ship && <span className="text-[10px] font-bold bg-emerald-50 text-[#10B981] px-2 py-0.5 rounded-full">{ship.name}</span>}
            </div>
            {a ? (
              <div className="text-sm text-ink-soft bg-subtle rounded-ava-md p-3">
                <p className="font-bold text-ink">{a.first_name} {a.last_name}</p>
                <p>{a.address_1}{a.address_2 ? `, ${a.address_2}` : ""}</p>
                <p>{a.city} - {a.province}</p>
                <p className="text-xs text-ink-muted mt-1">CEP {a.postal_code}</p>
              </div>
            ) : <p className="text-sm text-ink-muted">Sem endereço.</p>}
          </section>
          <section className="bg-white rounded-ava-xl border border-[#E2E8F0] shadow-sm p-4 small:p-5" data-testid="order-summary">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-ink flex items-center gap-2"><Icon name="receipt" className="text-brand" /> Detalhes da cobrança</h3>
              {pay?.provider_id && <span className="text-[10px] font-bold bg-subtle text-ink-soft px-2 py-0.5 rounded-full uppercase">{String(pay.provider_id).replace(/^pp_/, "").replace(/_.*/, "")}</span>}
            </div>
            <div className="text-sm bg-subtle rounded-ava-md p-3 flex flex-col gap-1.5">
              <div className="flex justify-between"><span className="text-ink-soft">Subtotal ({order.items?.length} {order.items?.length === 1 ? "item" : "itens"})</span><span>{money(order.item_subtotal ?? order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink-soft">Frete</span><span>{money(order.shipping_total)}</span></div>
              {!!order.discount_total && <div className="flex justify-between text-[#10B981] font-bold"><span>Descontos</span><span>- {money(order.discount_total)}</span></div>}
              {!!order.tax_total && <div className="flex justify-between"><span className="text-ink-soft">Impostos</span><span>{money(order.tax_total)}</span></div>}
              <div className="flex justify-between items-center bg-white rounded-ava px-3 py-2 mt-1"><b className="text-ink">Total</b><b className="font-display text-lg text-ink">{money(order.total)}</b></div>
            </div>
          </section>
        </div>
      </div>
      {/* Pós-venda */}
      <aside className="small:col-span-4 flex flex-col gap-4 small:pt-9">
        <section className="bg-white rounded-ava-xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display font-extrabold text-ink flex items-center gap-2"><Icon name="support_agent" className="text-chat" /> Central Pós-Venda</h2>
            <span className="text-[10px] font-bold bg-emerald-50 text-[#10B981] px-2 py-1 rounded-full">Resposta em &lt; 2 min</span>
          </div>
          <p className="text-sm text-ink-soft">Dúvidas sobre aplicação, entrega ou nota fiscal deste pedido? Fale com nossa equipe técnica.</p>
          <ChatButton attrs={chatAttrs} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-ava-md bg-chat hover:opacity-90 text-white font-bold shadow-md">
            <Icon name="chat" className="text-[20px]" filled /> Falar sobre este pedido
          </ChatButton>
          <div className="rounded-ava-lg border border-[#E2E8F0] p-3 text-sm text-ink-soft">
            <p className="text-[10px] uppercase tracking-wider font-bold text-ink-muted mb-1 flex items-center gap-1"><Icon name="sync_alt" className="text-[14px]" /> Contexto enviado ao atendente</p>
            O atendente já recebe o <b className="text-ink">Pedido #{num}</b>, status <b className="text-brand">{badge.label}</b>{first ? <> e o item <b className="text-ink">{first.product_title || first.title}</b></> : null}.
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-ink-muted mb-2">Ações rápidas</p>
            <div className="flex flex-col gap-2">
              {[
                { icon: "edit_location", label: "Solicitar alteração de endereço" },
                { icon: "qr_code_2", label: "2ª via de boleto / chave Pix" },
                { icon: "assignment_return", label: "Política de devolução e garantia" },
                { icon: "description", label: "Solicitar nota fiscal" },
              ].map((q) => (
                <ChatButton key={q.label} attrs={{ ...chatAttrs, assunto: q.label }} className="flex items-center gap-2 text-sm text-ink px-3 py-2.5 rounded-ava-md bg-subtle hover:bg-[#E2E8F0] text-left">
                  <Icon name={q.icon} className="text-[18px] text-ink-soft" /> {q.label} <Icon name="chevron_right" className="ml-auto text-[18px] text-ink-muted" />
                </ChatButton>
              ))}
            </div>
          </div>
        </section>
        <LocalizedClientLink href="/store" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-ava-md bg-navy text-white font-bold hover:bg-navy-soft">
          <Icon name="storefront" className="text-[18px]" /> Continuar comprando
        </LocalizedClientLink>
      </aside>
    </div>
  )
}

export default OrderDetailsTemplate
