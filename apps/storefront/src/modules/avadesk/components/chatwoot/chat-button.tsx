"use client"

import { openChat } from "@lib/util/chatwoot"

type Props = {
  className?: string
  children: React.ReactNode
  attrs?: Record<string, string | number | boolean | null | undefined>
  [x: string]: unknown
}

export default function ChatButton({ className, children, attrs, ...rest }: Props) {
  return (
    <button type="button" className={className} onClick={() => openChat(attrs)} {...rest}>
      {children}
    </button>
  )
}
