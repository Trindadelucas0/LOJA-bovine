import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative min-h-16 py-2 mx-auto border-b duration-200 bg-white border-ui-border-base small:h-16 small:py-0">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle grid w-full min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 text-small-regular small:flex small:h-full small:justify-between">
          <div className="flex h-full min-w-0 items-center small:flex-1 small:basis-0">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-center overflow-hidden small:shrink-0">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus truncate text-center hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              Minha Loja
            </LocalizedClientLink>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-x-3 small:h-full small:flex-1 small:basis-0 small:gap-x-6">
            <div className="hidden min-w-0 small:block">
              <Search />
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Conta
              </LocalizedClientLink>
            </div>
            <div className="small:hidden">
              <Search />
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Carrinho (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}

