import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { categoryIcon } from "@lib/util/category-icon"
import Icon from "@modules/avadesk/components/icon"
import SafeImage from "@modules/avadesk/components/safe-image"
import SectionHeading from "../section-heading"

type Cat = HttpTypes.StoreProductCategory & { product_count?: number }

const TONES = [
  "bg-brand-light text-brand-dark",
  "bg-teal/10 text-teal",
  "bg-navy/10 text-navy",
  "bg-chat/10 text-chat",
]

export default function CategoryGrid({ title, categories }: { title: string; categories: Cat[] }) {
  if (!categories.length) return null
  return (
    <section>
      <SectionHeading eyebrow="Navegação rápida" title={title} linkLabel="Ver produtos" linkHref="/store" />
      <div className="grid grid-cols-3 gap-2 tablet:grid-cols-4 small:grid-cols-6 small:gap-3">
        {categories.map((category, index) => {
          const meta = (category.metadata || {}) as Record<string, unknown>
          const image = typeof meta.image === "string" ? meta.image : null
          const icon = typeof meta.icon === "string" ? meta.icon : categoryIcon(category.name)
          return (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group flex min-h-[112px] flex-col items-center justify-start gap-2 card-interactive p-3 text-center"
            >
              <span className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${TONES[index % TONES.length]}`}>
                <Icon name={icon} className="text-[26px]" filled />
                <SafeImage src={image} className="absolute inset-0 h-full w-full object-cover" />
              </span>
              <span className="line-clamp-2 text-label-xs leading-tight text-ink group-hover:text-brand small:text-label-sm">
                {category.name}
              </span>
              {typeof category.product_count === "number" && category.product_count > 0 && (
                <span className="hidden text-body-sm text-ink-muted small:block">
                  {category.product_count} {category.product_count === 1 ? "item" : "itens"}
                </span>
              )}
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
  )
}
