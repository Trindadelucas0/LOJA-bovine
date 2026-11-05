const FLAGS = ["Pix", "Visa", "Mastercard", "Elo", "Hipercard", "Amex", "Boleto"]

/** Selos de pagamento em texto. A loja não recebeu as artes oficiais das bandeiras. */
export default function PaymentFlags({ tone = "light" }: { tone?: "light" | "dark" }) {
  const chip =
    tone === "light"
      ? "bg-white/10 text-white border-white/15"
      : "bg-subtle text-ink border-line"

  return (
    <div className="flex flex-col gap-2">
      <span className={`text-label-xs uppercase tracking-wider ${tone === "light" ? "text-white/60" : "text-ink-muted"}`}>
        Formas de pagamento
      </span>
      <ul className="flex flex-wrap gap-1.5">
        {FLAGS.map((name) => (
          <li
            key={name}
            className={`inline-flex h-7 items-center rounded-ava border px-2 text-label-xs font-bold ${chip}`}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
