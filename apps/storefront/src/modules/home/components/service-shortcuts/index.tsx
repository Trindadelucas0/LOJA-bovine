import { AvaSettings } from "@lib/data/avadesk-content"
import Icon from "@modules/avadesk/components/icon"

const whatsappUrl = (phone: string | null | undefined, message: string) => {
  const digits = phone?.replace(/\D/g, "")
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null
}

export default function ServiceShortcuts({ settings }: { settings: AvaSettings }) {
  const services = [
    {
      title: "Atendimento Veterinário",
      text: "Agendamento urgente",
      icon: "pets",
      href: whatsappUrl(settings.whatsapp, "Olá! Preciso de um atendimento veterinário urgente."),
    },
    {
      title: "Atendimento Agrícola",
      text: "Agendamento",
      icon: "agriculture",
      href: whatsappUrl(settings.whatsapp, "Olá! Gostaria de agendar um atendimento agrícola."),
    },
    {
      title: "Soluções em Energia",
      text: "Falar com a Mobile",
      icon: "solar_power",
      href: whatsappUrl(settings.mobile_whatsapp, "Olá! Gostaria de saber mais sobre soluções em energia."),
    },
  ]

  return (
    <section aria-labelledby="service-shortcuts-title">
      <div className="mb-4 small:mb-6">
        <span className="hidden small:block text-label-xs uppercase tracking-widest text-ink-soft">
          Atendimento especializado
        </span>
        <h2 id="service-shortcuts-title" className="font-display text-h-sm small:text-h-lg text-ink">
          Como podemos ajudar?
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 small:grid-cols-3 small:gap-gutter">
        {services.map((service) => {
          const content = (
            <>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-ava-md bg-brand-light text-brand-dark">
                <Icon name={service.icon} className="text-[26px]" filled />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block font-display text-label-md small:text-h-sm text-ink">{service.title}</strong>
                <span className="mt-0.5 block text-body-sm text-ink-soft">
                  {service.href ? service.text : "WhatsApp não configurado"}
                </span>
              </span>
              <Icon name={service.href ? "arrow_forward" : "block"} className="text-[22px] text-brand" />
            </>
          )

          return service.href ? (
            <a
              key={service.title}
              href={service.href}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[88px] items-center gap-3 rounded-ava-lg border border-line bg-white p-4 shadow-sm transition-colors hover:border-brand/40 hover:bg-brand-light/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {content}
            </a>
          ) : (
            <div
              key={service.title}
              aria-disabled="true"
              className="flex min-h-[88px] cursor-not-allowed items-center gap-3 rounded-ava-lg border border-line bg-subtle p-4 opacity-70"
            >
              {content}
            </div>
          )
        })}
      </div>
    </section>
  )
}
