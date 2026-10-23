import { AvaBanner, storeName, AvaSettings } from "@lib/data/avadesk-content"
import SmartLink from "@modules/avadesk/components/smart-link"

export default function Hero({
  banner,
  settings,
}: {
  banner?: AvaBanner
  settings: AvaSettings
}) {
  const imageUrl = banner?.image_url || banner?.mobile_image_url

  if (imageUrl) {
    const picture = (
      <picture className="block h-full w-full">
        {banner?.mobile_image_url && (
          <source media="(max-width: 1023px)" srcSet={banner.mobile_image_url} />
        )}
        <img
          src={imageUrl}
          alt={banner?.title || `Banner da ${storeName(settings)}`}
          className="block h-full w-full object-cover object-center"
        />
      </picture>
    )

    return (
      <section className="w-full overflow-hidden card-surface small:rounded-ava-xl shadow-raised medium:h-full medium:min-h-48">
        {banner?.cta_url ? (
          <SmartLink
            href={banner.cta_url}
            className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
          >
            {picture}
          </SmartLink>
        ) : picture}
      </section>
    )
  }

  return (
    <section className="w-full rounded-ava-lg small:rounded-ava-xl bg-navy text-white p-6 small:p-10 shadow-raised">
      <div className="max-w-2xl">
        <h1 className="font-display text-h-md small:text-h-xl font-extrabold">
          Bem-vindo à {storeName(settings)}
        </h1>
        {settings.tagline && (
          <p className="mt-3 text-body-sm small:text-body-lg text-white/75">{settings.tagline}</p>
        )}
      </div>
    </section>
  )
}
