import { AvaSettings } from "@lib/data/avadesk-content"
import { whatsappHref } from "@lib/util/whatsapp"
import Icon from "@modules/avadesk/components/icon"

export default function ServiceShortcuts({ settings }: { settings: AvaSettings }) {
  const services = [
    {
      title: "Atendimento veterinário",
      text: "Agendamento urgente",
      icon: "pets",
      href: whatsappHref(settings.whatsapp, "Olá! Preciso de um atendimento veterinário urgente."),
    },
    {
      title: "Atendimento agrícola",
      text: "Agendamento",
      icon: "agriculture",
      href: whatsappHref(settings.whatsapp, "Olá! Gostaria de agendar um atendimento agrícola."),
    },
    {
      title: "Soluções em energia",
      text: "Falar sobre energia",
      icon: "solar_power",
      href: whatsappHref(settings.mobile_whatsapp, "Olá! Gostaria de saber mais sobre soluções em energia."),
    },
  ].filter((service) => service.href)

  if (!services.length) return null

  return (
    <section aria-labelledby="service-shortcuts-title">
      <div className="mb-3">
        <h2 id="service-shortcuts-title" className="font-display text-h-sm text-ink small:text-h-md">
          Precisa de orientação?
        </h2>
      </div>
      <div className={`grid grid-cols-1 gap-3 ${services.length > 1 ? "small:grid-cols-2" : ""} ${services.length > 2 ? "medium:grid-cols-3" : ""}`}>
        {services.map((service) => (
          <a
            key={service.title}
            href={service.href!}
            target="_blank"
            rel="noreferrer"
            className="group flex min-h-[88px] items-center gap-3 card-interactive p-4 hover:border-brand/40"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-ava-md bg-brand-light text-brand-dark">
              <Icon name={service.icon} className="text-[26px]" filled />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block font-display text-label-md text-ink">{service.title}</strong>
              <span className="mt-0.5 block text-body-sm text-ink-soft">{service.text}</span>
            </span>
            <Icon name="arrow_forward" className="text-[22px] text-brand" />
          </a>
        ))}
      </div>
    </section>
  )
}
