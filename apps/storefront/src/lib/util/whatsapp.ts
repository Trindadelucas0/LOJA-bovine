/** Link do WhatsApp somente com número utilizável (10 a 15 dígitos). */
export const whatsappHref = (phone?: string | null, message?: string) => {
  const digits = (phone || "").replace(/\D/g, "")
  if (digits.length < 10 || digits.length > 15) return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${digits}${text}`
}
