import { AvaBanner } from "@lib/data/avadesk-content"
import Icon from "@modules/avadesk/components/icon"
import SmartLink from "@modules/avadesk/components/smart-link"

export default function PromoBanner({ banner, pixText }: { banner?: AvaBanner; pixText?: string | null }) {
  const title = banner?.title || pixText
  if (!title) return null
  const subtitle = banner?.subtitle
  return (
    <section className="flex items-center gap-3 small:gap-4 bg-brand-light/60 small:bg-white border border-brand/20 rounded-ava-lg p-3 small:p-5 shadow-sm">
      {banner?.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={banner.image_url} alt="" className="w-12 h-12 small:w-14 small:h-14 rounded-ava-md object-cover shrink-0" />
      ) : (
        <div className="w-10 h-10 small:w-14 small:h-14 rounded-full small:rounded-ava-md bg-brand text-white flex items-center justify-center shrink-0">
          <Icon name="percent" className="text-[22px] small:text-[28px]" />
        </div>
      )}
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
