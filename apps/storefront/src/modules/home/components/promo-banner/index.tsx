import { AvaBanner } from "@lib/data/avadesk-content"
import Icon from "@modules/avadesk/components/icon"
import SafeImage from "@modules/avadesk/components/safe-image"
import SmartLink from "@modules/avadesk/components/smart-link"

export default function PromoBanner({ banner, pixText }: { banner?: AvaBanner; pixText?: string | null }) {
  const title = banner?.title || pixText
  if (!title) return null
  const subtitle = banner?.subtitle
  return (
    <section className="flex items-center gap-3 small:gap-4 bg-brand-light/60 small:bg-card border border-brand/25 rounded-ava-lg p-3.5 small:p-5 shadow-card">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-ava-md bg-brand text-white small:h-14 small:w-14">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="percent" className="text-[22px] small:text-[28px]" />
        </div>
        <SafeImage src={banner?.image_url} className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-body-md small:text-h-sm text-ink font-bold">{title}</p>
        {subtitle && <p className="text-body-sm text-ink-soft line-clamp-2">{subtitle}</p>}
      </div>
      {banner?.cta_label ? (
        <SmartLink
          href={banner.cta_url || "/store"}
          className="hidden small:inline-flex items-center gap-1 px-5 py-2.5 rounded-ava-md bg-navy hover:bg-navy-deep text-white text-label-md shrink-0"
        >
          {banner.cta_label}
        </SmartLink>
      ) : null}
      <SmartLink href={banner?.cta_url || "/store"} className="small:hidden text-brand">
        <Icon name="chevron_right" className="text-[22px]" />
      </SmartLink>
    </section>
  )
}
