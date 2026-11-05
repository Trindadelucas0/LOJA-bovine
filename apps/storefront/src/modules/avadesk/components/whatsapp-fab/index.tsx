import { whatsappHref } from "@lib/util/whatsapp"
import Icon from "../icon"

/** Botão flutuante. Some quando o WhatsApp geral não está configurado. */
export default function WhatsappFab({ phone }: { phone?: string | null }) {
  const href = whatsappHref(phone, "Olá! Vim pelo site da BOVINE e quero atendimento.")
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-[calc(68px+12px+env(safe-area-inset-bottom))] right-3 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white shadow-raised small:bottom-6 small:right-6"
    >
      <Icon name="chat" className="text-[28px]" filled />
    </a>
  )
}
