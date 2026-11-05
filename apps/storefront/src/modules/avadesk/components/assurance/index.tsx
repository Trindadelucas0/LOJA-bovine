import Icon from "../icon"

const ITEMS = [
  { icon: "local_shipping", title: "Entrega na fazenda", text: "Enviamos para a propriedade" },
  { icon: "lock", title: "Pagamento seguro", text: "Checkout protegido" },
  { icon: "support_agent", title: "Orientação técnica", text: "Equipe para tirar dúvidas" },
  { icon: "verified", title: "Compra pelo site", text: "Acompanhe o pedido na conta" },
]

export default function Assurance() {
  return (
    <section aria-label="Selos da loja" className="card-surface p-4 small:rounded-ava-xl small:p-6">
      <ul className="grid grid-cols-2 gap-4 small:grid-cols-4">
        {ITEMS.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ava-md bg-subtle text-navy">
              <Icon name={item.icon} className="text-[24px]" />
            </span>
            <span>
              <span className="block text-label-sm text-ink">{item.title}</span>
              <span className="mt-0.5 block text-body-sm text-ink-soft">{item.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
