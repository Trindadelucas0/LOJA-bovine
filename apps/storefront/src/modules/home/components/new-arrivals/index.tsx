import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import AvaProductCard, { PriceConfig } from "@modules/avadesk/components/product-card"
import Icon from "@modules/avadesk/components/icon"
import SectionHeading from "../section-heading"

export default function NewArrivals({
  title,
  products,
  config,
}: {
  title: string
  products: HttpTypes.StoreProduct[]
  config: PriceConfig
}) {
  if (!products.length) return null
  return (
    <section>
      <SectionHeading eyebrow="Novos itens no estoque" title={title} linkLabel="Ver todos" linkHref="/store" />
      {/* Desktop: grade de cards */}
      <div className="hidden small:grid grid-cols-4 gap-gutter">
        {products.slice(0, 4).map((p) => (
          <AvaProductCard key={p.id} product={p} config={config} />
        ))}
      </div>
      {/* Mobile: lista compacta */}
      <div className="small:hidden flex flex-col gap-3">
        {products.slice(0, 4).map((p) => {
          const { cheapestPrice } = getProductPrice({ product: p })
          return (
            <LocalizedClientLink key={p.id} href={`/products/${p.handle}`} className="flex items-center gap-3 bg-white rounded-ava-lg p-2.5 shadow-sm">
              <div className="w-20 shrink-0">
                <Thumbnail thumbnail={p.thumbnail} images={p.images} size="square" className="!rounded-ava-md !shadow-none" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-1.5 py-0.5 rounded bg-navy text-white text-[10px] font-bold mb-1">NOVO</span>
                <p className="font-display text-body-md font-bold text-ink line-clamp-1">{p.title}</p>
                {cheapestPrice && <p className="font-display text-price-sm text-ink">{cheapestPrice.calculated_price}</p>}
              </div>
              <span className="w-10 h-10 rounded-ava-md bg-subtle text-navy flex items-center justify-center shrink-0">
                <Icon name="add_shopping_cart" className="text-[20px]" />
              </span>
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
  )
}
