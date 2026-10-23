import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"
import OrderCard from "../order-card"

type OverviewProps = { customer: HttpTypes.StoreCustomer | null; orders: HttpTypes.StoreOrder[] | null }

const Overview = ({ customer, orders }: OverviewProps) => {
  const checks = [
    { ok: !!(customer?.first_name && customer?.last_name), label: "Nome completo", href: "/account/profile" },
    { ok: !!customer?.email, label: "E-mail", href: "/account/profile" },
    { ok: !!customer?.phone, label: "Telefone / WhatsApp", href: "/account/profile" },
    { ok: (customer?.addresses?.length ?? 0) > 0, label: "Endereço de entrega", href: "/account/addresses" },
  ]
  const pct = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
  const recent = (orders || []).slice(0, 3)
  const addr = customer?.addresses?.find((a) => a.is_default_shipping) || customer?.addresses?.[0]
  return (
    <div className="grid grid-cols-1 small:grid-cols-12 gap-4 small:gap-6" data-testid="overview-page-wrapper">
      <div className="small:col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg small:text-xl font-extrabold text-ink flex items-center gap-2">
            <Icon name="local_shipping" className="text-brand" filled /> Pedidos recentes
          </h2>
          <LocalizedClientLink href="/account/orders" className="text-sm font-bold text-brand hover:underline">Ver todos</LocalizedClientLink>
        </div>
        {recent.length ? (
          <ul className="flex flex-col gap-4" data-testid="orders-wrapper">
            {recent.map((o) => <li key={o.id}><OrderCard order={o} /></li>)}
          </ul>
        ) : (
          <div className="bg-white rounded-ava-xl border border-line p-8 text-center" data-testid="no-orders-container">
            <Icon name="shopping_bag" className="text-[40px] text-ink-muted" />
            <p className="font-bold text-ink mt-2">Você ainda não fez pedidos</p>
            <p className="text-sm text-ink-soft">Confira vacinas, sal mineral, kits solares e muito mais.</p>
            <LocalizedClientLink href="/store" className="inline-flex mt-4 px-5 py-2.5 rounded-ava-md bg-brand text-white text-sm font-bold">Ir para a loja</LocalizedClientLink>
          </div>
        )}
      </div>
      <aside className="small:col-span-4 flex flex-col gap-4">
        <div className="bg-white rounded-ava-xl border border-line shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-extrabold text-ink">Complete seu perfil</h3>
            <span className="text-sm font-extrabold text-brand" data-testid="customer-profile-completion" data-value={pct}>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-subtle overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-brand to-[#F59E0B] rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <ul className="flex flex-col gap-2">
            {checks.map((c) => (
              <li key={c.label}>
                <LocalizedClientLink href={c.href} className="flex items-center gap-2 text-sm px-3 py-2 rounded-ava-md bg-subtle hover:bg-[#E2E8F0]">
                  <Icon name={c.ok ? "check_circle" : "radio_button_unchecked"} className={c.ok ? "text-[#10B981] text-[18px]" : "text-ink-muted text-[18px]"} filled={c.ok} />
                  <span className={c.ok ? "text-ink-soft" : "text-ink font-bold"}>{c.label}</span>
                  {!c.ok && <Icon name="chevron_right" className="ml-auto text-ink-muted text-[18px]" />}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-ava-xl border border-line shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-extrabold text-ink flex items-center gap-2"><Icon name="location_on" className="text-brand" /> Endereço principal</h3>
            <span className="text-xs text-ink-muted" data-testid="addresses-count" data-value={customer?.addresses?.length || 0}>{customer?.addresses?.length || 0} salvo(s)</span>
          </div>
          {addr ? (
            <div className="text-sm text-ink-soft bg-subtle rounded-ava-md p-3">
              <p className="font-bold text-ink">{addr.first_name} {addr.last_name}</p>
              <p>{addr.address_1}{addr.address_2 ? `, ${addr.address_2}` : ""}</p>
              <p>{addr.city} - {addr.province} • CEP {addr.postal_code}</p>
            </div>
          ) : (
            <p className="text-sm text-ink-soft">Nenhum endereço cadastrado.</p>
          )}
          <LocalizedClientLink href="/account/addresses" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand">Gerenciar endereços <Icon name="arrow_forward" className="text-[16px]" /></LocalizedClientLink>
        </div>
      </aside>
    </div>
  )
}

export default Overview
