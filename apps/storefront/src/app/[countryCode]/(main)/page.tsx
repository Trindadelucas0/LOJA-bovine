import { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"

import { getAvaContent, storeName } from "@lib/data/avadesk-content"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { chatConfig } from "@lib/util/chat-config"
import { getProductPrice } from "@lib/util/get-product-price"
import { hasRealPrice, resolveStorePricing } from "@lib/util/store-pricing"
import Assurance from "@modules/avadesk/components/assurance"
import EmptyCatalog from "@modules/avadesk/components/empty-catalog"
import AvaProductCard, { PriceConfig } from "@modules/avadesk/components/product-card"
import { CategoriesSidebar } from "@modules/avadesk/components/header/categories-menu"
import Benefits from "@modules/home/components/benefits"
import CategoryGrid from "@modules/home/components/category-grid"
import ChatBlock from "@modules/home/components/chat-block"
import FeaturedTabs from "@modules/home/components/featured-tabs"
import Hero from "@modules/home/components/hero"
import PromoBanner from "@modules/home/components/promo-banner"
import SectionHeading from "@modules/home/components/section-heading"
import ServiceShortcuts from "@modules/home/components/service-shortcuts"

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getAvaContent()
  return {
    title: storeName(settings),
    description: settings.tagline || settings.footer_text || undefined,
  }
}

const productsFor = async (countryCode: string, query: Record<string, unknown>) =>
  listProducts({ countryCode, queryParams: { limit: 8, ...query } as any })
    .then(({ response }) => response.products)
    .catch(() => [] as HttpTypes.StoreProduct[])

const isOnSale = (product: HttpTypes.StoreProduct) => {
  try {
    const price = getProductPrice({ product }).cheapestPrice
    return (
      !!price &&
      hasRealPrice(price.calculated_price_number) &&
      price.original_price_number > price.calculated_price_number
    )
  } catch {
    return false
  }
}

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  if (!region) return null

  const [{ settings, banners }, categories, { collections }] = await Promise.all([
    getAvaContent(),
    listCategories({ fields: "id,name,handle,parent_category_id,rank,*category_children" }).catch(() => []),
    listCollections({ fields: "id,handle,title" }).catch(() => ({ collections: [] as HttpTypes.StoreCollection[] })),
  ])

  const promo = banners.find((banner) => banner.position === "promo")
  const availableCategories = categories || []
  const topCategories = availableCategories.filter((category) => !category.parent_category_id)
  const selectedCategoryIds = settings.home_category_ids || []
  const selectedCategories = (
    selectedCategoryIds.length
      ? selectedCategoryIds.map((id) => availableCategories.find((category) => category.id === id)).filter(Boolean)
      : topCategories
  ) as HttpTypes.StoreProductCategory[]
  const departmentCategories = selectedCategories.map((category) => ({
    id: category.id,
    name: category.name,
    handle: category.handle,
    category_children: (category.category_children || []).map((child) => ({
      id: child.id,
      name: child.name,
      handle: child.handle,
    })),
  }))
  const categoriesTitle = settings.categories_title || "Departamentos"

  const selectedCols = settings.featured_collection_ids || []
  const featuredCols = (
    selectedCols.length
      ? selectedCols.map((id) => collections.find((collection) => collection.id === id)).filter(Boolean)
      : []
  ) as HttpTypes.StoreCollection[]
  const bestseller = collections.find((collection) => /mais\s*vendid/i.test(collection.title || ""))

  const [catalog, featuredProducts, perCollection, newest, bestsellers] = await Promise.all([
    productsFor(countryCode, { limit: 16 }),
    featuredCols.length
      ? productsFor(countryCode, { collection_id: featuredCols.map((collection) => collection.id) })
      : Promise.resolve([] as HttpTypes.StoreProduct[]),
    Promise.all(featuredCols.map((collection) => productsFor(countryCode, { collection_id: [collection.id] }))),
    productsFor(countryCode, { order: "-created_at", limit: 8 }),
    bestseller
      ? productsFor(countryCode, { collection_id: [bestseller.id] })
      : Promise.resolve([] as HttpTypes.StoreProduct[]),
  ])

  const offers = catalog.filter(isOnSale)
  const chat = chatConfig(settings)
  const pricing = resolveStorePricing(settings)
  const config: PriceConfig = {
    pixPercent: pricing.pixPercent,
    maxInstallments: pricing.maxInstallments,
    sellerName: settings.store_name,
    chatEnabled: chat.enabled,
  }

  const grid = (products: HttpTypes.StoreProduct[]) => (
    <div className="grid grid-cols-2 gap-3 small:grid-cols-4 small:gap-gutter">
      {products.map((product) => (
        <AvaProductCard key={product.id} product={product} config={config} />
      ))}
    </div>
  )

  const tabs = [
    ...(featuredProducts.length ? [{ id: "all", label: "Todos", content: grid(featuredProducts) }] : []),
    ...(featuredCols.length > 1
      ? featuredCols
          .map((collection, index) => ({
            id: collection.id,
            label: collection.title,
            content: grid(perCollection[index]),
            n: perCollection[index].length,
          }))
          .filter((tab) => tab.n > 0)
      : []),
  ]

  const shelf = (id: string, eyebrow: string, title: string, products: HttpTypes.StoreProduct[]) =>
    products.length ? (
      <section key={id}>
        <SectionHeading eyebrow={eyebrow} title={title} linkLabel="Ver produtos" linkHref="/store" />
        {grid(products.slice(0, 8))}
      </section>
    ) : null

  const hasProducts = offers.length + bestsellers.length + newest.length + tabs.length > 0
  const catalogLinks = departmentCategories.map((category) => ({ name: category.name, handle: category.handle }))

  return (
    <div className="mx-auto flex max-w-page flex-col gap-6 px-margin-m pb-nav pt-3 small:gap-10 small:px-margin small:pt-6 medium:grid medium:grid-cols-[260px_minmax(0,1fr)] medium:items-start medium:gap-gutter">
      <CategoriesSidebar categories={departmentCategories} title={categoriesTitle} />
      <div className="flex min-w-0 flex-col gap-6 small:gap-10">
        <Hero banners={banners} settings={settings} />
        <div id="departamentos">
          <CategoryGrid title={categoriesTitle} categories={selectedCategories} />
        </div>
        <PromoBanner banner={promo} pixText={settings.pix_discount_text} />
        {shelf("offers", "Preço menor", "Ofertas", offers)}
        {shelf("best", "Quem mais sai", "Mais vendidos", bestsellers)}
        {tabs.length > 0 && (
          <section>
            <SectionHeading
              eyebrow="Seleção da loja"
              title={settings.featured_title || "Destaques"}
              linkLabel="Ver produtos"
              linkHref="/store"
            />
            <FeaturedTabs tabs={tabs.map(({ id, label, content }) => ({ id, label, content }))} />
          </section>
        )}
        {shelf("new", "Chegaram agora", settings.new_arrivals_title || "Novidades", newest)}
        {!hasProducts && <EmptyCatalog categories={catalogLinks} />}
        {(settings.benefits || []).length > 0 ? <Benefits items={settings.benefits || []} /> : <Assurance />}
        <ServiceShortcuts settings={settings} />
        {chat.enabled && <ChatBlock settings={settings} />}
      </div>
    </div>
  )
}
