import { AvaSettings } from "@lib/data/avadesk-content"
import CodedBanner from "./coded-banner"

/**
 * A home não usa a arte cadastrada em Conteúdo da loja → Banners.
 * O quadro é fixo e baixo para a grade de departamentos entrar na primeira dobra.
 */
export default function Hero({ settings }: { settings: AvaSettings }) {
  return (
    <section aria-label="Destaques da loja">
      <div className="relative h-[188px] overflow-hidden bg-navy card-surface shadow-raised small:h-[200px] small:rounded-ava-xl">
        <CodedBanner settings={settings} />
      </div>
    </section>
  )
}
