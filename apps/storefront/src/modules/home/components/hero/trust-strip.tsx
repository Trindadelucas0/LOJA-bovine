import { AvaItem } from "@lib/data/avadesk-content"
import Icon from "@modules/avadesk/components/icon"

/** Faixa compacta de selos (mobile), mesmos itens dos selos do banner. */
export default function TrustStrip({ items }: { items: AvaItem[] }) {
  if (!items.length) return null
  return (
    <div className="flex items-center justify-between card-surface rounded-ava-md p-3 overflow-x-auto no-scrollbar gap-3">
      {items.slice(0, 3).map((b, i) => (
        <div key={i} className="flex items-center gap-1.5 shrink-0">
          <Icon name={b.icon || "verified"} className="text-[18px] text-teal" filled />
          <span className="text-label-xs text-ink">{b.title}</span>
        </div>
      ))}
    </div>
  )
}
