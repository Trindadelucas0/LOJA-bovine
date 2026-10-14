import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getAvaContent, storeName } from "@lib/data/avadesk-content"
import { getRegion } from "@lib/data/regions"
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
  const [region, { settings }] = await Promise.all([getRegion(countryCode), getAvaContent()])

  if (!region) {
    notFound()
  }

  return (
    <StoreTemplate
      currencyCode={region.currency_code}
      pixPercent={settings.pix_discount_percent}
      maxInstallments={settings.max_installments}
    />
  )
}
