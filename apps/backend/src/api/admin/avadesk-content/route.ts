import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../modules/store-content"
import type StoreContentModuleService from "../../../modules/store-content/service"
import { pick, SETTING_FIELDS } from "../../../modules/store-content/fields"
import updateStoreContentSettingsWorkflow from "../../../workflows/update-store-content-settings"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(STORE_CONTENT_MODULE)
  const settings = await service.getSettings()
  const banners = await service.listBanners({}, { order: { rank: "ASC", created_at: "DESC" } })
  res.json({ settings, banners })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(STORE_CONTENT_MODULE)
  const current = await service.getSettings()
  const data = pick(req.body, SETTING_FIELDS)
  if (data.mobile_whatsapp && !/^\d{10,15}$/.test(String(data.mobile_whatsapp))) {
    res.status(400).json({ message: "WhatsApp da Mobile deve conter somente números com DDI" })
    return
  }
  const { result: settings } = await updateStoreContentSettingsWorkflow(req.scope).run({
    input: { id: current.id, data },
  })
  res.json({ settings })
}
