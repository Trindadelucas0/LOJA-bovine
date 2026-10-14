"use client"

import { usePagination } from "react-instantsearch"
import Icon from "@modules/avadesk/components/icon"

const SearchPagination = () => {
  const { pages, currentRefinement, nbPages, refine, isFirstPage, isLastPage } = usePagination({ padding: 2 })

  if (nbPages <= 1) return null

  const go = (p: number) => {
    refine(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const btn = "min-w-10 h-10 px-3 rounded-ava-md text-label-md flex items-center justify-center transition-colors"
  return (
    <div className="flex justify-center w-full mt-8" data-testid="product-pagination">
      <div className="flex gap-1.5 items-center">
        <button type="button" disabled={isFirstPage} onClick={() => go(currentRefinement - 1)} className={`${btn} bg-white border border-line disabled:opacity-40`} aria-label="Página anterior">
          <Icon name="chevron_left" className="text-[20px]" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            disabled={p === currentRefinement}
            className={`${btn} ${p === currentRefinement ? "bg-navy text-white" : "bg-white border border-line text-ink hover:border-navy"}`}
          >
            {p + 1}
          </button>
        ))}
        <button type="button" disabled={isLastPage} onClick={() => go(currentRefinement + 1)} className={`${btn} bg-white border border-line disabled:opacity-40`} aria-label="Próxima página">
          <Icon name="chevron_right" className="text-[20px]" />
        </button>
      </div>
    </div>
  )
}

export default SearchPagination
