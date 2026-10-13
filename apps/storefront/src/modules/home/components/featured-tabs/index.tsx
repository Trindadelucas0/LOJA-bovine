"use client"

import { useState } from "react"

/** Abas (pills) que alternam entre listas de produtos já renderizadas no servidor. */
export default function FeaturedTabs({
  tabs,
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[]
}) {
  const [active, setActive] = useState(tabs[0]?.id)
  if (!tabs.length) return null
  return (
    <div>
      {tabs.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`px-3 py-1.5 rounded-full text-label-xs whitespace-nowrap transition-colors ${
                active === t.id ? "bg-navy text-white" : "bg-subtle text-ink-soft hover:bg-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      {tabs.map((t) => (
        <div key={t.id} hidden={t.id !== active}>
          {t.content}
        </div>
      ))}
    </div>
  )
}
