"use client"

import { useEffect, useRef, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "../icon"

type Cat = { id: string; name: string; handle: string }

export default function CategoriesMenu({ categories }: { categories: Cat[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-3 py-1.5 text-ink-soft hover:text-ink text-label-sm"
        aria-expanded={open}
      >
        <Icon name="apps" className="text-[18px]" />
        <span>Categorias</span>
        <Icon name="expand_more" className="text-[16px]" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-ava-lg shadow-xl border border-line py-2 z-50">
          {categories.length === 0 && (
            <p className="px-4 py-2 text-body-sm text-ink-muted">Nenhuma categoria cadastrada.</p>
          )}
          {categories.map((c) => (
            <LocalizedClientLink
              key={c.id}
              href={`/categories/${c.handle}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-body-md text-ink hover:bg-subtle"
            >
              {c.name}
              <Icon name="chevron_right" className="text-[18px] text-ink-muted" />
            </LocalizedClientLink>
          ))}
          <div className="border-t border-line mt-1 pt-1">
            <LocalizedClientLink
              href="/store"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-label-sm text-brand hover:bg-subtle"
            >
              Ver todos os produtos
            </LocalizedClientLink>
          </div>
        </div>
      )}
    </div>
  )
}
