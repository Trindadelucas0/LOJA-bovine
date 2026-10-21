export const SETTING_FIELDS = [
  "store_name", "logo_url", "tagline", "phone", "whatsapp", "mobile_whatsapp", "email", "address",
  "footer_text", "copyright_text", "pix_discount_percent", "pix_discount_text",
  "max_installments", "chat_title", "chat_text", "chat_button_label",
  "chatwoot_base_url", "chatwoot_website_token", "header_links", "footer_columns",
  "hero_badges", "benefits", "chat_quick_replies", "home_category_ids",
  "featured_collection_ids", "featured_title", "new_arrivals_title", "categories_title",
] as const

export const BANNER_FIELDS = [
  "position", "eyebrow", "title", "subtitle", "image_url", "mobile_image_url",
  "cta_label", "cta_url", "cta2_label", "cta2_url", "rank", "is_active",
] as const

export function pick(body: unknown, fields: readonly string[]) {
  const src = (body ?? {}) as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const f of fields) {
    if (f in src) {
      out[f] = src[f] === "" ? null : src[f]
    }
  }
  return out
}
