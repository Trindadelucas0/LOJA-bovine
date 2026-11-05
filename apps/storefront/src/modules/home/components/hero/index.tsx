"use client"

import { useEffect, useState } from "react"
import { AvaBanner, AvaSettings } from "@lib/data/avadesk-content"
import SmartLink from "@modules/avadesk/components/smart-link"
import Icon from "@modules/avadesk/components/icon"
import CodedBanner from "./coded-banner"

const pickSource = (banner: AvaBanner, mobile: boolean) => {
  if (mobile && banner.mobile_image_url) return banner.mobile_image_url
  return banner.image_url || banner.mobile_image_url || null
}

function BannerPhoto({
  banner,
  onDead,
}: {
  banner: AvaBanner
  onDead: () => void
}) {
  const [mobile, setMobile] = useState(false)
  const [src, setSrc] = useState<string | null>(banner.image_url || banner.mobile_image_url || null)
  const [dead, setDead] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)")
    const apply = () => {
      setMobile(media.matches)
      setSrc(pickSource(banner, media.matches))
      setDead(false)
    }
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [banner])

  const fail = () => {
    const desktop = banner.image_url
    if (mobile && src && src === banner.mobile_image_url && desktop && desktop !== src) {
      setSrc(desktop)
      return
    }
    setDead(true)
    onDead()
  }

  if (dead || !src) return null

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={fail}
      className="img-no-alt absolute inset-0 h-full w-full object-cover object-center"
    />
  )

  if (!banner.cta_url) return image

  return (
    <SmartLink
      href={banner.cta_url}
      className="absolute inset-0 block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
    >
      <span className="sr-only">{banner.title}</span>
      {image}
    </SmartLink>
  )
}

export default function Hero({
  banners,
  settings,
}: {
  banners: AvaBanner[]
  settings: AvaSettings
}) {
  const heroes = banners.filter((banner) => banner.position === "hero")
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const [index, setIndex] = useState(0)
  const [touchX, setTouchX] = useState<number | null>(null)
  const visible = heroes.filter((banner) => !hidden[banner.id])
  const count = visible.length
  const current = count ? Math.min(index, count - 1) : 0
  const slide = visible[current]

  const go = (next: number) => {
    if (!count) return
    setIndex((next + count) % count)
  }

  return (
    <section aria-roledescription={count > 1 ? "carrossel" : undefined} aria-label="Destaques da loja">
      <div
        className="relative aspect-[4/3] overflow-hidden bg-navy card-surface small:aspect-[21/8] small:rounded-ava-xl shadow-raised"
        onTouchStart={(event) => setTouchX(event.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(event) => {
          if (touchX == null || count < 2) return
          const delta = (event.changedTouches[0]?.clientX ?? touchX) - touchX
          if (delta > 40) go(current - 1)
          if (delta < -40) go(current + 1)
          setTouchX(null)
        }}
      >
        {slide ? (
          <BannerPhoto key={slide.id} banner={slide} onDead={() => setHidden((prev) => ({ ...prev, [slide.id]: true }))} />
        ) : (
          <CodedBanner settings={settings} />
        )}
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={() => go(current - 1)}
              className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-navy shadow-raised"
            >
              <Icon name="chevron_left" className="text-[24px]" />
            </button>
            <button
              type="button"
              aria-label="Próximo banner"
              onClick={() => go(current + 1)}
              className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-navy shadow-raised"
            >
              <Icon name="chevron_right" className="text-[24px]" />
            </button>
            <div className="absolute inset-x-0 bottom-1 z-10 flex justify-center">
              {visible.map((banner, dot) => (
                <button
                  key={banner.id}
                  type="button"
                  aria-label={`Banner ${dot + 1}`}
                  onClick={() => setIndex(dot)}
                  className="tap-exempt flex h-12 w-8 items-center justify-center"
                >
                  <span className={`h-2 rounded-full ${dot === current ? "w-6 bg-brand" : "w-2 bg-white/80"}`} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
