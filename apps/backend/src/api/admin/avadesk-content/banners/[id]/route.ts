import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_CONTENT_MODULE } from "../../../../../modules/store-content"
import type StoreContentModuleService from "../../../../../modules/store-content/service"
import { BANNER_FIELDS, pick } from "../../../../../modules/store-content/fields"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(STORE_CONTENT_MODULE)
  const data = pick(req.body, BANNER_FIELDS)
  const banner = await service.updateBanners({ id: req.params.id, ...data } as any)
  res.json({ banner })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const service: StoreContentModuleService = req.scope.resolve(STORE_CONTENT_MODULE)
  await service.deleteBanners(req.params.id)
  res.json({ id: req.params.id, deleted: true })
}
