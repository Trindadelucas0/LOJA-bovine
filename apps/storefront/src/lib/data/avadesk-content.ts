import { sdk } from "@lib/config"

export type AvaLink = { label: string; url: string }
export type AvaItem = { icon?: string; title?: string; text?: string }

export type AvaSettings = {
  id?: string
  store_name?: string | null
  logo_url?: string | null
  tagline?: string | null
  phone?: string | null
  whatsapp?: string | null
  mobile_whatsapp?: string | null
  email?: string | null
  address?: string | null
  footer_text?: string | null
  copyright_text?: string | null
  pix_discount_percent?: number | null
  pix_discount_text?: string | null
  max_installments?: number | null
  chat_title?: string | null
  chat_text?: string | null
  chat_button_label?: string | null
  chatwoot_base_url?: string | null
  chatwoot_website_token?: string | null
  header_links?: AvaLink[] | null
  footer_columns?: { title: string; links: AvaLink[] }[] | null
  hero_badges?: AvaItem[] | null
  benefits?: AvaItem[] | null
  chat_quick_replies?: string[] | null
  home_category_ids?: string[] | null
  featured_collection_ids?: string[] | null
  featured_title?: string | null
  new_arrivals_title?: string | null
  categories_title?: string | null
}

export type AvaBanner = {
  id: string
  position: "hero" | "promo" | string
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  image_url?: string | null
  mobile_image_url?: string | null
  cta_label?: string | null
  cta_url?: string | null
  cta2_label?: string | null
  cta2_url?: string | null
  rank: number
  is_active: boolean
}

export type AvaContent = { settings: AvaSettings; banners: AvaBanner[] }

/**
 * Conteúdo editável da loja (módulo store-content do backend).
 * Em caso de erro (backend fora do ar / migração pendente) retorna vazio,
 * e os componentes usam fallbacks neutros.
 */
export const getAvaContent = async (): Promise<AvaContent> => {
  try {
    return await sdk.client.fetch<AvaContent>("/store/avadesk-content", {
      next: { revalidate: 60, tags: ["avadesk-content"] },
      cache: "force-cache",
    })
  } catch {
    return { settings: {}, banners: [] }
  }
}

export const storeName = (s: AvaSettings) => s.store_name || "Loja"
