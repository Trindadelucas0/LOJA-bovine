import { AvaSettings, storeName } from "@lib/data/avadesk-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const PILLARS = ["Saúde animal", "Energia solar", "Agropecuária"]

/** Hero compacto da home. A arte enviada no admin não entra neste quadro. */
export default function CodedBanner({ settings }: { settings: AvaSettings }) {
  const name = storeName(settings)
  const subtitle =
    settings.tagline ||
    "Medicamentos, nutrição, cercas e energia solar para a rotina da fazenda."

  return (
    <div className="absolute inset-0 flex items-center overflow-hidden bg-navy text-white">
      <svg
        viewBox="0 0 800 360"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMaxYMid slice"
        aria-hidden
      >
        <circle cx="690" cy="64" r="28" className="text-brand" fill="currentColor" />
        <g className="text-brand-light" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M690 18v12M690 98v12M646 64h12M722 64h12M658 32l8 8M714 88l8 8M722 32l-8 8M666 88l-8 8" />
        </g>
        <path d="M420 250c40-70 90-90 140-70 30 12 70 8 110-20v200H420z" className="text-teal" fill="currentColor" opacity="0.45" />
        <path d="M480 360V230h150l-20 40H500v90z" className="text-navy-soft" fill="currentColor" />
        <path d="M470 230h170l-16-36H486z" className="text-white" fill="currentColor" opacity="0.9" />
        <rect x="520" y="250" width="28" height="22" rx="2" className="text-teal-light" fill="currentColor" />
        <rect x="556" y="250" width="28" height="22" rx="2" className="text-teal-light" fill="currentColor" />
        <rect x="548" y="300" width="26" height="60" className="text-brand" fill="currentColor" />
        <g transform="translate(610 292)">
          <ellipse cx="36" cy="28" rx="34" ry="18" className="text-white" fill="currentColor" />
          <circle cx="66" cy="16" r="12" className="text-white" fill="currentColor" />
          <path d="M60 8c2-8 8-10 10-6M70 6c4-8 10-6 8 0" className="text-brand-light" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="70" cy="16" r="1.5" className="text-navy" fill="currentColor" />
        </g>
        <g transform="translate(430 78)">
          <rect x="0" y="16" width="70" height="36" rx="4" transform="skewX(-18)" className="text-navy-deep" fill="currentColor" />
          <path d="M6 28h58M6 40h58M18 16v36M36 16v36M54 16v36" className="text-teal-light" stroke="currentColor" strokeWidth="2" />
        </g>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/20" />
      <div className="relative z-10 flex w-full max-w-xl flex-col gap-1.5 px-4 py-3 small:gap-2 small:px-8">
        <p className="text-label-xs uppercase tracking-[0.16em] text-teal-light">{name}</p>
        <h1 className="font-display text-h-sm font-extrabold leading-tight small:text-h-lg">
          Saúde animal, energia e agro para a sua fazenda
        </h1>
        <p className="line-clamp-1 text-body-sm text-white/80">{subtitle}</p>
        <ul className="hidden gap-1.5 small:flex">
          {PILLARS.map((pillar) => (
            <li key={pillar} className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-label-xs">
              {pillar}
            </li>
          ))}
        </ul>
        <div className="mt-1 flex flex-wrap gap-2">
          <LocalizedClientLink
            href="/store"
            className="inline-flex h-12 items-center rounded-ava-md bg-brand px-4 text-label-md text-white shadow-brand-glow"
          >
            Ver produtos
          </LocalizedClientLink>
          <a
            href="#departamentos"
            className="inline-flex h-12 items-center rounded-ava-md border border-white/30 px-4 text-label-md text-white"
          >
            Departamentos
          </a>
        </div>
      </div>
    </div>
  )
}
