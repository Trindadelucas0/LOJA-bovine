import Icon from "@modules/avadesk/components/icon"

export const STEPS = [
  { id: "cart", label: "Carrinho", icon: "shopping_cart" },
  { id: "address", label: "Endereço", icon: "location_on" },
  { id: "delivery", label: "Entrega", icon: "local_shipping" },
  { id: "payment", label: "Pagamento", icon: "payments" },
  { id: "review", label: "Revisão", icon: "fact_check" },
] as const

export type StepId = (typeof STEPS)[number]["id"]

export default function Stepper({ current }: { current: StepId }) {
  const idx = STEPS.findIndex((s) => s.id === current)
  return (
    <ol className="flex items-center w-full bg-white rounded-ava-lg shadow-sm px-3 py-3 small:px-8 small:py-5" data-testid="checkout-stepper">
      {STEPS.map((s, i) => {
        const done = i < idx
        const active = i === idx
        return (
          <li key={s.id} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col small:flex-row items-center gap-1 small:gap-2">
              <span
                className={`w-7 h-7 small:w-10 small:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  done ? "bg-stock-in text-white" : active ? "bg-navy text-white ring-4 ring-navy/10" : "bg-subtle text-ink-muted"
                }`}
              >
                <Icon name={done ? "check" : s.icon} className="text-[16px] small:text-[20px]" />
              </span>
              <span className={`text-[10px] small:text-label-sm ${active ? "text-ink font-bold" : done ? "text-stock-in" : "text-ink-muted"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className={`flex-1 h-0.5 mx-1 small:mx-3 rounded ${i < idx ? "bg-stock-in" : "bg-line"}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
