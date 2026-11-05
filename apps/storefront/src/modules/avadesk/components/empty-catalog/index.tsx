import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { categoryIcon } from "@lib/util/category-icon"
import Icon from "../icon"
import ProductArt from "../product-art"

const SHELVES = ["Ofertas", "Mais vendidos", "Novidades", "Destaques"]

type Cat = { name: string; handle: string }

/** Estado vazio da vitrine. Não inventa produto, preço ou depoimento. */
export default function EmptyCatalog({
  title = "As prateleiras estão sendo preparadas",
  text = "Quando os produtos forem publicados, ofertas, mais vendidos e novidades aparecem aqui. Enquanto isso, escolha um departamento.",
  categories = [],
}: {
  title?: string
  text?: string
  categories?: Cat[]
}) {
  return (
    <section className="card-surface p-4 small:rounded-ava-xl small:p-8" data-testid="no-products">
      <div className="mb-5 max-w-2xl">
        <h2 className="font-display text-h-sm text-ink small:text-h-md">{title}</h2>
        <p className="mt-2 text-body-md text-ink-soft">{text}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 small:grid-cols-4">
        {SHELVES.map((shelf) => (
          <li key={shelf} className="overflow-hidden rounded-ava-lg border border-dashed border-line-strong bg-subtle/70">
            <div className="relative aspect-[4/3]">
              <ProductArt label="Em breve" />
            </div>
            <div className="p-3">
              <p className="font-display text-label-md text-ink">{shelf}</p>
              <p className="mt-1 text-body-sm text-ink-muted">Aguardando produtos publicados.</p>
            </div>
          </li>
        ))}
      </ul>
      {categories.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <li key={category.handle}>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-label-sm text-ink hover:border-brand hover:text-brand"
              >
                <Icon name={categoryIcon(category.name)} className="text-[18px] text-navy" />
                {category.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
