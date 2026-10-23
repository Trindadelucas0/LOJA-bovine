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
  // No checkout o carrinho ja ficou para tras: conta so os passos que faltam decidir.
  const flow = STEPS.slice(1)
  const flowIdx = Math.max(0, idx - 1)
  const currentStep = flow[flowIdx] || flow[0]
  const percent = ((flowIdx + 1) / flow.length) * 100

  return (
    <div className="card-surface px-4 py-4 small:px-8 small:py-5" data-testid="checkout-stepper">
      {/* Celular: uma frase direta e uma barra de progresso */}
      <div className="small:hidden flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display text-h-sm text-ink">{currentStep.label}</span>
          <span className="text-label-sm text-ink-soft">
            Passo {flowIdx + 1} de {flow.length}
          </span>
        </div>
        <div className="h-2 rounded-full bg-subtle overflow-hidden">
          <span
            className="block h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Telas maiores: trilha completa com icones */}
      <ol className="hidden small:flex items-center w-full">
        {STEPS.map((s, i) => {
          const done = i < idx
          const active = i === idx
          return (
            <li key={s.id} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
              <div className="flex items-center gap-2">
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    done
                      ? "bg-stock-in text-white"
                      : active
                        ? "bg-navy text-white ring-4 ring-navy/15"
                        : "bg-subtle border border-line text-ink-muted"
                  }`}
                >
                  <Icon name={done ? "check" : s.icon} className="text-[22px]" />
                </span>
                <span
                  className={`text-label-md ${
                    active ? "text-ink" : done ? "text-stock-in" : "text-ink-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className={`flex-1 h-1 mx-3 rounded ${i < idx ? "bg-stock-in" : "bg-line"}`} />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
