"use client"

import { openProductChat } from "@lib/util/chatwoot"
import Icon from "../icon"

export default function ProductChatButton({
  product,
}: {
  product: { id: string; title?: string; sku?: string | null; price?: string | null }
}) {
  return (
    <button
      type="button"
      onClick={() => openProductChat(product)}
      className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-ava-md bg-chat/10 hover:bg-chat hover:text-white text-chat text-label-sm transition-all"
      aria-label="Conversar sobre este produto"
    >
      <Icon name="forum" className="text-[18px]" />
      <span className="hidden small:inline">Conversar</span>
    </button>
  )
}
