"use client"

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useParams, usePathname } from "next/navigation"
import { useId, useState } from "react"
import Icon from "../icon"
import DepartmentNavigation, { DepartmentCategory } from "./department-navigation"

export default function CategoriesMenu({
  categories,
  title,
}: {
  categories: DepartmentCategory[]
  title: string
}) {
  const idPrefix = useId()
  const drawerId = `departments-drawer-${idPrefix}`
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams<{ countryCode?: string }>()
  const homePath = params.countryCode ? `/${params.countryCode}` : ""
  const isHome = pathname === homePath || pathname === `${homePath}/`

  return (
    <>
      <button
        type="button"
        aria-label={`Abrir ${title.toLowerCase()}`}
        aria-controls={drawerId}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-ava-md text-navy hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand small:w-auto small:px-3 ${isHome ? "medium:hidden" : ""}`}
      >
        <Icon name="menu" className="text-[22px]" />
        <span className="hidden text-label-sm small:inline">{title}</span>
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

            <DepartmentNavigation
              categories={categories}
              title={title}
              onNavigate={() => setOpen(false)}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export function CategoriesSidebar({
  categories,
  title,
}: {
  categories: DepartmentCategory[]
  title: string
}) {
  return (
    <aside className="hidden medium:block min-w-0 self-stretch">
      <div className="sticky top-24 flex h-[calc(100dvh-7.5rem)] min-h-[24rem] flex-col overflow-hidden rounded-ava-xl border border-line bg-white shadow-sm">
        <div className="flex min-h-16 items-center gap-3 bg-navy px-5 text-white">
          <Icon name="apps" className="text-[20px]" />
          <h2 className="line-clamp-2 font-display text-label-sm uppercase tracking-wide">
            {title}
          </h2>
        </div>
        <DepartmentNavigation categories={categories} title={title} />
      </div>
    </aside>
  )
}
