import { model } from "@medusajs/framework/utils"

/**
 * Configurações globais da loja (registro único).
 * Listas (links do rodapé, selos, benefícios etc.) ficam em campos JSON.
 */
const ContentSetting = model.define("avadesk_content_setting", {
  id: model.id().primaryKey(),
  store_name: model.text().nullable(),
  logo_url: model.text().nullable(),
  tagline: model.text().nullable(),
  phone: model.text().nullable(),
  whatsapp: model.text().nullable(),
  email: model.text().nullable(),
  address: model.text().nullable(),
  footer_text: model.text().nullable(),
  copyright_text: model.text().nullable(),
  pix_discount_percent: model.number().nullable(),
  pix_discount_text: model.text().nullable(),
  max_installments: model.number().nullable(),
  chat_title: model.text().nullable(),
  chat_text: model.text().nullable(),
  chat_button_label: model.text().nullable(),
  chatwoot_base_url: model.text().nullable(),
  chatwoot_website_token: model.text().nullable(),
  // JSON: [{ label, url }]
  header_links: model.json().nullable(),
  // JSON: [{ title, links: [{ label, url }] }]
  footer_columns: model.json().nullable(),
  // JSON: [{ icon, title, text }]
  hero_badges: model.json().nullable(),
  // JSON: [{ icon, title, text }]
  benefits: model.json().nullable(),
  // JSON: string[]
  chat_quick_replies: model.json().nullable(),
  // JSON: string[] (ids de categorias exibidas na home; vazio = categorias raiz)
  home_category_ids: model.json().nullable(),
  // JSON: string[] (ids de coleções exibidas como abas em "Produtos em Destaque"; vazio = todas)
  featured_collection_ids: model.json().nullable(),
  featured_title: model.text().nullable(),
  new_arrivals_title: model.text().nullable(),
  categories_title: model.text().nullable(),
})

export default ContentSetting
