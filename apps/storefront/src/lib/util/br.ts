/** Utilitários Brasil: máscaras, validação de CPF e consulta de CEP (ViaCEP). */

export const onlyDigits = (v: string) => (v || "").replace(/\D/g, "")

export const maskCPF = (v: string) =>
  onlyDigits(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")

export const isValidCPF = (v: string) => {
  const c = onlyDigits(v)
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false
  const calc = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += Number(c[i]) * (len + 1 - i)
    const r = (sum * 10) % 11
    return r === 10 ? 0 : r
  }
  return calc(9) === Number(c[9]) && calc(10) === Number(c[10])
}

export const maskCEP = (v: string) => onlyDigits(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2")

export const maskPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
}

export type ViaCep = { logradouro: string; bairro: string; localidade: string; uf: string; complemento?: string }

/** Consulta o ViaCEP no navegador. Retorna null se o CEP não existir ou houver erro. */
export const fetchCep = async (cep: string): Promise<ViaCep | null> => {
  const d = onlyDigits(cep)
  if (d.length !== 8) return null
  try {
    const res = await fetch(`https://viacep.com.br/ws/${d}/json/`)
    if (!res.ok) return null
    const data = await res.json()
    return data?.erro ? null : data
  } catch {
    return null
  }
}

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB",
  "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]

/** Métodos de pagamento exibidos e como mapeá-los para os providers disponíveis no Medusa. */
export type PayMethod = "pix" | "card" | "boleto"
export const PAY_LABEL: Record<PayMethod, string> = { pix: "PIX", card: "Cartão de crédito", boleto: "Boleto bancário" }

/**
 * Escolhe o provider do Medusa para um método. Se houver um provider dedicado
 * (id contendo "pix", "card"/"credit", "boleto"), usa-o; senão cai no manual
 * (pp_system_default) — pagamento a confirmar pela loja.
 */
export const providerFor = (method: PayMethod, providerIds: string[]) => {
  const find = (re: RegExp) => providerIds.find((id) => re.test(id))
  const dedicated =
    method === "pix" ? find(/pix/i) : method === "card" ? find(/card|credit|cartao/i) : find(/boleto|ticket/i)
  return dedicated || providerIds.find((id) => id === "pp_system_default") || providerIds[0]
}
