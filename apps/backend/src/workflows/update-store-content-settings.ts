import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { STORE_CONTENT_MODULE } from "../modules/store-content"
import type StoreContentModuleService from "../modules/store-content/service"

type UpdateSettingsInput = {
  id: string
  data: Record<string, unknown>
}

const updateSettingsStep = createStep(
  "update-settings",
  async ({ id, data }: UpdateSettingsInput, { container }) => {
    const service: StoreContentModuleService = container.resolve(STORE_CONTENT_MODULE)
    const settings = await service.updateContentSettings({ id, ...data } as any)
    return new StepResponse(settings)
  }
)

const updateStoreContentSettingsWorkflow = createWorkflow(
  "update-store-content-settings",
  (input: UpdateSettingsInput) => {
    const settings = updateSettingsStep(input)
    return new WorkflowResponse(settings)
  }
)

export default updateStoreContentSettingsWorkflow
