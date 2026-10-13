import { notFound } from "next/navigation"
import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"

import { OptionValueIds } from "@lib/util/product-option-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"
import SortPills from "@modules/store/components/sort-pills"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts, { ProductsGridSkeleton } from "@modules/store/templates/paginated-products"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents: HttpTypes.StoreProductCategory[] = []
  let p = category.parent_category
  while (p) {
    parents.unshift(p)
    p = p.parent_category
  }
  const children = category.category_children || []

  return (
    <div className="max-w-page mx-auto px-margin-m small:px-margin pt-3 small:pt-6 pb-10" data-testid="category-container">
      <nav className="flex items-center gap-1.5 text-body-sm text-ink-muted mb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        <LocalizedClientLink href="/" className="hover:text-ink">Início</LocalizedClientLink>
        <Icon name="chevron_right" className="text-[16px]" />
        <LocalizedClientLink href="/store" className="hover:text-ink">Produtos</LocalizedClientLink>
        {parents.map((par) => (
          <span key={par.id} className="flex items-center gap-1.5">
            <Icon name="chevron_right" className="text-[16px]" />
            <LocalizedClientLink href={`/categories/${par.handle}`} className="hover:text-ink" data-testid="sort-by-link">
              {par.name}
            </LocalizedClientLink>
          </span>
        ))}
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="text-ink">{category.name}</span>
      </nav>

      <div className="bg-gradient-to-r from-navy-deep via-navy to-navy-soft text-white rounded-ava-lg small:rounded-ava-xl p-5 small:p-8 mb-5 small:mb-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
        <h1 className="relative font-display text-h-md small:text-h-xl font-extrabold" data-testid="category-page-title">
          {category.name}
        </h1>
        {category.description && <p className="relative text-body-sm small:text-body-lg text-white/75 mt-2 max-w-2xl">{category.description}</p>}
      </div>

      {children.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {children.map((c) => (
            <LocalizedClientLink
              key={c.id}
              href={`/categories/${c.handle}`}
              className="shrink-0 px-4 py-2 rounded-ava-md bg-white border border-line text-label-sm text-ink hover:border-brand hover:text-brand transition-colors"
            >
              {c.name}
            </LocalizedClientLink>
          ))}
        </div>
      )}

      <div className="flex flex-col-reverse small:flex-row small:items-center justify-between gap-3 mb-4">
        <SortPills sortBy={sort} />
        <LocalizedClientLink href="/store" className="inline-flex items-center gap-1 text-label-sm text-brand shrink-0">
          <Icon name="tune" className="text-[18px]" /> Busca com filtros avançados
        </LocalizedClientLink>
      </div>

      <Suspense key={`${sort}-${pageNumber}`} fallback={<ProductsGridSkeleton />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={category.id}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>
    </div>
  )
}
