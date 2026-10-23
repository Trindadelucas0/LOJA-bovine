"use client"

import { useClearRefinements, useSortBy } from "react-instantsearch"

import Icon from "@modules/avadesk/components/icon"
import { CATEGORY_ATTRIBUTE, LABELS_ATTRIBUTE, getSortOptions } from "./attributes"
import CurrentRefinements from "./current-refinements"
import OnSaleToggle from "./on-sale-toggle"
import OptionRefinements from "./option-refinements"
import PriceRange from "./price-range"
import RefinementGroup from "./refinement-group"

/** Ordenação em <select> compacto (desktop e mobile). */
export const SortSelect = ({ currencyCode }: { currencyCode: string }) => {
  const items = getSortOptions(currencyCode)
  const { currentRefinement, refine } = useSortBy({ items })
  return (
    <label className="relative flex w-full items-center small:w-auto">
      <span className="sr-only">Ordenar por</span>
      <select
        value={currentRefinement}
        onChange={(e) => refine(e.target.value)}
        className="w-full appearance-none h-12 pl-4 pr-10 rounded-ava-md border border-line-strong bg-card text-label-md text-ink focus:outline-none focus:border-brand transition-colors"
        data-testid="sort-by-container"
      >
        {items.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>
      <Icon name="expand_more" className="absolute right-3 text-[22px] text-ink-soft pointer-events-none" />
    </label>
  )
}

const Filters = ({ currencyCode }: { currencyCode: string }) => (
  <div className="flex flex-col gap-8">
    <CurrentRefinements currencyCode={currencyCode} />
    <RefinementGroup attribute={CATEGORY_ATTRIBUTE} title="Categoria" />
    <PriceRange currencyCode={currencyCode} />
    <OnSaleToggle currencyCode={currencyCode} />
    <OptionRefinements />
    <RefinementGroup attribute={LABELS_ATTRIBUTE} title="Etiquetas" />
  </div>
)

const StoreRefinements = ({
  currencyCode,
  open,
  onClose,
}: {
  currencyCode: string
  open?: boolean
  onClose?: () => void
}) => {
  const { canRefine, refine } = useClearRefinements()
  return (
    <>
      {/* Desktop: barra lateral */}
      <aside className="hidden small:block w-[260px] shrink-0 card-surface p-5 sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <span className="font-display text-h-sm text-ink flex items-center gap-2">
            <Icon name="tune" className="text-[20px]" /> Filtros
          </span>
          {canRefine && (
            <button type="button" onClick={refine} className="text-label-sm text-brand hover:text-brand-dark">
              Limpar
            </button>
          )}
        </div>
        <Filters currencyCode={currencyCode} />
      </aside>

      {/* Mobile: gaveta */}
      <div className={`small:hidden fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-navy/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] bg-card shadow-overlay rounded-t-ava-xl flex flex-col transition-transform ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="font-display text-h-sm text-ink">Filtros</span>
            <button type="button" onClick={onClose} aria-label="Fechar filtros" className="w-9 h-9 flex items-center justify-center">
              <Icon name="close" className="text-[22px]" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <Filters currencyCode={currencyCode} />
          </div>
          <div className="p-3 border-t border-line flex gap-2" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
            <button type="button" disabled={!canRefine} onClick={refine} className="flex-1 h-11 rounded-ava-md bg-subtle text-ink text-label-md disabled:opacity-50">
              Limpar
            </button>
            <button type="button" onClick={onClose} className="flex-[2] h-11 rounded-ava-md bg-brand text-white text-label-md">
              Ver resultados
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default StoreRefinements
