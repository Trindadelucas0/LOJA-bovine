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
    `flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[11px] font-semibold ${active ? "text-brand" : "text-ink-soft"}`

  return (
    <nav
      className="small:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-line"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16">
        <LocalizedClientLink href="/" className={item(isActive(""))}>
          <Icon name="home" className="text-[24px]" filled={isActive("")} />
          Início
        </LocalizedClientLink>
        <Search
          trigger={(open) => (
            <button type="button" onClick={open} className={item(false)}>
              <Icon name="search" className="text-[24px]" />
              Buscar
            </button>
          )}
        />
        <LocalizedClientLink href="/cart" className={item(isActive("/cart"))}>
          <span className="relative">
            <Icon name="shopping_cart" className="text-[24px]" filled={isActive("/cart")} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </span>
          Carrinho
        </LocalizedClientLink>
        <LocalizedClientLink href="/account" className={item(isActive("/account"))}>
          <Icon name="person" className="text-[24px]" filled={isActive("/account")} />
          Conta
        </LocalizedClientLink>
      </div>
    </nav>
  )
}
