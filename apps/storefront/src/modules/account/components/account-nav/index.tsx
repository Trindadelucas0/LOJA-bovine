"use client"

import { useParams, usePathname } from "next/navigation"
import { signout } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"
import { clx } from "@modules/common/components/ui"

const TABS = [
  { href: "/account", label: "Visão Geral", icon: "dashboard", testid: "overview-link" },
  { href: "/account/orders", label: "Meus Pedidos", icon: "local_shipping", testid: "orders-link" },
  { href: "/account/addresses", label: "Endereços", icon: "location_on", testid: "addresses-link" },
  { href: "/account/profile", label: "Perfil & Segurança", icon: "shield_person", testid: "profile-link" },
]

const AccountNav = ({ customer }: { customer: HttpTypes.StoreCustomer | null }) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const active = (href: string) => {
    const full = `/${countryCode}${href}`
    return href === "/account" ? route === full : route.startsWith(full)
  }
  return (
    <nav data-testid="account-nav">
      {/* Celular: lista vertical de linhas grandes, mais facil de acertar o toque */}
      <ul className="small:hidden flex flex-col gap-2">
        {TABS.map((t) => (
          <li key={t.href}>
            <LocalizedClientLink
              href={t.href}
              data-testid={t.testid}
              aria-current={active(t.href) ? "page" : undefined}
              className={clx(
                "flex items-center gap-3 min-h-16 px-4 rounded-ava-lg border transition-colors",
                active(t.href)
                  ? "bg-navy text-white border-navy shadow-raised"
                  : "card-surface text-ink hover:border-line-strong"
              )}
            >
              <span
                className={clx(
                  "w-11 h-11 rounded-full flex items-center justify-center shrink-0",
                  active(t.href) ? "bg-white/15 text-white" : "bg-subtle text-navy"
                )}
              >
                <Icon name={t.icon} className="text-[24px]" filled={active(t.href)} />
              </span>
              <span className="flex-1 text-body-lg font-bold">{t.label}</span>
              <Icon
                name="chevron_right"
                className={clx("text-[24px]", active(t.href) ? "text-white/70" : "text-ink-muted")}
              />
            </LocalizedClientLink>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => signout(countryCode)}
            data-testid="logout-button"
            className="w-full flex items-center justify-center gap-2 h-13 rounded-ava-lg bg-card border border-line-strong text-stock-out text-label-md hover:bg-stock-out/5 transition-colors"
          >
            <Icon name="logout" className="text-[22px]" /> Sair da conta
          </button>
        </li>
      </ul>

      {/* Telas maiores: abas em linha */}
      <div className="hidden small:flex items-center gap-2">
        {TABS.map((t) => (
          <LocalizedClientLink
            key={t.href}
            href={t.href}
            aria-current={active(t.href) ? "page" : undefined}
            className={clx(
              "shrink-0 inline-flex items-center gap-2 h-12 px-4 rounded-ava-md text-label-md transition-all border",
              active(t.href)
                ? "bg-navy text-white border-navy shadow-raised"
                : "bg-card text-ink-soft border-line hover:border-navy/40 hover:text-ink"
            )}
          >
            <Icon name={t.icon} className="text-[20px]" filled={active(t.href)} />
            {t.label}
          </LocalizedClientLink>
        ))}
        <button
          type="button"
          onClick={() => signout(countryCode)}
          className="shrink-0 ml-auto inline-flex items-center gap-2 h-12 px-4 rounded-ava-md text-label-md bg-card text-stock-out border border-line hover:bg-stock-out/5 transition-colors"
        >
          <Icon name="logout" className="text-[20px]" /> Sair
        </button>
      </div>
    </nav>
  )
}

export default AccountNav
