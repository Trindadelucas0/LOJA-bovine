"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartItemRow from "@modules/cart/ava/cart-item"
import Icon from "../icon"

/** Mini-carrinho do header (desktop): abre ao passar o mouse e ao adicionar itens. */
export default function CartDropdown({ cart }: { cart: HttpTypes.StoreCart | null }) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const items = cart?.items || []
  const count = items.reduce((a, i) => a + i.quantity, 0)
  const prev = useRef(count)

  useEffect(() => {
    if (count > prev.current && !pathname.includes("/cart")) {
      setOpen(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setOpen(false), 5000)
    }
    prev.current = count
  }, [count, pathname])

  const enter = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(true)
  }
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 200)
  }
  const currency = cart?.currency_code || "brl"

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <LocalizedClientLink
        href="/cart"
        className="relative p-2 text-ink-soft hover:text-ink hover:bg-subtle rounded-full transition-colors flex items-center"
        aria-label="Carrinho"
        data-testid="nav-cart-link"
      >
        <Icon name="shopping_bag" className="text-[22px]" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
            {count}
          </span>
        )}
      </LocalizedClientLink>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-ava-xl shadow-2xl border border-line p-5 z-50" data-testid="nav-cart-dropdown">
          <h3 className="font-display text-h-sm text-ink mb-3">Carrinho ({count})</h3>
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <Icon name="shopping_cart" className="text-[40px] text-ink-muted" />
              <p className="text-body-md text-ink-soft">Seu carrinho está vazio.</p>
              <LocalizedClientLink href="/store" onClick={() => setOpen(false)} className="h-10 px-4 rounded-ava-md bg-brand text-white text-label-sm flex items-center">
                Ver produtos
              </LocalizedClientLink>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
                {items.map((i) => (
                  <CartItemRow key={i.id} item={i} currency={currency} compact />
                ))}
              </ul>
              <div className="flex justify-between border-t border-line mt-3 pt-3">
                <span className="text-body-md text-ink-soft">Subtotal</span>
                <span className="font-display font-bold">{convertToLocale({ amount: cart?.item_subtotal ?? cart?.subtotal ?? 0, currency_code: currency })}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <LocalizedClientLink href="/cart" onClick={() => setOpen(false)} className="h-11 rounded-ava-md border border-line text-label-sm flex items-center justify-center">
                  Ver carrinho
                </LocalizedClientLink>
                <LocalizedClientLink href="/checkout?step=address" onClick={() => setOpen(false)} className="h-11 rounded-ava-md bg-brand text-white text-label-sm flex items-center justify-center">
                  Finalizar
                </LocalizedClientLink>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
