import { MedusaService } from "@medusajs/framework/utils"
import ContentSetting from "./models/setting"
import Banner from "./models/banner"

class StoreContentModuleService extends MedusaService({
  ContentSetting,
  Banner,
}) {
  /** Retorna o registro único de configurações, criando-o se não existir. */
  async getSettings() {
    const [existing] = await this.listContentSettings({}, { take: 1 })
    if (existing) {
      return existing
    }
    return await this.createContentSettings({ store_name: "AVADESK" })
  }
}

export default StoreContentModuleService
