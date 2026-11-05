import { AvaItem } from "@lib/data/avadesk-content"
import Icon from "../icon"

const DEFAULTS: AvaItem[] = [
  { icon: "local_shipping", title: "Entrega na fazenda" },
  { icon: "verified", title: "Orientação técnica" },
  { icon: "lock", title: "Pagamento seguro" },
  { icon: "support_agent", title: "Atendimento especializado" },
]

/** Tarja fina no topo. Uma linha só: se não couber, rola dentro da faixa. */
export default function UtilityBar({ items }: { items?: AvaItem[] | null }) {
  const list = (items || []).filter((item) => item.title || item.text)
  const source = list.length ? list : DEFAULTS

  return (
    <div className="relative bg-navy text-white">
      <ul className="mx-auto flex h-8 max-w-page items-center gap-4 overflow-x-auto whitespace-nowrap px-margin-m no-scrollbar small:px-margin">
        {source.map((item, index) => (
          <li key={index} className="flex shrink-0 items-center gap-1.5 text-label-xs">
            <Icon name={item.icon || "verified"} className="text-[16px] text-teal-light" filled />
            <span>{item.title || item.text}</span>
          </li>
        ))}
      </ul>
      <span className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-navy to-transparent small:hidden" />
    </div>
  )
}
