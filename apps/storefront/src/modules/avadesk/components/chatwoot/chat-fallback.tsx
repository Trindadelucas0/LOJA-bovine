"use client"

import { whatsappHref } from "@lib/util/whatsapp"
import Icon from "../icon"

/** Mensagem exibida quando o Chatwoot não está configurado. */
export default function ChatFallback({
  whatsapp,
  email,
  onClose,
}: {
  whatsapp?: string | null
  email?: string | null
  onClose?: () => void
}) {
  const whatsappLink = whatsappHref(whatsapp, "Olá! Preciso de atendimento.")

  return (
    <div className="flex items-start gap-2 rounded-ava-md border border-line bg-subtle p-3 text-body-sm text-ink-soft" role="status">
      <Icon name="info" className="text-[18px] text-chat mt-0.5" />
      <div className="flex-1">
        <p>O atendimento por chat não está disponível no momento.</p>
        {(whatsappLink || email) && (
          <p className="mt-1">
            Fale conosco
            {whatsappLink && (
              <>
                {" "}pelo{" "}
                <a className="text-teal font-semibold underline" href={whatsappLink} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </>
            )}
            {whatsappLink && email && " ou"}
            {email && (
              <>
                {" "}pelo e-mail{" "}
                <a className="text-teal font-semibold underline" href={`mailto:${email}`}>{email}</a>
              </>
            )}
            .
          </p>
        )}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Fechar" className="text-ink-muted hover:text-ink">
          <Icon name="close" className="text-[18px]" />
        </button>
      )}
    </div>
  )
}
