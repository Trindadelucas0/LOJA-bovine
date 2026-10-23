import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"
import SectionHeading from "../section-heading"

type Cat = HttpTypes.StoreProductCategory & { product_count?: number }

export default function CategoryGrid({ title, categories }: { title: string; categories: Cat[] }) {
  if (!categories.length) return null
  return (
    <section>
      <SectionHeading eyebrow="Navegação rápida" title={title} linkLabel="Ver todas" linkHref="/store" />
      <div className="flex small:grid small:grid-cols-6 gap-3 small:gap-gutter overflow-x-auto no-scrollbar -mx-margin-m px-margin-m small:mx-0 small:px-0 py-1">
        {categories.map((c) => {
          const meta = (c.metadata || {}) as Record<string, unknown>
          const image = typeof meta.image === "string" ? meta.image : null
          const icon = typeof meta.icon === "string" ? meta.icon : "category"
          return (
            <LocalizedClientLink
              key={c.id}
              href={`/categories/${c.handle}`}
              className="group flex flex-col items-center text-center shrink-0 w-20 small:w-auto small:card-interactive small:p-4 transition-all"
            >
              <div className="w-16 h-16 small:w-20 small:h-20 rounded-ava-lg bg-card border border-line small:border-0 small:bg-subtle overflow-hidden mb-1.5 small:mb-2 p-2 flex items-center justify-center text-navy group-hover:scale-105 transition-transform">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={c.name} className="w-full h-full object-contain" />
                ) : (
                  <Icon name={icon} className="text-[30px] small:text-[36px]" filled />
                )}
              </div>
              <span className="text-label-xs small:text-label-md text-ink group-hover:text-brand transition-colors line-clamp-1">
                {c.name}
              </span>
              {typeof c.product_count === "number" && (
                <span className="hidden small:block text-body-sm text-ink-muted mt-0.5">
                  {c.product_count} {c.product_count === 1 ? "item" : "itens"}
                </span>
              )}
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
  )
}
