"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchBox } from "react-instantsearch"
import Icon from "@modules/avadesk/components/icon"

const DEBOUNCE_MS = 250

/** Busca livre da listagem (mesmo estado do InstantSearch dos filtros). */
const StoreSearchBox = () => {
  const timer = useRef<number | undefined>(undefined)

  const queryHook = useCallback((nextQuery: string, search: (value: string) => void) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => search(nextQuery), DEBOUNCE_MS)
  }, [])

  const { query, refine } = useSearchBox({ queryHook })
  const [inputValue, setInputValue] = useState(query)

  useEffect(() => () => window.clearTimeout(timer.current), [])
  useEffect(() => {
    setInputValue(query)
  }, [query])

  const clear = () => {
    window.clearTimeout(timer.current)
    setInputValue("")
    refine("")
  }

  return (
    <div className="flex items-center gap-2 h-12 px-3 rounded-ava-md bg-white border border-line shadow-sm focus-within:ring-2 focus-within:ring-navy/20">
      <Icon name="search" className="text-[20px] text-ink-muted" />
      <input
        type="search"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
          refine(event.target.value)
        }}
        placeholder="Buscar produtos, marcas ou SKUs..."
        aria-label="Buscar produtos"
        className="w-full bg-transparent text-body-md text-ink outline-none placeholder:text-ink-muted [&::-webkit-search-cancel-button]:hidden"
        data-testid="store-search-input"
      />
      {inputValue && (
        <button type="button" onClick={clear} aria-label="Limpar busca" className="text-ink-muted hover:text-ink" data-testid="store-search-clear">
          <Icon name="close" className="text-[20px]" />
        </button>
      )}
    </div>
  )
}

export default StoreSearchBox
