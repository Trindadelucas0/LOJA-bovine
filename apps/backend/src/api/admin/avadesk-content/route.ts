import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../modules/store-content"
import type StoreContentModuleService from "../../../modules/store-content/service"
import { pick, SETTING_FIELDS } from "../../../modules/store-content/fields"

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
  const settings = await service.updateContentSettings({ id: current.id, ...data } as any)
  res.json({ settings })
}
