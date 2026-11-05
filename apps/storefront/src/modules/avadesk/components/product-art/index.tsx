/** Moldura de produto sem foto. Não simula um item real. */
export default function ProductArt({ label = "Foto em breve" }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-b from-subtle to-card text-navy">
      <svg viewBox="0 0 80 64" className="h-14 w-16" aria-hidden>
        <rect x="8" y="18" width="64" height="40" rx="8" className="text-line" fill="currentColor" />
        <rect x="14" y="24" width="52" height="28" rx="4" className="text-card" fill="currentColor" />
        <path d="M28 24c2-10 8-16 12-16s10 6 12 16" className="text-teal" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="40" cy="36" r="7" className="text-brand-light" fill="currentColor" />
        <path d="M40 32v8M36 36h8" className="text-brand" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="px-2 text-center text-label-xs uppercase tracking-wider text-ink-muted">{label}</span>
    </div>
  )
}
