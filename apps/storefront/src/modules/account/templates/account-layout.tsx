import React from "react"
import { HttpTypes } from "@medusajs/types"
import AccountNav from "../components/account-nav"
import Icon from "@modules/avadesk/components/icon"
import ChatButton from "@modules/avadesk/components/chatwoot/chat-button"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

function initials(c: HttpTypes.StoreCustomer) {
  const s = `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.email
  return s.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {
  if (!customer) {
    return (
      <div className="flex-1 bg-canvas py-8 small:py-12" data-testid="account-page">
        <div className="content-container max-w-xl mx-auto">
          <div className="card-surface rounded-ava-xl border border-line p-6 small:p-10">{children}</div>
        </div>
      </div>
    )
  }
  const since = new Date(customer.created_at || Date.now()).getFullYear()
  const name = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Cliente"
  return (
    <div className="flex-1 bg-canvas pb-nav" data-testid="account-page">
      <div className="content-container max-w-[1200px] mx-auto pt-4 small:pt-8 flex flex-col gap-4 small:gap-6">
        {/* Cabeçalho do cliente (wireframe: detalhes_do_pedido / minha_conta mobile) */}
        <section className="relative overflow-hidden rounded-ava-xl bg-gradient-to-br from-navy-deep via-navy to-navy-soft text-white small:bg-none small:bg-white small:text-ink small:border small:border-line shadow-md small:shadow-sm p-5 small:p-6">
          <div className="flex flex-col small:flex-row small:items-center gap-4 small:gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative shrink-0">
                <div className="w-16 h-16 small:w-20 small:h-20 rounded-full bg-brand text-white font-display font-extrabold text-xl small:text-2xl flex items-center justify-center ring-4 ring-white/20 small:ring-brand-light">
                  {initials(customer)}
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-stock-in border-2 border-white" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-xl small:text-2xl font-extrabold truncate" data-testid="welcome-message" data-value={customer.first_name}>
                    Olá, {name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/20 small:bg-navy text-brand-light small:text-white text-[10px] font-bold uppercase tracking-wider">
                    <Icon name="agriculture" className="text-[12px]" filled /> Cliente Produtor
                  </span>
                </div>
                <p className="text-sm text-white/70 small:text-ink-soft truncate" data-testid="customer-email" data-value={customer.email}>
                  {customer.email} • Cliente desde {since}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-ava-lg bg-white/10 small:bg-subtle border border-white/10 small:border-line p-3 small:min-w-[340px]">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/60 small:text-ink-muted font-bold">Atendimento</p>
                <p className="text-sm font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stock-in" /> Suporte técnico online</p>
              </div>
              <ChatButton
                attrs={{ origem: "minha_conta", email: customer.email }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-ava-md bg-brand small:bg-navy hover:opacity-90 text-white text-sm font-bold"
              >
                <Icon name="forum" className="text-[18px]" /> Atendimento
              </ChatButton>
            </div>
          </div>
        </section>
        <AccountNav customer={customer} />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}

export default AccountLayout
