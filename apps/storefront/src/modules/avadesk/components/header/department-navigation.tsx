"use client"

import { useId, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "../icon"

export type DepartmentCategory = {
  id: string
  name: string
  handle: string
  category_children?: { id: string; name: string; handle: string }[] | null
}

export default function DepartmentNavigation({
  categories,
  title,
  onNavigate,
}: {
  categories: DepartmentCategory[]
  title: string
  onNavigate?: () => void
}) {
  const idPrefix = useId()
  const [expandedId, setExpandedId] = useState<string | null>(() =>
    categories.find((category) => category.category_children?.length)?.id ?? null
  )

  return (
    <nav aria-label={title} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto py-2">
        {categories.length === 0 ? (
          <p className="px-5 py-4 text-body-sm text-ink-muted">
            Nenhum departamento cadastrado.
          </p>
        ) : (
          categories.map((category) => {
            const children = category.category_children || []
            const isExpanded = expandedId === category.id
            const childrenId = `${idPrefix}-subcategories-${category.id}`
            const labelId = `${idPrefix}-category-${category.id}`

            return (
              <div key={category.id}>
                <div className="flex min-h-12 items-center gap-1 px-3">
                  <LocalizedClientLink
                    id={labelId}
                    href={`/categories/${category.handle}`}
                    onClick={onNavigate}
                    className="flex min-h-12 min-w-0 flex-1 items-center rounded-ava-md px-3 py-2 text-body-md text-ink hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                  >
                    <span className="line-clamp-1">{category.name}</span>
                  </LocalizedClientLink>
                  {children.length > 0 && (
                    <button
                      type="button"
                      aria-label={`${isExpanded ? "Recolher" : "Expandir"} subcategorias de ${category.name}`}
                      aria-expanded={isExpanded}
                      aria-controls={childrenId}
                      onClick={() => setExpandedId((current) => current === category.id ? null : category.id)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ava-md text-ink-muted hover:bg-subtle hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                    >
                      <Icon name={isExpanded ? "expand_more" : "chevron_right"} className="text-[18px]" />
                    </button>
                  )}
                </div>
                {children.length > 0 && (
                  <div
                    id={childrenId}
                    role="group"
                    aria-labelledby={labelId}
                    className={isExpanded ? "ml-6 my-1 flex flex-col border-l border-line bg-subtle/50" : "hidden"}
                  >
                    {children.map((child) => (
                      <LocalizedClientLink
                        key={child.id}
                        href={`/categories/${child.handle}`}
                        onClick={onNavigate}
                        className="flex min-h-11 items-center px-5 py-2 text-body-sm text-ink-soft hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                      >
                        <span className="line-clamp-1">{child.name}</span>
                      </LocalizedClientLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
      <LocalizedClientLink
        href="/store"
        onClick={onNavigate}
        className="flex min-h-12 items-center justify-between border-t border-line px-5 py-3 text-label-sm text-brand hover:bg-brand-light/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
      >
        Ver todos
        <Icon name="arrow_forward" className="text-[18px]" />
      </LocalizedClientLink>
    </nav>
  )
}
