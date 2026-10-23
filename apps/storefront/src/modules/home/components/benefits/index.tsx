import { AvaItem } from "@lib/data/avadesk-content"
import Icon from "@modules/avadesk/components/icon"

const colors = ["text-brand", "text-chat", "text-stock-in", "text-navy"]

export default function Benefits({ items }: { items: AvaItem[] }) {
  if (!items.length) return null
  return (
    <section className="card-surface small:rounded-ava-xl p-4 small:p-8">
      <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-4 gap-4 small:gap-gutter">
        {items.map((b, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-ava-md bg-subtle flex items-center justify-center shrink-0 ${colors[i % colors.length]}`}>
              <Icon name={b.icon || "check_circle"} className="text-[26px]" />
            </div>
            <div>
              <h4 className="text-label-md text-ink font-bold">{b.title}</h4>
              {b.text && <p className="text-body-sm text-ink-soft mt-1">{b.text}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
