"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { isEqual } from "lodash"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import { getPricesForVariant, getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import { openProductChat } from "@lib/util/chatwoot"
import Icon from "../icon"
import ChatFallback from "../chatwoot/chat-fallback"
import { variantStock } from "./meta"

const optionsAsKeymap = (opts: HttpTypes.StoreProductVariant["options"]) =>
  (opts || []).reduce((acc: Record<string, string>, o) => {
    if (o.option_id) acc[o.option_id] = o.value
    return acc
  }, {})

export type BuyBoxProps = {
  product: HttpTypes.StoreProduct
  pixPercent?: number | null
  maxInstallments?: number | null
  maxQty?: number | null
  whatsapp?: string | null
  email?: string | null
  customer?: { email?: string | null; name?: string | null } | null
  categoryName?: string | null
}

export default function BuyBox({
  product,
  pixPercent,
  maxInstallments,
  maxQty,
  whatsapp,
  email,
  customer,
  categoryName,
}: BuyBoxProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string

  const variants = product.variants || []
  const initial = useMemo(() => {
    const vId = searchParams.get("v_id")
    const v = variants.find((x) => x.id === vId) || (variants.length === 1 ? variants[0] : undefined)
    return v ? optionsAsKeymap(v.options) : {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [options, setOptions] = useState<Record<string, string | undefined>>(initial)
  const [qty, setQty] = useState(1)
  const [busy, setBusy] = useState<"cart" | "buy" | null>(null)
  const [added, setAdded] = useState(false)
  const [chatFailed, setChatFailed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selected = useMemo(
    () => variants.find((v) => isEqual(optionsAsKeymap(v.options), options)),
    [variants, options]
  )

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = selected?.id ?? null
    if (params.get("v_id") === value) return
    value ? params.set("v_id", value) : params.delete("v_id")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  const price = selected
    ? getPricesForVariant(selected as any)
    : getProductPrice({ product }).cheapestPrice
  const stock = variantStock(selected)
  const limit = Math.max(1, Math.min(maxQty || 99, stock.qty ?? 99))
  useEffect(() => setQty((q) => Math.min(q, limit)), [limit])

  const pix =
    price && pixPercent && pixPercent > 0
      ? convertToLocale({ amount: price.calculated_price_number * (1 - pixPercent / 100), currency_code: price.currency_code })
      : null
  const installments =
    price && maxInstallments && maxInstallments > 1
      ? `${maxInstallments}x de ${convertToLocale({
          amount: price.calculated_price_number / maxInstallments,
          currency_code: price.currency_code,
        })} sem juros`
      : null
  const hasDiscount = price && price.original_price_number > price.calculated_price_number

  const canBuy = !!selected && stock.state !== "out"
  const label = !selected ? "Selecione as opções" : stock.state === "out" ? "Esgotado" : null

  const add = async (mode: "cart" | "buy") => {
    if (!selected) return
    setBusy(mode)
    setError(null)
    try {
      await addToCart({ variantId: selected.id, quantity: qty, countryCode })
      if (mode === "buy") {
        router.push(`/${countryCode}/checkout?step=address`)
      } else {
        setAdded(true)
        setTimeout(() => setAdded(false), 3000)
      }
    } catch (e: any) {
      setError(e?.message || "Não foi possível adicionar ao carrinho.")
    } finally {
      setBusy(null)
    }
  }

  const chat = () => {
    const ok = openProductChat({
      id: product.id,
      title: product.title,
      handle: product.handle,
      image: product.thumbnail,
      sku: selected?.sku,
      variant: selected?.title,
      variant_id: selected?.id,
      price: price?.calculated_price,
      quantity: qty,
      customer_email: customer?.email,
      customer_name: customer?.name,
    })
    setChatFailed(!ok)
  }

  const stockBadge = {
    in: { text: stock.qty ? `Em estoque: ${stock.qty} un` : "Em estoque", cls: "bg-stock-in/10 text-stock-in", dot: "bg-stock-in" },
    low: { text: `Últimas ${stock.qty} unidades`, cls: "bg-stock-low/10 text-stock-low", dot: "bg-stock-low" },
    out: { text: selected ? "Esgotado" : "Selecione as opções", cls: selected ? "bg-stock-out/10 text-stock-out" : "bg-subtle text-ink-soft", dot: selected ? "bg-stock-out" : "bg-ink-muted" },
  }[stock.state]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-xs uppercase ${stockBadge.cls}`} data-testid="stock-state">
          <span className={`w-2 h-2 rounded-full ${stockBadge.dot}`} />
          {stockBadge.text}
        </span>
        {selected?.sku && <span className="text-label-xs text-ink-muted uppercase">SKU: {selected.sku}</span>}
        {categoryName && <span className="text-label-xs text-ink-muted">· {categoryName}</span>}
      </div>

      <h1 className="font-display text-h-sm small:text-h-lg text-ink" data-testid="product-title">
        {product.title}
      </h1>
      {product.subtitle && <p className="text-body-md text-ink-soft -mt-2">{product.subtitle}</p>}

      {/* Preço */}
      <div className="rounded-ava-lg bg-subtle/70 border border-line p-4" data-testid="product-price">
        {price ? (
          <>
            {hasDiscount && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-body-sm text-ink-muted line-through">{price.original_price}</span>
                <span className="px-2 py-0.5 rounded-md bg-brand-light text-brand-dark text-label-xs">-{price.percentage_diff}%</span>
              </div>
            )}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-display text-[30px] leading-9 small:text-[40px] small:leading-[48px] font-extrabold text-ink">
                {pix || price.calculated_price}
              </span>
              {pix && <span className="text-label-sm text-teal">no PIX ({pixPercent}% OFF)</span>}
            </div>
            {(pix || installments) && (
              <p className="text-body-sm text-ink-soft mt-1 flex items-center gap-1.5">
                <Icon name="credit_card" className="text-[18px]" />
                {pix ? `${price.calculated_price} no cartão` : ""}
                {pix && installments ? " ou " : ""}
                {installments}
              </p>
            )}
          </>
        ) : (
          <span className="text-body-md text-ink-muted">Preço indisponível para esta região.</span>
        )}
      </div>

      {/* Variantes */}
      {variants.length > 1 &&
        (product.options || []).map((opt) => {
          const values = Array.from(new Set((opt.values || []).map((v) => v.value)))
          return (
            <div key={opt.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-label-md text-ink">{opt.title}</span>
                {options[opt.id] && <span className="text-label-sm text-brand">{options[opt.id]} selecionado</span>}
              </div>
              <div className="flex flex-wrap gap-2" data-testid="product-options">
                {values.map((v) => {
                  const active = options[opt.id] === v
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setOptions((p) => ({ ...p, [opt.id]: v }))}
                      className={`min-w-[96px] px-4 py-2.5 rounded-ava-md border text-label-md transition-colors ${
                        active ? "bg-navy border-navy text-white" : "bg-white border-line text-ink hover:border-navy"
                      }`}
                    >
                      {v}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

      {/* Quantidade */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-label-md text-ink block">Quantidade</span>
          {maxQty && <span className="text-body-sm text-ink-muted">Limite por pedido: {maxQty} un</span>}
        </div>
        <div className="flex items-center rounded-ava-md border border-line bg-white">
          <button type="button" aria-label="Diminuir" className="w-10 h-10 flex items-center justify-center disabled:opacity-40" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Icon name="remove" className="text-[20px]" />
          </button>
          <span className="w-10 text-center font-display font-bold" data-testid="quantity">{qty}</span>
          <button type="button" aria-label="Aumentar" className="w-10 h-10 flex items-center justify-center disabled:opacity-40" disabled={qty >= limit} onClick={() => setQty((q) => Math.min(limit, q + 1))}>
            <Icon name="add" className="text-[20px]" />
          </button>
        </div>
      </div>

      {/* Ações (desktop / tablet) */}
      <div className="hidden small:flex flex-col gap-2">
        <button
          type="button"
          disabled={!canBuy || !!busy}
          onClick={() => add("buy")}
          className="h-12 rounded-ava-md bg-brand hover:bg-brand-dark disabled:bg-line-strong text-white text-label-md flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
          data-testid="buy-now-button"
        >
          <Icon name="bolt" className="text-[20px]" />
          {busy === "buy" ? "Processando..." : label || "Comprar agora"}
        </button>
        <button
          type="button"
          disabled={!canBuy || !!busy}
          onClick={() => add("cart")}
          className="h-12 rounded-ava-md bg-navy hover:bg-navy-deep disabled:bg-line-strong text-white text-label-md flex items-center justify-center gap-2"
          data-testid="add-product-button"
        >
          <Icon name="add_shopping_cart" className="text-[20px]" />
          {busy === "cart" ? "Adicionando..." : added ? "Adicionado!" : label || "Adicionar ao carrinho"}
        </button>
      </div>
      {error && <p className="text-body-sm text-danger">{error}</p>}
      {added && (
        <p className="text-body-sm text-stock-in flex items-center gap-1">
          <Icon name="check_circle" className="text-[18px]" /> Produto adicionado ao carrinho.
        </p>
      )}

      {/* Conversar */}
      <button
        type="button"
        onClick={chat}
        className="flex items-center gap-3 p-3 rounded-ava-md bg-chat/10 hover:bg-chat/15 text-left transition-colors"
        data-testid="product-chat-button"
      >
        <span className="w-10 h-10 rounded-full bg-chat text-white flex items-center justify-center shrink-0">
          <Icon name="forum" className="text-[22px]" />
        </span>
        <span className="flex-1">
          <span className="block text-label-md text-ink">Conversar sobre este produto</span>
          <span className="block text-body-sm text-chat">Tire dúvidas com um especialista</span>
        </span>
        <Icon name="arrow_forward" className="text-[20px] text-chat" />
      </button>
      {chatFailed && <ChatFallback whatsapp={whatsapp} email={email} onClose={() => setChatFailed(false)} />}

      {/* Barra fixa mobile (acima da navegação inferior) */}
      <div className="small:hidden fixed inset-x-0 bottom-16 z-40 bg-white/95 backdrop-blur-xl border-t border-line px-3 py-2 flex gap-2" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
        <button
          type="button"
          disabled={!canBuy || !!busy}
          onClick={() => add("cart")}
          className="flex-1 h-11 rounded-ava-md bg-subtle text-navy disabled:opacity-50 text-label-md flex items-center justify-center gap-1.5"
        >
          <Icon name="add_shopping_cart" className="text-[20px]" />
          {busy === "cart" ? "..." : added ? "Adicionado" : "Carrinho"}
        </button>
        <button
          type="button"
          disabled={!canBuy || !!busy}
          onClick={() => add("buy")}
          className="flex-[1.6] h-11 rounded-ava-md bg-brand disabled:bg-line-strong text-white text-label-md flex items-center justify-center gap-1.5"
        >
          <Icon name="bolt" className="text-[20px]" />
          {busy === "buy" ? "Processando..." : label || "Comprar agora"}
        </button>
      </div>
    </div>
  )
}
