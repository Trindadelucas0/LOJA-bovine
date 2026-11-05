/**
 * Regras de Pix e parcelamento exibidas na vitrine.
 *
 * Desligadas por padrão. Só aparecem quando existe um preço real (maior que zero)
 * e um valor configurado. O admin (Conteúdo da loja: pix_discount_percent e
 * max_installments) substitui estes padrões quando o campo vem preenchido.
 *
 * Para ligar sem usar o admin, troque null pelo número desejado.
 * Exemplo: pixDiscountPercent: 5 e interestFreeInstallments: 10.
 * Não invente desconto: deixe null até a regra comercial existir.
 */
export const STORE_PRICING = {
  pixDiscountPercent: null as number | null,
  interestFreeInstallments: null as number | null,
}

type PricingSettings = {
  pix_discount_percent?: number | null
  max_installments?: number | null
} | null | undefined

const percent = (value: number | null | undefined) =>
  typeof value === "number" && value > 0 && value < 100 ? value : null

const installments = (value: number | null | undefined) =>
  typeof value === "number" && value > 1 ? Math.min(24, Math.floor(value)) : null

export const resolveStorePricing = (settings?: PricingSettings) => {
  const pixSource = settings?.pix_discount_percent
  const installmentSource = settings?.max_installments
  return {
    pixPercent: percent(pixSource == null ? STORE_PRICING.pixDiscountPercent : pixSource),
    maxInstallments: installments(
      installmentSource == null ? STORE_PRICING.interestFreeInstallments : installmentSource
    ),
  }
}

export const hasRealPrice = (amount: number | null | undefined) =>
  typeof amount === "number" && Number.isFinite(amount) && amount > 0
