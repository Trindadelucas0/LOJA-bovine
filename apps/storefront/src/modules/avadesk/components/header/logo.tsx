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
    <LocalizedClientLink href="/" className="flex min-w-0 items-center gap-2" data-testid="nav-store-link">
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={name} className={compact ? "h-7 w-auto object-contain shrink-0" : "h-8 w-auto object-contain shrink-0"} />
      )}
      <span className={`font-display font-extrabold tracking-tight text-navy truncate ${compact ? "text-h-sm" : "text-h-md"}`}>
        {name}
      </span>
    </LocalizedClientLink>
  )
}
