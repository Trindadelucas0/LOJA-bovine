import { AvaSettings } from "@lib/data/avadesk-content"
import Icon from "@modules/avadesk/components/icon"
import ChatButton from "@modules/avadesk/components/chatwoot/chat-button"

export default function ChatBlock({ settings }: { settings: AvaSettings }) {
  const title = settings.chat_title || "Fale com nossa equipe"
  const text = settings.chat_text
  const replies = settings.chat_quick_replies || []
  const button = settings.chat_button_label || "Falar com Consultor"
  return (
    <section className="relative overflow-hidden card-surface small:border-0 small:rounded-ava-xl small:bg-gradient-to-r small:from-navy-deep small:via-navy small:to-navy-soft small:text-white small:shadow-overlay">
      <div className="hidden small:block absolute -left-20 -bottom-20 w-80 h-80 bg-chat/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 small:grid-cols-12 gap-gutter items-center p-4 small:p-10">
        <div className="small:col-span-7 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-navy small:bg-chat text-white flex items-center justify-center shrink-0">
              <Icon name="support_agent" className="text-[26px]" />
            </div>
            <span className="hidden small:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chat/20 text-label-xs uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-stock-in animate-pulse" />
              Atendimento
            </span>
          </div>
          <h2 className="font-display text-h-sm small:text-h-xl font-extrabold text-ink small:text-white">{title}</h2>
          {text && <p className="text-body-sm small:text-body-lg text-ink-soft small:text-white/75 max-w-xl">{text}</p>}
          <ChatButton className="hidden small:inline-flex w-fit items-center gap-2 px-6 py-3.5 rounded-ava-md bg-chat hover:bg-chat/90 text-white text-label-md shadow-lg">
            <Icon name="forum" className="text-[20px]" />
            {button}
          </ChatButton>
        </div>
        {replies.length > 0 && (
          <div className="small:col-span-5 flex flex-col gap-2 small:bg-card small:rounded-ava-lg small:p-5 small:shadow-overlay">
            <span className="hidden small:block text-label-xs uppercase text-ink-muted mb-1">Respostas rápidas</span>
            {replies.map((r, i) => (
              <ChatButton
                key={i}
                attrs={{ quick_reply: r }}
                className="text-left px-4 py-2.5 rounded-ava-lg bg-subtle hover:bg-chat/10 text-body-md text-ink border border-line"
              >
                {r}
              </ChatButton>
            ))}
          </div>
        )}
        <ChatButton className="small:hidden flex w-full items-center justify-center gap-2 px-6 py-3 rounded-ava-md bg-navy text-white text-label-md">
          <Icon name="forum" className="text-[20px]" />
          {button}
        </ChatButton>
      </div>
    </section>
  )
}
