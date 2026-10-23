import { AvaSettings, storeName } from "@lib/data/avadesk-content"
import Icon from "../icon"
import SmartLink from "../smart-link"
import Logo from "../header/logo"

export default function AvaFooter({ settings }: { settings: AvaSettings }) {
  const name = storeName(settings)
  const columns = (settings.footer_columns || []).filter((c) => c.title || c.links?.length)
  const year = new Date().getFullYear()
  const contacts = [
    settings.phone && { icon: "call", label: settings.phone, href: `tel:${settings.phone.replace(/\D/g, "")}` },
    settings.whatsapp && { icon: "chat", label: "WhatsApp", href: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}` },
    settings.email && { icon: "mail", label: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: "location_on", label: settings.address, href: "" },
  ].filter(Boolean) as { icon: string; label: string; href: string }[]

  return (
    <footer className="w-full bg-navy text-white pb-nav">
      <div className="max-w-page mx-auto px-margin-m small:px-margin py-10">
        <div className="grid grid-cols-1 tablet:grid-cols-2 small:grid-cols-5 gap-gutter pb-10 border-b border-white/15">
          <div className="small:col-span-2 flex flex-col gap-3 small:pr-6">
            <Logo name={name} logoUrl={settings.logo_url} compact />
            {settings.footer_text && (
              <p className="text-body-md text-white/75 leading-relaxed">{settings.footer_text}</p>
            )}
            {contacts.length > 0 && (
              <ul className="flex flex-col gap-1.5 pt-1">
                {contacts.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-body-md text-white/80">
                    <Icon name={c.icon} className="text-[18px] text-teal" />
                    {c.href ? (
                      <a href={c.href} className="hover:text-white" target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                        {c.label}
                      </a>
                    ) : (
                      <span>{c.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-2">
              {col.title && (
                <span className="text-label-md text-white uppercase tracking-wider mb-1">{col.title}</span>
              )}
              {(col.links || []).map((l, j) => (
                <SmartLink key={j} href={l.url} className="text-body-md text-white/75 hover:text-white transition-colors text-left py-1">
                  {l.label}
                </SmartLink>
              ))}
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col small:flex-row items-center justify-between gap-2 text-body-sm text-white/60">
          <span>{settings.copyright_text || `© ${year} ${name}. Todos os direitos reservados.`}</span>
          {settings.pix_discount_text && (
            <span className="flex items-center gap-1 text-teal-light font-semibold">
              <Icon name="pix" className="text-[18px]" />
              {settings.pix_discount_text}
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
