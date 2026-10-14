"use client"

import type { Hit } from "instantsearch.js"
import { useEffect, useRef } from "react"
import { useClearRefinements, useHits, useInstantSearch } from "react-instantsearch"

import useSearchSettled from "@lib/hooks/use-search-settled"
import { indexedCurrency, priceAttribute } from "@lib/search-client"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import Icon from "@modules/avadesk/components/icon"
import SearchPagination from "./pagination"
import { HitPricing } from "./price"

type ProductHit = Hit<
  {
    title: string | null
    handle: string | null
    thumbnail: string | null
  } & HitPricing
>

type StoreHitsProps = {
  hitsPerPage: number
  currencyCode: string
  pixPercent?: number | null
  maxInstallments?: number | null
}

const num = (v: unknown) => (typeof v === "number" ? v : null)

const HitCard = ({
  hit,
  currencyCode,
  pixPercent,
  maxInstallments,
}: {
  hit: ProductHit
  currencyCode: string
  pixPercent?: number | null
  maxInstallments?: number | null
}) => {
  const currency_code = indexedCurrency(currencyCode)
  const min = num(hit[priceAttribute("min_price", currencyCode)])
  const max = num(hit[priceAttribute("max_price", currencyCode)])
  const original = num(hit[priceAttribute("original_price", currencyCode)])
  const onSale = hit[priceAttribute("on_sale", currencyCode)] === true
  const fmt = (v: number) => convertToLocale({ amount: v, currency_code })
  const isRange = max !== null && min !== null && max > min
  const discount = onSale && original && min ? Math.round(((original - min) / original) * 100) : 0
  const pix = min !== null && pixPercent && pixPercent > 0 ? fmt(min * (1 - pixPercent / 100)) : null
  const inst = min !== null && maxInstallments && maxInstallments > 1 ? `ou ${maxInstallments}x de ${fmt(min / maxInstallments)} sem juros` : null
  const href = `/products/${hit.handle}`

  return (
    <article className="group flex flex-col bg-white rounded-ava-lg p-2.5 small:p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full" data-testid="product-wrapper">
      <LocalizedClientLink href={href} className="relative block rounded-ava-md bg-subtle overflow-hidden mb-3">
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-brand text-white text-label-xs">-{discount}%</span>
        )}
        <Thumbnail thumbnail={hit.thumbnail} size="square" className="!rounded-none !shadow-none !bg-subtle group-hover:scale-105 transition-transform duration-300" />
      </LocalizedClientLink>
      <LocalizedClientLink href={href}>
        <h3 className="font-display text-body-md small:text-h-sm text-ink group-hover:text-brand transition-colors line-clamp-2 min-h-[40px] small:min-h-[48px] mb-2" data-testid="product-title">
          {hit.title}
        </h3>
      </LocalizedClientLink>
      <div className="mt-auto mb-3" data-testid="product-price">
        {min !== null ? (
          <>
            {!isRange && onSale && original !== null && <span className="text-body-sm text-ink-muted line-through block">{fmt(original)}</span>}
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="font-display text-price-sm small:text-price-display text-ink">
                {isRange ? `a partir de ${pix || fmt(min)}` : pix || fmt(min)}
              </span>
              {pix && <span className="text-label-xs text-teal">no PIX</span>}
            </div>
            {pix && !isRange && <span className="text-body-sm text-ink-soft block">{fmt(min)} no cartão</span>}
            {inst && <span className="text-body-sm text-ink-soft block">{inst}</span>}
          </>
        ) : (
          <span className="text-body-sm text-ink-muted">Ver preço</span>
        )}
      </div>
      <LocalizedClientLink
        href={href}
        className="flex items-center justify-center gap-1 py-2.5 rounded-ava-md bg-brand hover:bg-brand-dark text-white text-label-sm transition-colors"
      >
        <Icon name="shopping_cart" className="text-[18px]" /> Comprar
      </LocalizedClientLink>
    </article>
  )
}

const GridSkeleton = ({ n }: { n: number }) => (
  <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-3 small:gap-gutter" data-testid="products-loading">
    {Array.from({ length: n }).map((_, i) => (
      <li key={i} className="bg-white rounded-ava-lg p-3 shadow-sm animate-pulse">
        <div className="aspect-square rounded-ava-md bg-subtle mb-3" />
        <div className="h-4 bg-subtle rounded mb-2" />
        <div className="h-4 w-2/3 bg-subtle rounded mb-4" />
        <div className="h-6 w-1/2 bg-subtle rounded mb-3" />
        <div className="h-10 bg-subtle rounded-ava-md" />
      </li>
    ))}
  </ul>
)

const StoreHits = ({ hitsPerPage, currencyCode, pixPercent, maxInstallments }: StoreHitsProps) => {
  const { items } = useHits<ProductHit>()
  const { status, error, indexUiState, refresh } = useInstantSearch()
  const { isSearching, hasNoResultsYet } = useSearchSettled()
  const { canRefine, refine: clearAll } = useClearRefinements()

  const { page, ...refinements } = indexUiState
  const currentPage = page ?? 1
  const refinementKey = JSON.stringify(refinements)
  const settled = useRef({ page: currentPage, refinementKey })

  useEffect(() => {
    if (!isSearching) settled.current = { page: currentPage, refinementKey }
  }, [isSearching, currentPage, refinementKey])

  const isPagingOnly = refinementKey === settled.current.refinementKey && currentPage !== settled.current.page
  const showSkeleton = hasNoResultsYet || (isSearching && isPagingOnly)

  if (status === "error") {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-16 bg-white rounded-ava-lg shadow-sm" data-testid="products-error">
        <Icon name="error" className="text-[40px] text-stock-out" />
        <p className="font-display text-h-sm text-ink">Não foi possível carregar os produtos</p>
        {error?.message && <p className="text-body-sm text-ink-muted max-w-md">{error.message}</p>}
        <button type="button" onClick={() => refresh()} className="mt-2 px-5 h-10 rounded-ava-md bg-navy text-white text-label-md">
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <>
      {showSkeleton ? (
        <GridSkeleton n={Math.min(hitsPerPage, 8)} />
      ) : !items.length ? (
        <div className="flex flex-col items-center text-center gap-3 py-16 bg-white rounded-ava-lg shadow-sm" data-testid="no-products">
          <Icon name="search_off" className="text-[40px] text-ink-muted" />
          <p className="font-display text-h-sm text-ink">Nenhum produto encontrado</p>
          <p className="text-body-sm text-ink-muted">Tente outros termos ou remova alguns filtros.</p>
          {canRefine && (
            <button type="button" onClick={clearAll} className="mt-2 px-5 h-10 rounded-ava-md bg-brand text-white text-label-md">
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-3 small:gap-gutter" data-testid="products-list">
          {items.map((hit) =>
            hit.handle ? (
              <li key={hit.objectID}>
                <HitCard hit={hit} currencyCode={currencyCode} pixPercent={pixPercent} maxInstallments={maxInstallments} />
              </li>
            ) : null
          )}
        </ul>
      )}
      <SearchPagination />
    </>
  )
}

export default StoreHits
