import { model } from "@medusajs/framework/utils"

/**
 * Banners da loja. position: "hero" (topo da home) ou "promo" (faixa promocional).
 */
const Banner = model.define("avadesk_banner", {
  id: model.id().primaryKey(),
  position: model.text().default("hero"),
  eyebrow: model.text().nullable(),
  title: model.text(),
  subtitle: model.text().nullable(),
  image_url: model.text().nullable(),
  mobile_image_url: model.text().nullable(),
  cta_label: model.text().nullable(),
  cta_url: model.text().nullable(),
  cta2_label: model.text().nullable(),
  cta2_url: model.text().nullable(),
  rank: model.number().default(0),
  is_active: model.boolean().default(true),
})

export default Banner
