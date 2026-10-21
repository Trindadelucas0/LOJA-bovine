import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"

type Department = HttpTypes.StoreProductCategory & { product_count?: number }

export default function DepartmentsMenu({ title, departments }: { title: string; departments: Department[] }) {
  if (!departments.length) return null

  return (
    <nav aria-label="Departamentos" className="min-w-0">
      <div className="small:hidden">
        <h2 className="mb-2 font-display text-label-md uppercase tracking-wide text-ink-soft">{title}</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {departments.map((department) => (
            <LocalizedClientLink
              key={department.id}
              href={`/categories/${department.handle}`}
              className="min-h-11 shrink-0 inline-flex items-center gap-2 rounded-ava-md border border-line bg-white px-4 text-label-sm text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {department.name}
            </LocalizedClientLink>
          ))}
        </div>
      </div>

      <div className="hidden small:flex h-full flex-col overflow-hidden rounded-ava-xl border border-line bg-white shadow-sm">
        <div className="flex items-center gap-2 bg-navy px-5 py-4 text-white">
          <Icon name="apps" className="text-[20px]" />
          <h2 className="line-clamp-1 font-display text-label-md uppercase tracking-wide">{title}</h2>
        </div>
        <div className="flex flex-1 flex-col py-2">
          {departments.map((department) => (
            <LocalizedClientLink
              key={department.id}
              href={`/categories/${department.handle}`}
              className="group flex min-h-11 items-center justify-between gap-3 px-5 py-2 text-body-md text-ink hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
            >
              <span className="line-clamp-1">{department.name}</span>
              <Icon name="chevron_right" className="text-[18px] text-ink-muted group-hover:text-brand" />
            </LocalizedClientLink>
          ))}
        </div>
        <LocalizedClientLink
          href="/store"
          className="flex min-h-11 items-center justify-between border-t border-line px-5 py-3 text-label-sm text-brand hover:bg-brand-light/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
        >
          Ver todos
          <Icon name="arrow_forward" className="text-[18px]" />
        </LocalizedClientLink>
      </div>
    </nav>
  )
}
