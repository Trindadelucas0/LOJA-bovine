import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Logo({
  name,
  logoUrl,
  compact,
}: {
  name: string
  logoUrl?: string | null
  compact?: boolean
}) {
  return (
    <LocalizedClientLink href="/" className="flex items-center gap-2 shrink-0" data-testid="nav-store-link">
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={name} className={compact ? "h-7 w-auto object-contain" : "h-8 w-auto object-contain"} />
      )}
      <span className={`font-display font-extrabold tracking-tight text-navy ${compact ? "text-h-sm" : "text-h-md"}`}>
        {name}
      </span>
    </LocalizedClientLink>
  )
}
