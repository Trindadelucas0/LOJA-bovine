"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/avadesk/components/icon"

type Department = {
  id: string
  name: string
  handle: string
  category_children?: { id: string; name: string; handle: string }[] | null
}

export default function DepartmentsMenu({ title, departments }: { title: string; departments: Department[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
        <div className="flex flex-1 flex-col overflow-y-auto py-2">
          {departments.map((department) => {
            const children = department.category_children || []
            const isExpanded = expandedId === department.id
            const childrenId = `department-subcategories-${department.id}`
            const labelId = `department-label-${department.id}`

            return (
              <div key={department.id}>
                <div className="flex min-h-11 items-center gap-1 px-3">
                  <LocalizedClientLink
                    id={labelId}
                    href={`/categories/${department.handle}`}
                    className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-ava-md px-2 py-2 text-body-md text-ink hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                  >
                    <span className="line-clamp-1">{department.name}</span>
                  </LocalizedClientLink>
                  {children.length > 0 && (
                    <button
                      type="button"
                      aria-label={`${isExpanded ? "Recolher" : "Expandir"} subcategorias de ${department.name}`}
                      aria-expanded={isExpanded}
                      aria-controls={childrenId}
                      onClick={() => setExpandedId((current) => current === department.id ? null : department.id)}
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
                        className="flex min-h-11 items-center px-5 py-2 text-body-sm text-ink-soft hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                      >
                        <span className="line-clamp-1">{child.name}</span>
                      </LocalizedClientLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
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
