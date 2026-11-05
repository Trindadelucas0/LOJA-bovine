"use client"

import { useState } from "react"

/** Imagem que some se a URL falhar, sem deixar o texto alternativo visível. */
export default function SafeImage({
  src,
  className,
}: {
  src?: string | null
  className?: string
}) {
  const [ok, setOk] = useState(Boolean(src))
  if (!src || !ok) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" onError={() => setOk(false)} className={`img-no-alt ${className || ""}`} />
  )
}
