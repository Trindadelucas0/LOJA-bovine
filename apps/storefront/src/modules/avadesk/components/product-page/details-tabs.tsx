"use client"

import { useState } from "react"
import Icon from "../icon"

export type DetailSection = { id: string; title: string; icon: string; content: React.ReactNode }

/** Abas no desktop, acordeão no mobile. */
export default function DetailsTabs({ sections }: { sections: DetailSection[] }) {
  const [active, setActive] = useState(sections[0]?.id)
  const [open, setOpen] = useState<string | null>(null)
  if (!sections.length) return null
  return (
    <section className="bg-white rounded-ava-lg small:rounded-ava-xl shadow-sm overflow-hidden">
      <div className="hidden small:flex border-b border-line bg-subtle/60">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={`flex items-center gap-2 px-6 py-4 text-label-md border-b-2 transition-colors ${
              active === s.id ? "border-brand text-ink bg-white" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            <Icon name={s.icon} className="text-[20px]" />
            {s.title}
          </button>
        ))}
      </div>
      <div className="hidden small:block p-8">
        {sections.map((s) => (
          <div key={s.id} hidden={s.id !== active}>
            {s.content}
          </div>
        ))}
      </div>
      <div className="small:hidden divide-y divide-line">
        {sections.map((s) => (
          <div key={s.id}>
            <button
              type="button"
              onClick={() => setOpen((o) => (o === s.id ? null : s.id))}
              className="w-full flex items-center gap-3 px-4 py-4 text-label-md text-ink"
              aria-expanded={open === s.id}
            >
              <Icon name={s.icon} className="text-[20px] text-ink-soft" />
              <span className="flex-1 text-left">{s.title}</span>
              <Icon name={open === s.id ? "expand_less" : "expand_more"} className="text-[22px] text-ink-muted" />
            </button>
            {open === s.id && <div className="px-4 pb-4">{s.content}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
