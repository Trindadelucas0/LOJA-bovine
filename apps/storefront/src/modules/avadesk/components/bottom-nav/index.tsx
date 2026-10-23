"use client"

import { useParams, usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Search from "@modules/layout/components/search"
import Icon from "../icon"

/** Navegação fixa inferior (somente mobile). */
export default function BottomNav({ cartCount }: { cartCount: number }) {
  const pathname = usePathname()
  const { countryCode } = useParams()
  const base = `/${countryCode}`
  const isActive = (p: string) => (p === "" ? pathname === base || pathname === `${base}/` : pathname.startsWith(`${base}${p}`))

  const item = (active: boolean) =>
    `relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[12px] font-bold ${active ? "text-brand" : "text-ink-soft"}`

  return (
    <nav
      className="small:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-line shadow-sticky"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-[68px]">
        <LocalizedClientLink href="/" className={item(isActive(""))}>
          {isActive("") && <span className="absolute top-0 inset-x-5 h-[3px] rounded-b bg-brand" />}
          <Icon name="home" className="text-[26px]" filled={isActive("")} />
          Início
        </LocalizedClientLink>
        <Search
          trigger={(open) => (
            <button type="button" onClick={open} className={item(false)}>
              <Icon name="search" className="text-[26px]" />
              Buscar
            </button>
          )}
        />
        <LocalizedClientLink href="/cart" className={item(isActive("/cart"))}>
          {isActive("/cart") && <span className="absolute top-0 inset-x-5 h-[3px] rounded-b bg-brand" />}
          <span className="relative">
            <Icon name="shopping_cart" className="text-[26px]" filled={isActive("/cart")} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 min-w-[20px] h-5 px-1 rounded-full bg-brand text-white text-[12px] font-bold flex items-center justify-center ring-2 ring-card">
                {cartCount}
              </span>
            )}
          </span>
          Carrinho
        </LocalizedClientLink>
        <LocalizedClientLink href="/account" className={item(isActive("/account"))}>
          {isActive("/account") && <span className="absolute top-0 inset-x-5 h-[3px] rounded-b bg-brand" />}
          <Icon name="person" className="text-[26px]" filled={isActive("/account")} />
          Conta
        </LocalizedClientLink>
      </div>
    </nav>
  )
}
