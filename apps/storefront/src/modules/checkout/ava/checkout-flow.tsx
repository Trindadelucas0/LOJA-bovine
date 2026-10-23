"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { initiatePaymentSession, placeOrder, setShippingMethod, updateCart } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import {
  fetchCep, isValidCPF, maskCEP, maskCPF, maskPhone, onlyDigits, PAY_LABEL, PayMethod, providerFor, UFS,
} from "@lib/util/br"
import Icon from "@modules/avadesk/components/icon"
import Stepper, { StepId } from "./stepper"

type Props = {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  providerIds: string[]
  pixPercent?: number | null
  maxInstallments?: number | null
}

const fmt = (amount: number, currency: string) => convertToLocale({ amount, currency_code: currency })

const Card = ({ n, title, icon, done, children, onEdit, summary, sub, tag }: {
  n: number; title: string; icon: string; done?: boolean; children?: React.ReactNode; onEdit?: () => void; summary?: React.ReactNode; sub?: string; tag?: React.ReactNode
}) => (
  <section className="card-surface small:rounded-ava-xl p-4 small:p-6">
    <div className="flex items-center justify-between gap-3 mb-1">
      <h2 className="flex items-center gap-3 font-display text-h-sm text-ink">
        <span className={`w-11 h-11 shrink-0 rounded-ava-md flex items-center justify-center ${done ? "bg-stock-in/10 text-stock-in" : "bg-brand-light text-brand-dark"}`}>
          <Icon name={done ? "check_circle" : icon} className="text-[24px]" />
        </span>
        <span className="flex flex-col">
          <span>{n}. {title}</span>
          {sub && <span className="text-body-sm font-sans font-normal text-ink-soft">{sub}</span>}
        </span>
      </h2>
      {!onEdit && tag && <span className="hidden xsmall:inline-flex">{tag}</span>}
      {onEdit && (
        <button type="button" onClick={onEdit} className="shrink-0 h-11 px-4 rounded-ava-md border border-line-strong text-label-md text-navy hover:border-navy hover:bg-subtle transition-colors">Alterar</button>
      )}
    </div>
    {summary && <div className="mt-3 text-body-md text-ink-soft">{summary}</div>}
    {children && <div className="mt-4">{children}</div>}
  </section>
)

const Field = ({ label, error, children, className = "" }: { label: string; error?: string | null; children: React.ReactNode; className?: string }) => (
  <label className={`flex flex-col gap-1.5 ${className}`}>
    <span className="text-label-md text-ink">{label}</span>
    {children}
    {error && <span className="text-body-sm text-danger font-semibold">{error}</span>}
  </label>
)
const inputCls = "h-13 px-4 rounded-ava-md border border-line-strong bg-card text-body-lg text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand transition-colors disabled:bg-subtle disabled:text-ink-soft"

export default function CheckoutFlow({ cart, customer, shippingOptions, providerIds, pixPercent, maxInstallments }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const currency = cart.currency_code || cart.region?.currency_code || "brl"

  const sa = cart.shipping_address
  const meta = ((sa?.metadata || {}) as Record<string, string>)
  const cartMeta = ((cart.metadata || {}) as Record<string, string>)

  const hasAddress = !!(sa?.address_1 && sa?.postal_code && meta.cpf && cart.email)
  const hasShipping = (cart.shipping_methods?.length ?? 0) > 0
  const session = cart.payment_collection?.payment_sessions?.find((s) => s.status === "pending")
  const hasPayment = !!session && !!cartMeta.payment_method

  const firstIncomplete: StepId = !hasAddress ? "address" : !hasShipping ? "delivery" : !hasPayment ? "payment" : "review"
  const requested = (searchParams.get("step") as StepId) || firstIncomplete
  const order: StepId[] = ["address", "delivery", "payment", "review"]
  const step: StepId = order.indexOf(requested) > order.indexOf(firstIncomplete) ? firstIncomplete : requested
  const go = (s: StepId) => router.push(`${pathname}?step=${s}`, { scroll: false })

  // ---------- Endereço ----------
  const [f, setF] = useState(() => ({
    email: cart.email || customer?.email || "",
    first_name: sa?.first_name || customer?.first_name || "",
    last_name: sa?.last_name || customer?.last_name || "",
    cpf: meta.cpf || cartMeta.cpf || "",
    phone: sa?.phone || customer?.phone || "",
    postal_code: sa?.postal_code || "",
    street: meta.rua || (sa?.address_1 || "").split(",")[0] || "",
    number: meta.numero || "",
    complement: sa?.address_2 || "",
    district: meta.bairro || "",
    city: sa?.city || "",
    province: sa?.province || "",
  }))
  const saved = customer?.addresses || []
  const [mode, setMode] = useState<"saved" | "form">(saved.length && !sa?.address_1 ? "saved" : "form")
  const [savedId, setSavedId] = useState<string | undefined>((saved.find((a) => a.is_default_shipping) || saved[0])?.id)
  const pickSaved = (a: HttpTypes.StoreCustomerAddress) => {
    setSavedId(a.id)
    const [street, num] = (a.address_1 || "").split(",").map((s) => s.trim())
    const am = (a.metadata || {}) as Record<string, string>
    setF((p) => ({
      ...p,
      first_name: a.first_name || p.first_name,
      last_name: a.last_name || p.last_name,
      phone: a.phone ? maskPhone(a.phone) : p.phone,
      postal_code: a.postal_code ? maskCEP(a.postal_code) : p.postal_code,
      street: am.rua || street || p.street,
      number: am.numero || num || "S/N",
      complement: a.address_2 || "",
      district: am.bairro || a.address_2 || "Centro",
      city: a.city || p.city,
      province: a.province || p.province,
      cpf: am.cpf || p.cpf,
    }))
  }
  useEffect(() => {
    const a = saved.find((x) => x.id === savedId)
    if (mode === "saved" && a) pickSaved(a)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [cepState, setCepState] = useState<"idle" | "loading" | "ok" | "error">(sa?.postal_code ? "ok" : "idle")
  const [touched, setTouched] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    const d = onlyDigits(f.postal_code)
    if (d.length !== 8) return
    let cancel = false
    setCepState("loading")
    fetchCep(d).then((r) => {
      if (cancel) return
      if (!r) return setCepState("error")
      setCepState("ok")
      setF((p) => ({
        ...p,
        street: r.logradouro || p.street,
        district: r.bairro || p.district,
        city: r.localidade || p.city,
        province: r.uf || p.province,
      }))
    })
    return () => {
      cancel = true
    }
  }, [f.postal_code])

  const errors = {
    email: /^\S+@\S+\.\S+$/.test(f.email) ? null : "Informe um e-mail válido",
    first_name: f.first_name.trim() ? null : "Obrigatório",
    last_name: f.last_name.trim() ? null : "Obrigatório",
    cpf: isValidCPF(f.cpf) ? null : "CPF inválido",
    phone: onlyDigits(f.phone).length >= 10 ? null : "Telefone com DDD",
    postal_code: onlyDigits(f.postal_code).length === 8 && cepState !== "error" ? null : "CEP inválido",
    street: f.street.trim() ? null : "Obrigatório",
    number: f.number.trim() ? null : "Obrigatório",
    district: f.district.trim() ? null : "Obrigatório",
    city: f.city.trim() ? null : "Obrigatório",
    province: UFS.includes(f.province) ? null : "UF",
  }
  const addrValid = Object.values(errors).every((e) => !e)
  const err = (k: keyof typeof errors) => (touched ? errors[k] : null)

  const saveAddress = () => {
    setTouched(true)
    if (!addrValid) return
    setError(null)
    start(async () => {
      try {
        const address = {
          first_name: f.first_name.trim(),
          last_name: f.last_name.trim(),
          address_1: `${f.street.trim()}, ${f.number.trim()}`,
          address_2: f.complement.trim(),
          city: f.city.trim(),
          province: f.province,
          postal_code: maskCEP(f.postal_code),
          country_code: countryCode,
          phone: onlyDigits(f.phone),
          metadata: { cpf: maskCPF(f.cpf), rua: f.street.trim(), numero: f.number.trim(), bairro: f.district.trim() },
        }
        await updateCart({
          email: f.email.trim(),
          shipping_address: address,
          billing_address: address,
          metadata: { ...cartMeta, cpf: maskCPF(f.cpf) },
        })
        router.push(`${pathname}?step=delivery`, { scroll: false })
        router.refresh()
      } catch (e: any) {
        setError(e?.message || "Não foi possível salvar o endereço.")
      }
    })
  }

  // ---------- Entrega ----------
  const currentOption = cart.shipping_methods?.[0]?.shipping_option_id
  const [optionId, setOptionId] = useState<string | undefined>(currentOption || shippingOptions[0]?.id)
  const saveShipping = () => {
    if (!optionId) return
    setError(null)
    start(async () => {
      try {
        await setShippingMethod({ cartId: cart.id, shippingMethodId: optionId })
        router.push(`${pathname}?step=payment`, { scroll: false })
        router.refresh()
      } catch (e: any) {
        setError(e?.message || "Não foi possível definir a entrega.")
      }
    })
  }

  // ---------- Pagamento ----------
  const [method, setMethod] = useState<PayMethod>((cartMeta.payment_method as PayMethod) || "pix")
  const [installments, setInstallments] = useState<number>(Number(cartMeta.installments) || 1)
  const total = cart.total ?? 0
  const pixTotal = pixPercent && pixPercent > 0 ? total * (1 - pixPercent / 100) : null
  const savePayment = () => {
    setError(null)
    const providerId = providerFor(method, providerIds)
    if (!providerId) return setError("Nenhum meio de pagamento ativo para esta região. Configure em Configurações → Regiões.")
    start(async () => {
      try {
        await updateCart({
          metadata: {
            ...cartMeta,
            payment_method: method,
            installments: method === "card" ? String(installments) : "",
            payment_provider: providerId,
          },
        })
        await initiatePaymentSession(cart, { provider_id: providerId })
        router.push(`${pathname}?step=review`, { scroll: false })
        router.refresh()
      } catch (e: any) {
        setError(e?.message || "Não foi possível iniciar o pagamento.")
      }
    })
  }

  // ---------- Revisão ----------
  const [accepted, setAccepted] = useState(true)
  const finish = () => {
    setError(null)
    start(async () => {
      try {
        await placeOrder()
      } catch (e: any) {
        // redirect() do Next lança um erro especial: deixe passar.
        if (e?.digest?.startsWith?.("NEXT_REDIRECT")) throw e
        setError(e?.message || "Não foi possível finalizar o pedido.")
      }
    })
  }

  const selectedOption = shippingOptions.find((o) => o.id === (currentOption || optionId))
  const maxInst = Math.max(1, maxInstallments || 1)

  const methodInfo: Record<PayMethod, { icon: string; title: string; text: string }> = useMemo(
    () => ({
      pix: {
        icon: "qr_code_2",
        title: pixPercent ? `Pague via PIX com ${pixPercent}% de desconto` : "Pague via PIX",
        text: "Após finalizar, enviaremos a chave PIX / QR Code para pagamento. O pedido é liberado assim que o pagamento for confirmado pela loja.",
      },
      card: {
        icon: "credit_card",
        title: maxInst > 1 ? `Cartão de crédito em até ${maxInst}x sem juros` : "Cartão de crédito",
        text: "O pagamento com cartão será confirmado pela nossa equipe (link de pagamento seguro enviado por e-mail ou chat).",
      },
      boleto: {
        icon: "receipt_long",
        title: "Boleto bancário",
        text: "O boleto será enviado por e-mail após a finalização. Compensação em até 2 dias úteis.",
      },
    }),
    [pixPercent, maxInst]
  )

  return (
    <div className="flex flex-col gap-4 small:gap-6" id="checkout-flow">
      <Stepper current={step} />

      {error && (
        <div className="flex items-start gap-2 rounded-ava-md bg-stock-out/10 text-danger p-3 text-body-md" role="alert" data-testid="checkout-error">
          <Icon name="error" className="text-[20px]" /> {error}
        </div>
      )}

      {/* 1. Endereço */}
      <Card
        n={1}
        title="Endereço de entrega"
        sub="Selecione onde seus produtos serão entregues"
        tag={<span className="text-label-xs bg-subtle text-ink-soft px-2 py-1 rounded-full">Passo obrigatório</span>}
        icon="location_on"
        done={hasAddress && step !== "address"}
        onEdit={step !== "address" && hasAddress ? () => go("address") : undefined}
        summary={
          step !== "address" && hasAddress ? (
            <div className="rounded-ava-md bg-subtle p-3">
              <p className="text-ink font-semibold">{sa?.first_name} {sa?.last_name}</p>
              <p>{sa?.address_1}{sa?.address_2 ? ` • ${sa.address_2}` : ""}</p>
              <p>{meta.bairro} • {sa?.city}/{sa?.province} • CEP {sa?.postal_code}</p>
              <p className="text-body-sm text-ink-muted">CPF {meta.cpf} • {cart.email}</p>
            </div>
          ) : null
        }
      >
        {step === "address" && saved.length > 0 && (
          <div className="flex flex-col gap-3 mb-4" data-testid="saved-addresses">
            <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
              {saved.map((a) => {
                const active = mode === "saved" && savedId === a.id
                return (
                  <button key={a.id} type="button" onClick={() => { setMode("saved"); pickSaved(a) }}
                    className={`text-left rounded-ava-lg border-2 p-4 min-h-16 transition-all ${active ? "border-brand bg-brand-light/30 shadow-raised" : "border-line hover:border-line-strong bg-card"}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="flex items-center gap-2">
                        {a.is_default_shipping && <span className="px-2 py-0.5 rounded bg-navy text-white text-[10px] font-bold uppercase">Padrão</span>}
                        <span className="font-display font-bold text-ink">{a.address_name || a.company || "Endereço"}</span>
                      </span>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? "bg-navy text-white" : "border-2 border-line-strong"}`}>
                        {active && <Icon name="check" className="text-[16px]" />}
                      </span>
                    </div>
                    <p className="text-body-sm text-ink font-semibold">{a.address_1}</p>
                    {a.address_2 && <p className="text-body-sm text-ink-soft">{a.address_2}</p>}
                    <p className="text-body-sm text-ink-soft">{a.city}, {a.province} — CEP {a.postal_code}</p>
                    <p className="text-body-sm text-ink-muted mt-1">Destinatário: {a.first_name} {a.last_name}</p>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-line text-label-xs">
                      <span className="inline-flex items-center gap-1 text-ink-soft"><Icon name="edit" className="text-[14px]" /> Editar</span>
                      <span className="inline-flex items-center gap-1 text-stock-in"><Icon name="verified" className="text-[14px]" /> CEP validado</span>
                    </div>
                  </button>
                )
              })}
            </div>
            <button type="button" onClick={() => setMode("form")}
              className={`h-14 rounded-ava-lg border-2 border-dashed text-label-md flex items-center justify-center gap-2 ${mode === "form" ? "border-navy text-navy bg-navy/5" : "border-line text-ink-soft hover:border-line-strong bg-subtle/60"}`}>
              <Icon name="add" className="text-[20px]" /> Adicionar novo endereço de entrega
            </button>
          </div>
        )}
        {step === "address" && mode === "saved" && saved.length > 0 && (
          <div className="grid grid-cols-6 gap-3" data-testid="address-saved-confirm">
            <Field label="E-mail" error={err("email")} className="col-span-6 small:col-span-3">
              <input className={inputCls} type="email" value={f.email} onChange={set("email")} name="email" />
            </Field>
            <Field label="CPF (para nota fiscal)" error={err("cpf")} className="col-span-6 small:col-span-3">
              <input className={inputCls} inputMode="numeric" value={f.cpf} onChange={(e) => setF((p) => ({ ...p, cpf: maskCPF(e.target.value) }))} placeholder="000.000.000-00" name="cpf" />
            </Field>
            {touched && !addrValid && <p className="col-span-6 text-body-sm text-danger">Complete os dados do endereço: clique em &quot;Adicionar novo endereço&quot; para revisar.</p>}
            <div className="col-span-6 flex justify-end pt-2">
              <button type="button" onClick={saveAddress} disabled={pending} className="h-13 px-6 rounded-ava-md bg-brand hover:bg-brand-dark text-white text-label-md shadow-brand-glow disabled:bg-line-strong disabled:shadow-none w-full small:w-auto" data-testid="submit-address-button">
                {pending ? "Salvando..." : "Entregar neste endereço"}
              </button>
            </div>
          </div>
        )}
        {step === "address" && (mode === "form" || saved.length === 0) && (
          <div className="grid grid-cols-6 gap-3" data-testid="address-form">
            <Field label="E-mail" error={err("email")} className="col-span-6 small:col-span-3">
              <input className={inputCls} type="email" autoComplete="email" value={f.email} onChange={set("email")} name="email" />
            </Field>
            <Field label="CPF" error={err("cpf")} className="col-span-6 small:col-span-3">
              <input className={inputCls} inputMode="numeric" value={f.cpf} onChange={(e) => setF((p) => ({ ...p, cpf: maskCPF(e.target.value) }))} placeholder="000.000.000-00" name="cpf" />
            </Field>
            <Field label="Nome" error={err("first_name")} className="col-span-3">
              <input className={inputCls} autoComplete="given-name" value={f.first_name} onChange={set("first_name")} name="first_name" />
            </Field>
            <Field label="Sobrenome" error={err("last_name")} className="col-span-3">
              <input className={inputCls} autoComplete="family-name" value={f.last_name} onChange={set("last_name")} name="last_name" />
            </Field>
            <Field label="Telefone / WhatsApp" error={err("phone")} className="col-span-6 small:col-span-3">
              <input className={inputCls} inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => setF((p) => ({ ...p, phone: maskPhone(e.target.value) }))} placeholder="(11) 99999-9999" name="phone" />
            </Field>
            <Field label="CEP" error={err("postal_code") || (cepState === "error" ? "CEP não encontrado" : null)} className="col-span-6 small:col-span-3">
              <div className="relative">
                <input className={`${inputCls} w-full`} inputMode="numeric" autoComplete="postal-code" value={f.postal_code} onChange={(e) => setF((p) => ({ ...p, postal_code: maskCEP(e.target.value) }))} placeholder="00000-000" name="postal_code" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-body-sm">
                  {cepState === "loading" && <span className="text-ink-muted">Buscando...</span>}
                  {cepState === "ok" && <Icon name="check_circle" className="text-[18px] text-stock-in" />}
                </span>
              </div>
            </Field>
            <Field label="Rua / Avenida" error={err("street")} className="col-span-6 small:col-span-4">
              <input className={inputCls} autoComplete="address-line1" value={f.street} onChange={set("street")} name="street" />
            </Field>
            <Field label="Número" error={err("number")} className="col-span-2 small:col-span-2">
              <input className={inputCls} value={f.number} onChange={set("number")} name="number" />
            </Field>
            <Field label="Complemento (opcional)" className="col-span-4 small:col-span-3">
              <input className={inputCls} autoComplete="address-line2" value={f.complement} onChange={set("complement")} name="complement" />
            </Field>
            <Field label="Bairro" error={err("district")} className="col-span-6 small:col-span-3">
              <input className={inputCls} value={f.district} onChange={set("district")} name="district" />
            </Field>
            <Field label="Cidade" error={err("city")} className="col-span-4">
              <input className={inputCls} autoComplete="address-level2" value={f.city} onChange={set("city")} name="city" />
            </Field>
            <Field label="UF" error={err("province")} className="col-span-2">
              <select className={inputCls} value={f.province} onChange={set("province")} name="province">
                <option value="">--</option>
                {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <div className="col-span-6 flex justify-end pt-2">
              <button type="button" onClick={saveAddress} disabled={pending} className="h-13 px-6 rounded-ava-md bg-brand hover:bg-brand-dark text-white text-label-md shadow-brand-glow disabled:bg-line-strong disabled:shadow-none w-full small:w-auto" data-testid="submit-address-button">
                {pending ? "Salvando..." : "Continuar para entrega"}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 2. Entrega */}
      <Card
        n={2}
        title="Modalidade de envio"
        sub="Entrega com rastreamento saindo de Unaí - MG"
        tag={<span className="text-label-xs text-stock-in inline-flex items-center gap-1"><Icon name="verified_user" className="text-[14px]" /> Envio protegido</span>}
        icon="local_shipping"
        done={hasShipping && order.indexOf(step) > 1}
        onEdit={order.indexOf(step) > 1 ? () => go("delivery") : undefined}
        summary={
          order.indexOf(step) > 1 && selectedOption ? (
            <div className="flex items-center justify-between rounded-ava-md bg-subtle p-3">
              <span className="text-ink font-semibold">{selectedOption.name}</span>
              <span className="font-display font-bold text-ink">{fmt(selectedOption.amount ?? 0, currency)}</span>
            </div>
          ) : null
        }
      >
        {step === "delivery" && (
          <div className="flex flex-col gap-3" data-testid="delivery-options">
            {shippingOptions.length === 0 && (
              <p className="text-body-md text-ink-soft">Nenhuma opção de entrega disponível para este endereço. Fale com a loja.</p>
            )}
            <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
              {shippingOptions.map((o) => {
                const active = optionId === o.id
                const desc = (o as any).type?.description || (/sedex|expres/i.test(o.name) ? "Prazo estimado: 1 a 3 dias úteis" : /pac|econ|padr/i.test(o.name) ? "Prazo estimado: 4 a 8 dias úteis" : "")
                const fastest = shippingOptions.length > 1 && (o.amount ?? 0) === Math.max(...shippingOptions.map((x) => x.amount ?? 0))
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOptionId(o.id)}
                    className={`text-left rounded-ava-lg border-2 p-4 transition-colors ${active ? "border-navy bg-navy/5" : "border-line hover:border-line-strong"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-navy" : "border-line-strong"}`}>
                          {active && <span className="w-2.5 h-2.5 rounded-full bg-navy" />}
                        </span>
                        <span className="font-display font-bold text-ink">{o.name}</span>
                        {fastest && <span className="px-2 py-0.5 rounded bg-brand text-white text-[10px] font-bold uppercase">Mais rápido</span>}
                      </span>
                      <span className="font-display font-bold text-ink">{(o.amount ?? 0) === 0 ? "Grátis" : fmt(o.amount ?? 0, currency)}</span>
                    </div>
                    {desc && <p className="text-body-sm text-ink-soft mt-1 ml-7">{desc}</p>}
                    <p className="text-label-xs mt-3 pt-3 ml-7 border-t border-line flex items-center justify-between">
                      <span className={fastest ? "text-stock-in inline-flex items-center gap-1" : "text-ink-muted inline-flex items-center gap-1"}><Icon name={fastest ? "bolt" : "local_shipping"} className="text-[14px]" /> {fastest ? "Prioridade no despacho" : "Envio padrão"}</span>
                      <span className="text-ink-muted">Correios</span>
                    </p>
                  </button>
                )
              })}
            </div>
            <div className="flex justify-end pt-2">
              <button type="button" onClick={saveShipping} disabled={pending || !optionId} className="h-13 px-6 rounded-ava-md bg-brand hover:bg-brand-dark text-white text-label-md shadow-brand-glow disabled:bg-line-strong disabled:shadow-none w-full small:w-auto" data-testid="submit-delivery-option-button">
                {pending ? "Salvando..." : "Continuar para pagamento"}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 3. Pagamento */}
      <Card
        n={3}
        title="Forma de pagamento"
        sub="Transação direta e criptografada"
        tag={pixPercent ? <span className="text-label-xs bg-teal/10 text-teal px-2 py-1 rounded-full font-bold">{pixPercent}% OFF no PIX</span> : undefined}
        icon="payments"
        done={hasPayment && step === "review"}
        onEdit={step === "review" ? () => go("payment") : undefined}
        summary={
          step === "review" && hasPayment ? (
            <div className="rounded-ava-md bg-subtle p-3 flex items-center gap-2">
              <Icon name={methodInfo[(cartMeta.payment_method as PayMethod) || "pix"].icon} className="text-[20px] text-navy" />
              <span className="text-ink font-semibold">{PAY_LABEL[(cartMeta.payment_method as PayMethod) || "pix"]}</span>
              {cartMeta.payment_method === "card" && Number(cartMeta.installments) > 1 && <span>• {cartMeta.installments}x</span>}
            </div>
          ) : null
        }
      >
        {step === "payment" && (
          <div className="flex flex-col gap-4" data-testid="payment-options">
            <div className="grid grid-cols-3 gap-1 p-1 rounded-ava-md bg-subtle">
              {(["pix", "card", "boleto"] as PayMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`h-12 rounded-ava text-label-md flex items-center justify-center gap-1.5 transition-colors ${method === m ? "bg-card shadow-card text-ink" : "text-ink-soft"}`}
                >
                  <Icon name={methodInfo[m].icon} className="text-[18px]" />
                  <span className="hidden xsmall:inline">{m === "card" ? "Cartão de Crédito" : m === "boleto" ? "Boleto Bancário" : "PIX"}</span>
                  {m === "card" && maxInst > 1 ? <span className="hidden small:inline text-[10px] text-ink-muted">(até {maxInst}x)</span> : null}
                  {m === "pix" && pixPercent ? <span className="hidden small:inline px-1.5 rounded bg-teal text-white text-[10px]">{pixPercent}% OFF</span> : null}
                </button>
              ))}
            </div>
            <div className="rounded-ava-lg bg-subtle border border-line p-4 small:p-6 flex flex-col small:flex-row gap-4 items-start">
              {method === "pix" ? (
                <div className="w-full small:w-44 shrink-0 flex flex-col items-center gap-2">
                  <div className="w-40 h-40 rounded-ava-lg card-surface p-3 grid grid-cols-7 gap-0.5" aria-hidden>
                    {Array.from({ length: 49 }, (_, i) => {
                      const r = Math.floor(i / 7), c = i % 7
                      const finder = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2)
                      const on = finder || (r * 3 + c * 5 + r * c) % 3 === 0
                      return <span key={i} className={`rounded-[2px] ${r === 3 && c === 3 ? "bg-teal" : on ? "bg-navy-deep" : "bg-transparent"}`} />
                    })}
                  </div>
                  <span className="text-label-xs text-ink-muted inline-flex items-center gap-1"><Icon name="schedule" className="text-[14px]" /> QR Code gerado após finalizar</span>
                </div>
              ) : (
                <span className="w-14 h-14 rounded-ava-md card-surface flex items-center justify-center shrink-0 text-navy">
                  <Icon name={methodInfo[method].icon} className="text-[32px]" />
                </span>
              )}
              <div className="flex-1">
                {method === "pix" && pixPercent ? <span className="inline-flex items-center gap-1 mb-2 px-2.5 py-1 rounded-full bg-teal/10 text-teal text-label-xs font-bold"><Icon name="bolt" className="text-[14px]" /> Aprovação imediata + {pixPercent}% OFF aplicado</span> : null}
                <p className="font-display text-h-sm text-ink">{methodInfo[method].title}</p>
                <p className="text-body-md text-ink-soft mt-1">{methodInfo[method].text}</p>
                {method === "pix" && pixTotal !== null && (
                  <p className="mt-2 text-body-md text-teal font-semibold">Valor estimado no PIX: {fmt(pixTotal, currency)}</p>
                )}
                {method === "card" && maxInst > 1 && (
                  <label className="mt-3 flex flex-col gap-1 max-w-xs">
                    <span className="text-label-md text-ink">Parcelas</span>
                    <select className={inputCls} value={installments} onChange={(e) => setInstallments(Number(e.target.value))}>
                      {Array.from({ length: maxInst }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}x de {fmt(total / n, currency)} sem juros</option>
                      ))}
                    </select>
                  </label>
                )}
                <p className="mt-3 inline-flex items-center gap-1.5 text-body-sm text-stock-low bg-stock-low/10 rounded-full px-3 py-1">
                  <Icon name="schedule" className="text-[16px]" /> Pagamento a confirmar pela loja
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={savePayment} disabled={pending} className="h-13 px-6 rounded-ava-md bg-brand hover:bg-brand-dark text-white text-label-md shadow-brand-glow disabled:bg-line-strong disabled:shadow-none w-full small:w-auto" data-testid="submit-payment-button">
                {pending ? "Salvando..." : "Revisar pedido"}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 4. Revisão */}
      {step === "review" && (
        <Card n={4} title="Revisão e confirmação" icon="fact_check">
          <div className="flex flex-col gap-4" data-testid="review-step">
            <label className="flex items-start gap-2 text-body-sm text-ink-soft">
              <input type="checkbox" className="mt-0.5 w-4 h-4 accent-[#FE6B00]" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
              Li e concordo com os termos de compra e a política de trocas e devoluções.
            </label>
            <button
              type="button"
              onClick={finish}
              disabled={pending || !accepted}
              className="h-14 rounded-ava-md bg-brand hover:bg-brand-dark disabled:bg-line-strong text-white text-label-md flex items-center justify-center gap-2 shadow-brand-glow"
              data-testid="submit-order-button"
            >
              <Icon name="lock" className="text-[20px]" />
              {pending ? "Finalizando..." : `Finalizar compra (${fmt(total, currency)})`}
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}
