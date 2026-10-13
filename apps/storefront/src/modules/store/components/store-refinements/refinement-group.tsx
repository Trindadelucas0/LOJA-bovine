"use client"

import { useRefinementList } from "react-instantsearch"

type RefinementGroupProps = {
  attribute: string
  title: string
}

const RefinementGroup = ({ attribute, title }: RefinementGroupProps) => {
  const { items, refine } = useRefinementList({
    attribute,
    limit: 20,
    sortBy: ["count:desc", "name:asc"],
  })

  if (!items.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-label-xs uppercase tracking-wider text-ink-soft">{title}</span>
      <ul className="flex flex-col gap-y-2">
        {items.map((item) => (
          <li key={item.value}>
            <label className="flex cursor-pointer items-center gap-x-2">
              <input
                type="checkbox"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
                className="w-4 h-4 shrink-0 accent-[#FE6B00] rounded"
                data-testid={`refinement-${attribute}`}
              />
              <span className={`text-body-md min-w-0 flex-1 break-words ${item.isRefined ? "text-ink font-semibold" : "text-ink-soft"}`}>
                {item.label}
              </span>
              <span className="text-body-sm shrink-0 text-ink-muted bg-subtle rounded-full px-2">{item.count}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RefinementGroup
