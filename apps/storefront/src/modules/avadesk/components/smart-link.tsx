"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { openChat } from "@lib/util/chatwoot"

/** Link configurável no admin: "#chat" abre o atendimento, URLs externas abrem em nova aba, caminhos internos mantêm o país. */
export default function SmartLink({
  href,
  className,
  children,
}: {
  href?: string | null
  className?: string
  children: React.ReactNode
}) {
  const url = (href || "#").trim()
  if (url === "#chat") {
    return (
      <button type="button" className={className} onClick={() => openChat()}>
        {children}
      </button>
    )
  }
  if (/^(https?:|mailto:|tel:)/.test(url)) {
    return (
      <a href={url} className={className} target={url.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {children}
      </a>
    )
  }
  if (url.startsWith("#")) {
    return <a href={url} className={className}>{children}</a>
  }
  return (
    <LocalizedClientLink href={url.startsWith("/") ? url : `/${url}`} className={className}>
      {children}
    </LocalizedClientLink>
  )
}
