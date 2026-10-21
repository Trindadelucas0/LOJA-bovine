import { retrieveCart } from "@lib/data/cart"
import { listCategories } from "@lib/data/categories"
import { retrieveCustomer } from "@lib/data/customer"
import { AvaSettings, storeName } from "@lib/data/avadesk-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "../icon"
import SmartLink from "../smart-link"
import ChatButton from "../chatwoot/chat-button"
import CategoriesMenu from "./categories-menu"
import SearchBar from "./search-bar"
import Logo from "./logo"
import CartDropdown from "./cart-dropdown"

export default async function AvaHeader({
  settings,
  chatEnabled,
}: {
  settings: AvaSettings
  chatEnabled: boolean
}) {
  const [cart, customer, categories] = await Promise.all([
    retrieveCart().catch(() => null),
    retrieveCustomer().catch(() => null),
    listCategories({ fields: "id,name,handle,parent_category_id,rank" }).catch(() => []),
  ])
  const count = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) ?? 0
  const name = storeName(settings)
  const cats = (categories || []).filter((c) => !c.parent_category_id).map((c) => ({ id: c.id, name: c.name, handle: c.handle }))
  const links = settings.header_links || []

  const CartLink = ({ className }: { className: string }) => (
    <LocalizedClientLink href="/cart" className={className} aria-label="Carrinho" data-testid="nav-cart-link">
      <Icon name="shopping_bag" className="text-[22px]" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </LocalizedClientLink>
  )

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(14,36,57,0.06)]">
      {/* Desktop */}
      <div className="hidden medium:flex h-20 max-w-page mx-auto px-margin items-center justify-between gap-gutter">
        <Logo name={name} logoUrl={settings.logo_url} />
        <div className="flex flex-1 min-w-[180px] max-w-2xl items-center bg-subtle rounded-ava-md p-1 focus-within:ring-2 focus-within:ring-navy/20">
          <CategoriesMenu categories={cats} />
          <div className="h-5 w-px bg-line-strong mx-1" />
          <SearchBar />
        </div>
        {links.length > 0 && (
          <nav className="flex items-center gap-1 min-w-0 shrink-0 whitespace-nowrap">
            {links.map((l, i) => (
              <SmartLink
                key={i}
                href={l.url}
                className="text-label-md text-ink-soft hover:text-ink hover:bg-subtle rounded-ava px-3 py-1.5 transition-colors"
              >
                {l.label}
              </SmartLink>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2 shrink-0">
          {chatEnabled && (
            <ChatButton
              className="relative p-2 text-ink-soft hover:text-ink hover:bg-subtle rounded-full transition-colors flex items-center"
              aria-label="Atendimento"
            >
              <Icon name="support_agent" className="text-[22px]" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-stock-in rounded-full ring-2 ring-white" />
            </ChatButton>
          )}
          <CartDropdown cart={cart} />
          <div className="h-6 w-px bg-line mx-1" />
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-subtle transition-colors"
            data-testid="nav-account-link"
          >
            <span className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center">
              <Icon name="person" className="text-[18px]" />
            </span>
            <span className="text-label-sm text-ink-soft max-w-[120px] truncate">
              {customer ? `Olá, ${customer.first_name || "cliente"}` : "Entrar"}
            </span>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Mobile */}
      <div className="medium:hidden px-margin-m pt-2 pb-2 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Logo name={name} logoUrl={settings.logo_url} compact />
          <div className="flex items-center gap-1.5">
            {chatEnabled && (
              <ChatButton
                className="relative w-10 h-10 rounded-full flex items-center justify-center bg-subtle text-navy"
                aria-label="Atendimento"
              >
                <Icon name="support_agent" className="text-[22px]" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-stock-in ring-2 ring-white" />
              </ChatButton>
            )}
            <CartLink className="relative w-10 h-10 rounded-full flex items-center justify-center bg-subtle text-navy" />
            <LocalizedClientLink href="/account" className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center" aria-label="Minha conta">
              <Icon name="person" className="text-[18px]" />
            </LocalizedClientLink>
          </div>
        </div>
        <div className="bg-subtle rounded-ava-md flex items-center">
          <SearchBar compact />
        </div>
      </div>
    </header>
  )
}
