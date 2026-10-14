import { clx } from "@modules/common/components/ui"

/** Ícone Material Symbols Outlined (nome do ícone em `name`). */
export default function Icon({
  name,
  className,
  filled,
}: {
  name: string
  className?: string
  filled?: boolean
}) {
  return (
    <span
      aria-hidden
      className={clx("material-symbols-outlined leading-none select-none", className)}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  )
}
