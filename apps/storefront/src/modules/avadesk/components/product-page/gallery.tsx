"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import Icon from "../icon"

export default function ProductGallery({
  images,
  title,
  badge,
}: {
  images: HttpTypes.StoreProductImage[]
  title: string
  badge?: string | null
}) {
  const [active, setActive] = useState(0)
  useEffect(() => setActive(0), [images])
  const current = images[active]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-square rounded-ava-lg small:rounded-ava-xl bg-white overflow-hidden shadow-sm">
        {badge && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-navy text-white text-label-xs uppercase">
            {badge}
          </span>
        )}
        {current?.url ? (
          <Image src={current.url} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 600px" className="object-contain p-4" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-subtle">
            <PlaceholderImage size={40} />
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Imagem anterior"
              onClick={() => setActive((a) => (a - 1 + images.length) % images.length)}
              className="small:hidden absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center"
            >
              <Icon name="chevron_left" className="text-[22px]" />
            </button>
            <button
              type="button"
              aria-label="Próxima imagem"
              onClick={() => setActive((a) => (a + 1) % images.length)}
              className="small:hidden absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center"
            >
              <Icon name="chevron_right" className="text-[22px]" />
            </button>
            <div className="small:hidden absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-brand" : "w-1.5 bg-line-strong"}`} />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="hidden small:grid grid-cols-4 gap-3">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-ava-md bg-white overflow-hidden border-2 transition-colors ${
                i === active ? "border-navy" : "border-transparent hover:border-line-strong"
              }`}
              aria-label={`Imagem ${i + 1}`}
            >
              {img.url && <Image src={img.url} alt="" fill sizes="120px" className="object-contain p-1.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
