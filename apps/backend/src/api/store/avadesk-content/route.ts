import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../modules/store-content"
import type StoreContentModuleService from "../../../modules/store-content/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(STORE_CONTENT_MODULE)
  const settings = await service.getSettings()
  const banners = await service.listBanners(
    { is_active: true },
    { order: { rank: "ASC", created_at: "DESC" } }
  )
  res.json({ settings, banners })
}
