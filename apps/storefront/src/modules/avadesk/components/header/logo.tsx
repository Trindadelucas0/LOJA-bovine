"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export function brandParts(name: string) {
  const clean = name.trim() || "BOVINE"
  const match = clean.match(/^(bovine)\b[\s,·\-–—:|]*(.*)$/i)
  if (match) {
    return { word: "BOVINE", tagline: match[2].trim() || "Saúde Animal e Agro" }
  }
  return { word: clean, tagline: "" }
}

function BrandMark({ light }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
      <rect width="40" height="40" rx="12" className={light ? "text-white" : "text-navy"} fill="currentColor" />
      <circle cx="29" cy="11" r="4.5" className="text-brand" fill="currentColor" />
      <path
        d="M11 29V13h6.4c3.6 0 5.8 1.8 5.8 4.5 0 1.8-1 3.2-2.6 3.9 2 .6 3.2 2.2 3.2 4.3 0 3-2.4 4.8-6.4 4.8H11zm4.2-9.2h2.4c1.5 0 2.4-.7 2.4-1.8s-.9-1.8-2.4-1.8h-2.4v3.6zm0 6.6V22.2h2.8c1.7 0 2.7.8 2.7 2.1s-1 2.1-2.7 2.1h-2.8z"
        className={light ? "text-navy" : "text-white"}
        fill="currentColor"
      />
    </svg>
  )
}

export default function Logo({
  name,
  logoUrl,
  compact,
  tone = "dark",
}: {
  name: string
  logoUrl?: string | null
  compact?: boolean
  tone?: "dark" | "light"
}) {
  const { word, tagline } = brandParts(name)
  const [imageOk, setImageOk] = useState(Boolean(logoUrl))
  const light = tone === "light"
  const wordColor = light ? "text-white" : "text-navy"
  const tagColor = light ? "text-teal-light" : "text-brand-dark"

  return (
    <LocalizedClientLink href="/" className="flex min-w-0 shrink-0 items-center gap-2" data-testid="nav-store-link">
      {logoUrl && imageOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          onError={() => setImageOk(false)}
          className="img-no-alt h-9 w-auto max-w-[120px] shrink-0 object-contain"
        />
      ) : (
        <BrandMark light={light} />
      )}
      <span className="min-w-0 leading-none">
        <span className={`block truncate font-display text-[20px] font-extrabold tracking-tight ${wordColor}`}>
          {word}
        </span>
        {tagline && !compact && (
          <span className={`mt-0.5 hidden max-w-[11rem] truncate text-[11px] font-semibold uppercase tracking-[0.12em] large:block ${tagColor}`}>
            {tagline}
          </span>
        )}
      </span>
    </LocalizedClientLink>
  )
}
