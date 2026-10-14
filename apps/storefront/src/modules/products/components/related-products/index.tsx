import { HttpTypes } from "@medusajs/types"
import { getAvaContent } from "@lib/data/avadesk-content"
import { listProducts } from "@lib/data/products"
import { chatConfig } from "@lib/util/chat-config"
import AvaProductCard from "@modules/avadesk/components/product-card"
import SectionHeading from "@modules/home/components/section-heading"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

/** Relacionados: mesma categoria, depois mesma coleção, depois mais recentes. */
export default async function RelatedProducts({ product, countryCode }: RelatedProductsProps) {
  const fetch = (q: Record<string, unknown>) =>
    listProducts({ countryCode, queryParams: { limit: 9, ...q } as any })
      .then(({ response }) => response.products.filter((p) => p.id !== product.id))
      .catch(() => [] as HttpTypes.StoreProduct[])

  const catIds = (product.categories || []).map((c) => c.id)
  let products: HttpTypes.StoreProduct[] = []
  if (catIds.length) products = await fetch({ category_id: catIds })
  if (products.length < 4 && product.collection_id) {
    const more = await fetch({ collection_id: [product.collection_id] })
    products = [...products, ...more.filter((m) => !products.some((p) => p.id === m.id))]
  }
  if (products.length < 4) {
    const more = await fetch({ order: "-created_at" })
    products = [...products, ...more.filter((m) => !products.some((p) => p.id === m.id))]
  }
  products = products.slice(0, 4)
  if (!products.length) return null

  const { settings } = await getAvaContent()
  const config = {
    pixPercent: settings.pix_discount_percent,
    maxInstallments: settings.max_installments,
    sellerName: settings.store_name,
    chatEnabled: chatConfig(settings).enabled,
  }

  return (
    <section data-testid="related-products-container">
      <SectionHeading eyebrow="Você também pode gostar" title="Produtos relacionados" linkLabel="Ver todos" linkHref="/store" />
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-3 small:gap-gutter">
        {products.map((p) => (
          <li key={p.id}>
            <AvaProductCard product={p} config={config} />
          </li>
        ))}
      </ul>
    </section>
  )
}
