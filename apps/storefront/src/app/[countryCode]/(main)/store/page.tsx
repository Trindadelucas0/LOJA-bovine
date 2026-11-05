import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getAvaContent, storeName } from "@lib/data/avadesk-content"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { resolveStorePricing } from "@lib/util/store-pricing"
import StoreTemplate from "@modules/store/templates"

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getAvaContent()
  return {
    title: `Todos os produtos | ${storeName(settings)}`,
    description: "Explore todos os nossos produtos.",
  }
}

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const [region, { settings }, categories] = await Promise.all([
    getRegion(countryCode),
    getAvaContent(),
    listCategories({ fields: "id,name,handle,parent_category_id" }).catch(() => []),
  ])

  if (!region) {
    notFound()
  }

  const pricing = resolveStorePricing(settings)
  const tops = (categories || []).filter((category) => !category.parent_category_id)
  const selected = settings.home_category_ids || []
  const listed = (selected.length
    ? selected.map((id) => tops.find((category) => category.id === id) || (categories || []).find((category) => category.id === id)).filter(Boolean)
    : tops) as { name: string; handle: string }[]

  return (
    <StoreTemplate
      currencyCode={region.currency_code}
      pixPercent={pricing.pixPercent}
      maxInstallments={pricing.maxInstallments}
      categories={listed.map((category) => ({ name: category.name, handle: category.handle }))}
    />
  )
}
