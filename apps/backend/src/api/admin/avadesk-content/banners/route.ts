import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../../modules/store-content"
import type StoreContentModuleService from "../../../../modules/store-content/service"
import { BANNER_FIELDS, pick } from "../../../../modules/store-content/fields"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(STORE_CONTENT_MODULE)
  const banners = await service.listBanners({}, { order: { rank: "ASC", created_at: "DESC" } })
  res.json({ banners })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(STORE_CONTENT_MODULE)
  const data = pick(req.body, BANNER_FIELDS)
  if (!data.title) {
    res.status(400).json({ message: "Título é obrigatório" })
    return
  }
  const banner = await service.createBanners(data as any)
  res.json({ banner })
}
