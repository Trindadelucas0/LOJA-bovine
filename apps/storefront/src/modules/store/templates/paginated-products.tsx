import { HttpTypes } from "@medusajs/types"
import { getAvaContent } from "@lib/data/avadesk-content"
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { chatConfig } from "@lib/util/chat-config"
import { OptionValueIds } from "@lib/util/product-option-filters"
import AvaProductCard from "@modules/avadesk/components/product-card"
import Icon from "@modules/avadesk/components/icon"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Pagination } from "@modules/store/components/pagination"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export const ProductsGridSkeleton = ({ n = 8 }: { n?: number }) => (
  <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-3 small:gap-gutter" data-testid="products-loading">
    {Array.from({ length: n }).map((_, i) => (
      <li key={i}>
        <SkeletonProductPreview />
      </li>
    ))}
  </ul>
)

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const queryParams: PaginatedProductsParams = { limit: PRODUCT_LIMIT }

  if (collectionId) queryParams["collection_id"] = [collectionId]
  if (categoryId) queryParams["category_id"] = [categoryId]
  if (productsIds) queryParams["id"] = productsIds
  if (sortBy === "created_at") queryParams["order"] = "created_at"

  const region = await getRegion(countryCode)
  if (!region) return null

  let products: HttpTypes.StoreProduct[] = []
  let count = 0
  try {
    const res = await listProductsWithSort({ page, queryParams, sortBy, countryCode, optionValueIds })
    products = res.response.products
    count = res.response.count
  } catch {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-16 px-6 card-surface" data-testid="products-error">
        <span className="w-16 h-16 rounded-full bg-stock-out/10 flex items-center justify-center text-stock-out">
          <Icon name="error" className="text-[32px]" />
        </span>
        <p className="font-display text-h-md text-ink">Não foi possível carregar os produtos</p>
        <p className="text-body-lg text-ink-soft">Recarregue a página em instantes.</p>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-16 px-6 card-surface" data-testid="no-products">
        <span className="w-16 h-16 rounded-full bg-subtle flex items-center justify-center text-ink-soft">
          <Icon name="inventory_2" className="text-[32px]" />
        </span>
        <p className="font-display text-h-md text-ink">Nenhum produto por aqui ainda</p>
        <p className="text-body-lg text-ink-soft">Veja o catálogo completo da loja.</p>
        <LocalizedClientLink href="/store" className="mt-2 px-6 h-13 inline-flex items-center rounded-ava-md bg-brand text-white text-label-md shadow-brand-glow">
          Ver todos os produtos
        </LocalizedClientLink>
      </div>
    )
  }

  const { settings } = await getAvaContent()
  const config = {
    pixPercent: settings.pix_discount_percent,
    maxInstallments: settings.max_installments,
    sellerName: settings.store_name,
    chatEnabled: chatConfig(settings).enabled,
  }
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <p className="text-body-md text-ink-soft mb-3 font-semibold">
        {count} {count === 1 ? "produto" : "produtos"}
      </p>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-3 small:gap-gutter" data-testid="products-list">
        {products.map((p) => (
          <li key={p.id}>
            <AvaProductCard product={p} config={config} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination data-testid="product-pagination" page={page} totalPages={totalPages} />
        </div>
      )}
    </>
  )
}
