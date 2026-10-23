import { getAvaContent, storeName } from "@lib/data/avadesk-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"
import Logo from "@modules/avadesk/components/header/logo"
import ChatButton from "@modules/avadesk/components/chatwoot/chat-button"
import ChatwootWidget from "@modules/avadesk/components/chatwoot/widget"
import { chatConfig } from "@lib/util/chat-config"

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getAvaContent()
  const chat = chatConfig(settings)
  return (
    <div className="w-full bg-canvas relative min-h-screen">
      <header className="h-16 small:h-20 bg-white shadow-header">
        <nav className="max-w-page mx-auto px-margin-m small:px-margin h-full flex items-center justify-between gap-3">
          <LocalizedClientLink href="/cart" className="flex items-center gap-1 text-label-sm text-ink-soft hover:text-ink" data-testid="back-to-cart-link">
            <Icon name="arrow_back" className="text-[22px]" />
            <span className="hidden small:inline">Voltar ao carrinho</span>
          </LocalizedClientLink>
          <Logo name={storeName(settings)} logoUrl={settings.logo_url} compact />
          <div className="flex items-center gap-2">
            <span className="hidden small:inline-flex items-center gap-1 text-label-xs text-stock-in bg-stock-in/10 rounded-full px-3 py-1">
              <Icon name="lock" className="text-[14px]" /> Checkout seguro
            </span>
            <ChatButton className="w-10 h-10 rounded-full bg-subtle text-navy flex items-center justify-center" aria-label="Ajuda com o pedido">
              <Icon name="support_agent" className="text-[22px]" />
            </ChatButton>
          </div>
        </nav>
      </header>
      <div className="relative" data-testid="checkout-container">{children}</div>
      {chat.enabled && <ChatwootWidget baseUrl={chat.baseUrl} websiteToken={chat.websiteToken} />}
    </div>
  )
}
