import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import { getAvaContent } from "@lib/data/avadesk-content"
import { retrieveCustomer } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"
import BuyBox from "@modules/avadesk/components/product-page/buy-box"
import DetailsTabs, { DetailSection } from "@modules/avadesk/components/product-page/details-tabs"
import ProductGallery from "@modules/avadesk/components/product-page/gallery"
import { readProductMeta } from "@modules/avadesk/components/product-page/meta"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

export default async function ProductTemplate({ product, countryCode, images }: ProductTemplateProps) {
  if (!product || !product.id) {
    return notFound()
  }

  const [{ settings }, customer] = await Promise.all([getAvaContent(), retrieveCustomer().catch(() => null)])
  const meta = readProductMeta(product)

  // Breadcrumb: categoria principal + ancestrais
  const category = product.categories?.[0]
  const trail: { name: string; handle: string }[] = []
  let c: HttpTypes.StoreProductCategory | null | undefined = category
  while (c) {
    trail.unshift({ name: c.name, handle: c.handle })
    c = c.parent_category
  }

  const sections: DetailSection[] = []
  if (meta.specs.length) {
    sections.push({
      id: "specs",
      title: "Ficha técnica",
      icon: "tune",
      content: (
        <dl className="grid grid-cols-1 small:grid-cols-2 gap-x-10">
          {meta.specs.map((s, i) => (
            <div key={i} className="flex justify-between gap-4 py-2.5 border-b border-line text-body-md">
              <dt className="text-ink-soft">{s.label}</dt>
              <dd className="text-ink font-semibold text-right">{s.value}</dd>
            </div>
          ))}
        </dl>
      ),
    })
  }
  if (product.description) {
    sections.push({
      id: "desc",
      title: "Descrição",
      icon: "description",
      content: <p className="text-body-md text-ink-soft whitespace-pre-line leading-relaxed">{product.description}</p>,
    })
  }
  if (meta.included.length) {
    sections.push({
      id: "included",
      title: "Itens inclusos",
      icon: "inventory_2",
      content: (
        <ul className="grid grid-cols-1 small:grid-cols-2 gap-2">
          {meta.included.map((it, i) => (
            <li key={i} className="flex items-center gap-2 text-body-md text-ink">
              <Icon name="check_circle" className="text-[18px] text-stock-in" />
              {it}
            </li>
          ))}
        </ul>
      ),
    })
  }
  if (meta.warranty) {
    sections.push({
      id: "warranty",
      title: "Garantia",
      icon: "verified_user",
      content: <p className="text-body-md text-ink-soft whitespace-pre-line leading-relaxed">{meta.warranty}</p>,
    })
  }

  return (
    <div className="max-w-page mx-auto px-margin-m small:px-margin pt-3 small:pt-6 pb-24 small:pb-12 flex flex-col gap-6 small:gap-10" data-testid="product-container">
      <nav className="flex items-center gap-1.5 text-body-sm text-ink-muted overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Breadcrumb">
        <LocalizedClientLink href="/" className="hover:text-ink flex items-center gap-1">
          <Icon name="home" className="text-[16px]" /> Início
        </LocalizedClientLink>
        {trail.map((t) => (
          <React.Fragment key={t.handle}>
            <Icon name="chevron_right" className="text-[16px]" />
            <LocalizedClientLink href={`/categories/${t.handle}`} className="hover:text-ink">
              {t.name}
            </LocalizedClientLink>
          </React.Fragment>
        ))}
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="text-ink truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 small:grid-cols-12 gap-5 small:gap-8 items-start">
        <div className="small:col-span-6 medium:col-span-7 small:sticky small:top-24">
          <ProductGallery images={images} title={product.title} badge={meta.badge} />
        </div>
        <div className="small:col-span-6 medium:col-span-5 bg-white rounded-ava-lg small:rounded-ava-xl shadow-sm p-4 small:p-6">
          <Suspense fallback={<div className="h-96 animate-pulse bg-subtle rounded-ava-lg" />}>
            <BuyBox
              product={product}
              pixPercent={settings.pix_discount_percent}
              maxInstallments={settings.max_installments}
              maxQty={meta.maxQty}
              whatsapp={settings.whatsapp}
              email={settings.email}
              customer={customer ? { email: customer.email, name: [customer.first_name, customer.last_name].filter(Boolean).join(" ") } : null}
              categoryName={category?.name}
            />
          </Suspense>
        </div>
      </div>

      <DetailsTabs sections={sections} />

      <Suspense fallback={<SkeletonRelatedProducts />}>
        <RelatedProducts product={product} countryCode={countryCode} />
      </Suspense>
    </div>
  )
}
