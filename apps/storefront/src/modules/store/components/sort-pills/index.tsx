"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const OPTIONS: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Lançamentos" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
]

/** Ordenação por URL (?sortBy=) usada nas páginas de categoria/coleção. */
export default function SortPills({ sortBy }: { sortBy: SortOptions }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, start] = useTransition()

  const set = (v: SortOptions) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", v)
    params.delete("page")
    start(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }))
  }

  return (
    <div className={`flex items-center gap-2 overflow-x-auto no-scrollbar ${pending ? "opacity-60" : ""}`} data-testid="sort-by-container">
      <span className="text-label-sm text-ink-soft shrink-0 hidden small:inline">Ordenar:</span>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => set(o.value)}
          className={`px-3 py-1.5 rounded-full text-label-sm whitespace-nowrap transition-colors ${
            sortBy === o.value ? "bg-navy text-white" : "bg-white border border-line text-ink-soft hover:border-navy"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
