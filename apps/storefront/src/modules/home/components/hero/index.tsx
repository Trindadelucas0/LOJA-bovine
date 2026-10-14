import { AvaBanner, AvaItem, storeName, AvaSettings } from "@lib/data/avadesk-content"
import Icon from "@modules/avadesk/components/icon"
import SmartLink from "@modules/avadesk/components/smart-link"

export default function Hero({
  banner,
  settings,
  badges,
}: {
  banner?: AvaBanner
  settings: AvaSettings
  badges: AvaItem[]
}) {
  // Fallback neutro: sem banner cadastrado, mostra nome/slogan da loja.
  const title = banner?.title || `Bem-vindo à ${storeName(settings)}`
  const subtitle = banner ? banner.subtitle : settings.tagline
  const ctaLabel = banner?.cta_label || (banner ? null : "Ver produtos")
  const ctaUrl = banner?.cta_url || "/store"

  return (
    <section className="relative w-full rounded-ava-lg small:rounded-ava-xl bg-gradient-to-br small:bg-gradient-to-r from-navy-deep via-navy to-navy-soft text-white overflow-hidden shadow-md small:shadow-xl">
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-chat/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 small:grid-cols-12 gap-gutter items-center p-4 small:p-10">
        <div className="small:col-span-7 flex flex-col gap-3 small:gap-4">
          {banner?.eyebrow && (
            <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-brand text-white text-label-xs uppercase tracking-wider shadow-sm">
              <Icon name="bolt" className="text-[14px]" filled />
              {banner.eyebrow}
            </span>
          )}
          <h1 className="font-display text-[22px] leading-7 small:text-h-xl font-extrabold max-w-2xl">{title}</h1>
          {subtitle && <p className="text-body-sm small:text-body-lg text-white/75 max-w-xl">{subtitle}</p>}
          {(ctaLabel || banner?.cta2_label) && (
            <div className="flex flex-wrap items-center gap-2 small:gap-3 pt-1">
              {ctaLabel && (
                <SmartLink
                  href={ctaUrl}
                  className="inline-flex items-center justify-center gap-2 px-4 small:px-6 py-2.5 small:py-3.5 rounded-ava-md bg-brand hover:bg-brand-dark text-white text-label-md transition-all shadow-lg shadow-brand/30 active:scale-95"
                >
                  <span>{ctaLabel}</span>
                  <Icon name="arrow_forward" className="text-[20px]" />
                </SmartLink>
              )}
              {banner?.cta2_label && (
                <SmartLink
                  href={banner.cta2_url || "#chat"}
                  className="inline-flex items-center justify-center gap-2 px-4 small:px-5 py-2.5 small:py-3.5 rounded-ava-md bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-label-md transition-all"
                >
                  <Icon name="forum" className="text-[20px] text-chat" />
                  <span>{banner.cta2_label}</span>
                </SmartLink>
              )}
            </div>
          )}
          {badges.length > 0 && (
            <div className="hidden small:grid grid-cols-3 gap-3 pt-2">
              {badges.slice(0, 3).map((b, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-ava-md p-2">
                  <div className="w-9 h-9 rounded-ava bg-white/15 flex items-center justify-center shrink-0 text-teal-light">
                    <Icon name={b.icon || "check_circle"} className="text-[22px]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-label-sm font-bold truncate">{b.title}</span>
                    {b.text && <span className="text-label-xs font-normal text-ink-muted truncate">{b.text}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {(banner?.image_url || banner?.mobile_image_url) && (
          <div className="small:col-span-5">
            <picture>
              {banner.mobile_image_url && <source media="(max-width: 1023px)" srcSet={banner.mobile_image_url} />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.image_url || banner.mobile_image_url!}
                alt={banner.title}
                className="w-full h-40 small:h-80 object-cover rounded-ava-lg shadow-2xl"
              />
            </picture>
          </div>
        )}
      </div>
    </section>
  )
}
