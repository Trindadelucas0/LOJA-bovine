import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"

import { OptionValueIds } from "@lib/util/product-option-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"
import SortPills from "@modules/store/components/sort-pills"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts, { ProductsGridSkeleton } from "@modules/store/templates/paginated-products"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="max-w-page mx-auto px-margin-m small:px-margin pt-3 small:pt-6 pb-10">
      <nav className="flex items-center gap-1.5 text-body-sm text-ink-muted mb-2">
        <LocalizedClientLink href="/" className="hover:text-ink">Início</LocalizedClientLink>
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="text-ink">{collection.title}</span>
      </nav>
      <h1 className="font-display text-h-md small:text-h-lg text-ink mb-4">{collection.title}</h1>
      <div className="mb-4">
        <SortPills sortBy={sort} />
      </div>
      <Suspense key={`${sort}-${pageNumber}`} fallback={<ProductsGridSkeleton />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          collectionId={collection.id}
          countryCode={countryCode}
          optionValueIds={optionValueIds}
        />
      </Suspense>
    </div>
  )
}
