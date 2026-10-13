"use client"

import { useState } from "react"
import { openChat } from "@lib/util/chatwoot"
import ChatFallback from "./chat-fallback"

type Props = {
  className?: string
  children: React.ReactNode
  attrs?: Record<string, string | number | boolean | null | undefined>
  [x: string]: unknown
}

export default function ChatButton({ className, children, attrs, ...rest }: Props) {
  const [failed, setFailed] = useState(false)
  return (
    <>
      <button type="button" className={className} onClick={() => setFailed(!openChat(attrs))} {...rest}>
        {children}
      </button>
      {failed && (
        <div className="fixed bottom-20 small:bottom-6 inset-x-4 small:left-auto small:right-6 small:w-96 z-[60] shadow-xl">
          <ChatFallback onClose={() => setFailed(false)} />
        </div>
      )}
    </>
  )
}
