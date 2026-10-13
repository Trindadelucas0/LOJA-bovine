import type { AvaSettings } from "@lib/data/avadesk-content"

/** Variáveis de ambiente têm prioridade; senão usa o que foi configurado no admin. */
export const chatConfig = (settings: AvaSettings) => {
  const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || settings.chatwoot_base_url || ""
  const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || settings.chatwoot_website_token || ""
  return { baseUrl, websiteToken, enabled: Boolean(baseUrl && websiteToken) }
}
