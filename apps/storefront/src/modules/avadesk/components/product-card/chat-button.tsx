"use client"

import { useState } from "react"
import { openProductChat, ProductChatContext } from "@lib/util/chatwoot"
import Icon from "../icon"
import ChatFallback from "../chatwoot/chat-fallback"

export default function ProductChatButton({ product }: { product: ProductChatContext }) {
  const [failed, setFailed] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setFailed(!openProductChat(product))}
        className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-ava-md bg-chat/10 hover:bg-chat hover:text-white text-chat text-label-sm transition-all"
        aria-label="Conversar sobre este produto"
      >
        <Icon name="forum" className="text-[18px]" />
        <span className="hidden small:inline">Conversar</span>
      </button>
      {failed && (
        <div className="fixed bottom-20 small:bottom-6 inset-x-4 small:left-auto small:right-6 small:w-96 z-[60] shadow-xl">
          <ChatFallback onClose={() => setFailed(false)} />
        </div>
      )}
    </>
  )
}
