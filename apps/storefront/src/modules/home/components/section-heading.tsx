import SmartLink from "@modules/avadesk/components/smart-link"
import Icon from "@modules/avadesk/components/icon"

export default function SectionHeading({
  eyebrow,
  title,
  linkLabel,
  linkHref,
  children,
}: {
  eyebrow?: string
  title: string
  linkLabel?: string
  linkHref?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4 small:mb-6">
      <div>
        {eyebrow && (
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand" />
            <span className="text-label-xs uppercase tracking-widest text-ink-soft">{eyebrow}</span>
          </div>
        )}
        <h2 className="font-display text-h-sm small:text-h-lg text-ink">{title}</h2>
      </div>
      {children}
      {linkLabel && linkHref && (
        <SmartLink href={linkHref} className="inline-flex items-center gap-1 text-label-sm small:text-label-md text-brand hover:text-brand-dark shrink-0">
          <span>{linkLabel}</span>
          <Icon name="chevron_right" className="text-[18px]" />
        </SmartLink>
      )}
    </div>
  )
}
