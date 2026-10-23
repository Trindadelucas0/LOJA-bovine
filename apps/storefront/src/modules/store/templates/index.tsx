"use client"

import { useState } from "react"
import type { SearchClient } from "instantsearch.js"
import { Configure, InstantSearch, useStats } from "react-instantsearch"

import { PRODUCT_INDEX_NAME, searchClient } from "@lib/search-client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"
import StoreHits from "@modules/store/components/store-hits"
import StoreRefinements, { SortSelect } from "@modules/store/components/store-refinements"
import StoreSearchBox from "@modules/store/components/store-search-box"

const PRODUCT_LIMIT = 12

const ResultCount = () => {
  const { nbHits } = useStats()
  return (
    <span className="text-body-md font-semibold text-ink-soft shrink-0" data-testid="result-count">
      {nbHits} {nbHits === 1 ? "produto" : "produtos"}
    </span>
  )
}

type Props = {
  currencyCode: string
  pixPercent?: number | null
  maxInstallments?: number | null
}

const StoreTemplate = ({ currencyCode, pixPercent, maxInstallments }: Props) => {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="max-w-page mx-auto px-margin-m small:px-margin pt-3 small:pt-6 pb-10" data-testid="category-container">
      <nav className="flex items-center gap-1.5 text-body-md text-ink-soft mb-2">
        <LocalizedClientLink href="/" className="hover:text-ink">Início</LocalizedClientLink>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="text-ink">Produtos</span>
      </nav>
      <h1 className="font-display text-h-md small:text-h-lg text-ink mb-4 small:mb-6" data-testid="store-page-title">
        Todos os produtos
      </h1>

      <InstantSearch
        indexName={PRODUCT_INDEX_NAME}
        searchClient={searchClient as unknown as SearchClient}
        routing
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure hitsPerPage={PRODUCT_LIMIT} />
        <div className="flex flex-col small:flex-row small:items-start gap-6">
          <StoreRefinements currencyCode={currencyCode} open={filtersOpen} onClose={() => setFiltersOpen(false)} />
          <div className="w-full min-w-0 flex flex-col gap-4">
            <StoreSearchBox />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ResultCount />
              <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="small:hidden inline-flex shrink-0 items-center gap-1.5 h-12 px-4 rounded-ava-md border border-line-strong bg-card text-label-md text-ink"
                  data-testid="open-filters"
                >
                  <Icon name="tune" className="text-[20px]" /> Filtros
                </button>
                <div className="min-w-0 flex-1 small:flex-none">
                  <SortSelect currencyCode={currencyCode} />
                </div>
              </div>
            </div>
            <StoreHits
              hitsPerPage={PRODUCT_LIMIT}
              currencyCode={currencyCode}
              pixPercent={pixPercent}
              maxInstallments={maxInstallments}
            />
          </div>
        </div>
      </InstantSearch>
    </div>
  )
}

export default StoreTemplate
