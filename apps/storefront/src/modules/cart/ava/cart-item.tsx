"use client"

import { useState, useTransition } from "react"
import { HttpTypes } from "@medusajs/types"
import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import Icon from "@modules/avadesk/components/icon"

export default function CartItemRow({ item, currency, compact }: { item: HttpTypes.StoreCartLineItem; currency: string; compact?: boolean }) {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const v = item.variant
  const max = v?.manage_inventory && !v?.allow_backorder ? Math.max(1, v.inventory_quantity ?? 99) : 99
  const fmt = (n: number) => convertToLocale({ amount: n, currency_code: currency })

  const change = (q: number) =>
    start(async () => {
      setError(null)
      try {
        await updateLineItem({ lineId: item.id, quantity: q })
      } catch (e: any) {
        setError(e?.message || "Não foi possível atualizar a quantidade.")
      }
    })
  const remove = () =>
    start(async () => {
      try {
        await deleteLineItem(item.id)
      } catch (e: any) {
        setError(e?.message || "Não foi possível remover.")
      }
    })

  return (
    <li className={`flex gap-3 small:gap-4 ${pending ? "opacity-60" : ""}`} data-testid="product-row">
      <LocalizedClientLink href={`/products/${item.product_handle}`} className={compact ? "w-16 shrink-0" : "w-20 small:w-24 shrink-0"}>
        <Thumbnail thumbnail={item.thumbnail} size="square" className="!p-1 !rounded-ava-md !shadow-none !bg-subtle" />
      </LocalizedClientLink>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <LocalizedClientLink href={`/products/${item.product_handle}`} className="font-display text-body-md font-bold text-ink line-clamp-2 hover:text-brand" data-testid="product-title">
            {item.product_title}
          </LocalizedClientLink>
          <button type="button" onClick={remove} disabled={pending} aria-label="Remover item" className="text-ink-muted hover:text-stock-out shrink-0" data-testid="product-delete-button">
            <Icon name="delete" className="text-[20px]" />
          </button>
        </div>
        {item.variant_title && item.variant_title !== "Default variant" && (
          <span className="text-body-sm text-ink-muted">{item.variant_title}</span>
        )}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <div className="flex items-center rounded-ava-md border border-line bg-white">
            <button type="button" aria-label="Diminuir" disabled={pending || item.quantity <= 1} onClick={() => change(item.quantity - 1)} className="w-8 h-8 flex items-center justify-center disabled:opacity-40">
              <Icon name="remove" className="text-[18px]" />
            </button>
            <span className="w-8 text-center text-label-md" data-testid="product-quantity">{item.quantity}</span>
            <button type="button" aria-label="Aumentar" disabled={pending || item.quantity >= max} onClick={() => change(item.quantity + 1)} className="w-8 h-8 flex items-center justify-center disabled:opacity-40">
              <Icon name="add" className="text-[18px]" />
            </button>
          </div>
          <div className="text-right">
            {item.quantity > 1 && <span className="block text-body-sm text-ink-muted">{fmt(item.unit_price)} cada</span>}
            <span className="font-display font-bold text-ink" data-testid="product-price">{fmt(item.total ?? item.unit_price * item.quantity)}</span>
          </div>
        </div>
        {error && <span className="text-body-sm text-danger">{error}</span>}
      </div>
    </li>
  )
}
