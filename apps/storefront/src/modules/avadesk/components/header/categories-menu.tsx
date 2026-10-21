"use client"

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useId, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "../icon"

type Cat = {
  id: string
  name: string
  handle: string
  category_children?: { id: string; name: string; handle: string }[] | null
}

export default function CategoriesMenu({
  categories,
  title,
}: {
  categories: Cat[]
  title: string
}) {
  const idPrefix = useId()
  const drawerId = `departments-drawer-${idPrefix}`
  const [open, setOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(() =>
    categories.find((category) => category.category_children?.length)?.id ?? null
  )

  return (
    <>
      <button
        type="button"
        aria-label={`Abrir ${title.toLowerCase()}`}
        aria-controls={drawerId}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-ava-md text-navy hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand medium:w-auto medium:px-3"
      >
        <Icon name="menu" className="text-[22px]" />
        <span className="hidden text-label-sm medium:inline">{title}</span>
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-[70]">
        <div className="fixed inset-0 bg-navy/40" aria-hidden="true" />
        <div className="fixed inset-0 flex max-h-[100dvh]">
          <DialogPanel
            id={drawerId}
            className="flex h-[100dvh] w-80 max-w-[calc(100vw-2rem)] flex-col bg-white shadow-2xl"
          >
            <div className="flex min-h-16 items-center justify-between gap-3 bg-navy px-5 text-white">
              <div className="flex min-w-0 items-center gap-3">
                <Icon name="apps" className="text-[20px]" />
                <DialogTitle className="truncate font-display text-label-md uppercase tracking-wide">
                  {title}
                </DialogTitle>
              </div>
              <button
                type="button"
                aria-label={`Fechar ${title.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ava-md hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Icon name="close" className="text-[22px]" />
              </button>
            </div>

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
                    const childrenId = `${drawerId}-subcategories-${category.id}`
                    const labelId = `${drawerId}-category-${category.id}`

                    return (
                      <div key={category.id}>
                        <div className="flex min-h-12 items-center gap-1 px-3">
                          <LocalizedClientLink
                            id={labelId}
                            href={`/categories/${category.handle}`}
                            onClick={() => setOpen(false)}
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
                                onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-between border-t border-line px-5 py-3 text-label-sm text-brand hover:bg-brand-light/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
              >
                Ver todos
                <Icon name="arrow_forward" className="text-[18px]" />
              </LocalizedClientLink>
            </nav>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
