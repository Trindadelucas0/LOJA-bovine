"use client"

import Image from "next/image"
import { useState } from "react"
import ProductArt from "../product-art"

/** Foto do produto. Se a URL falhar, mostra a moldura em vez de texto alternativo solto. */
export default function ProductMedia({ image, alt }: { image?: string | null; alt?: string }) {
  const [failed, setFailed] = useState(false)

  if (!image || failed) return <ProductArt />

  return (
    <Image
      src={image}
      alt={alt || ""}
      className="absolute inset-0 object-cover object-center text-[0px] text-transparent"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
      onError={() => setFailed(true)}
    />
  )
}
