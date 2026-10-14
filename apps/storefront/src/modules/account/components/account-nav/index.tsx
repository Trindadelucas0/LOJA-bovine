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
    <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 small:mx-0 small:px-0" data-testid="account-nav">
      {TABS.map((t) => (
        <LocalizedClientLink
          key={t.href}
          href={t.href}
          data-testid={t.testid}
          className={clx(
            "shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-ava-md text-sm font-bold transition-all border",
            active(t.href)
              ? "bg-navy text-white border-navy shadow-md"
              : "bg-white text-ink-soft border-[#E2E8F0] hover:border-navy/30 hover:text-ink"
          )}
        >
          <Icon name={t.icon} className="text-[18px]" filled={active(t.href)} />
          {t.label}
        </LocalizedClientLink>
      ))}
      <button
        type="button"
        onClick={() => signout(countryCode)}
        data-testid="logout-button"
        className="shrink-0 ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-ava-md text-sm font-bold bg-white text-[#EF4444] border border-[#E2E8F0] hover:bg-red-50"
      >
        <Icon name="logout" className="text-[18px]" /> Sair
      </button>
    </nav>
  )
}

export default AccountNav
