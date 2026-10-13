"use client"

import Search from "@modules/layout/components/search"
import Icon from "../icon"

/** Barra de busca visual que abre a busca existente do starter (drawer). */
export default function SearchBar({ compact }: { compact?: boolean }) {
  return (
    <Search
      trigger={(open) => (
        <button
          type="button"
          onClick={open}
          className="flex w-full items-center justify-between gap-2 text-left"
          data-testid="nav-search-button"
          aria-label="Buscar produtos"
        >
          <span className={`flex items-center gap-2 text-ink-muted truncate ${compact ? "px-3 h-10 text-body-sm" : "px-2 text-body-sm"}`}>
            {compact && <Icon name="search" className="text-[18px]" />}
            Buscar produtos, marcas ou SKUs...
          </span>
          {!compact && (
            <span className="bg-navy hover:bg-navy-deep text-white rounded-ava px-4 py-1.5 flex items-center">
              <Icon name="search" className="text-[20px]" />
            </span>
          )}
        </button>
      )}
    />
  )
}
