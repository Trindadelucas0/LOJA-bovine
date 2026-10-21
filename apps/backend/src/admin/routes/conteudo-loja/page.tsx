import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront } from "@medusajs/icons"
import {
  Badge,
  Button,
  Checkbox,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Switch,
  Tabs,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"

type Dict = Record<string, any>

const api = async (path: string, init?: RequestInit) => {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Erro ${res.status}`)
  }
  return res.json()
}

const uploadFile = async (file: File): Promise<string> => {
  const fd = new FormData()
  fd.append("files", file)
  const res = await fetch("/admin/uploads", {
    method: "POST",
    credentials: "include",
    body: fd,
  })
  if (!res.ok) throw new Error("Falha no upload")
  const data = await res.json()
  return data.files?.[0]?.url
}

/* ---------- conversores lista <-> texto ---------- */
const linksToText = (v: any) =>
  Array.isArray(v) ? v.map((l: Dict) => `${l.label ?? ""} | ${l.url ?? ""}`).join("\n") : ""
const textToLinks = (t: string) =>
  t.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [label, url] = l.split("|").map((s) => s.trim())
    return { label, url: url || "#" }
  })
const columnsToText = (v: any) =>
  Array.isArray(v)
    ? v.map((c: Dict) => [`# ${c.title ?? ""}`, linksToText(c.links)].filter(Boolean).join("\n")).join("\n")
    : ""
const textToColumns = (t: string) => {
  const cols: Dict[] = []
  t.split("\n").map((l) => l.trim()).filter(Boolean).forEach((l) => {
    if (l.startsWith("#")) cols.push({ title: l.replace(/^#\s*/, ""), links: [] })
    else {
      if (!cols.length) cols.push({ title: "", links: [] })
      cols[cols.length - 1].links.push(...textToLinks(l))
    }
  })
  return cols
}
const itemsToText = (v: any) =>
  Array.isArray(v) ? v.map((b: Dict) => `${b.icon ?? ""} | ${b.title ?? ""} | ${b.text ?? ""}`).join("\n") : ""
const textToItems = (t: string) =>
  t.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [icon, title, text] = l.split("|").map((s) => s.trim())
    return { icon, title, text }
  })
const listToText = (v: any) => (Array.isArray(v) ? v.join("\n") : "")
const textToList = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean)

/* ---------- componentes ---------- */
const Field = ({ label, hint, children }: { label: string; hint?: string; children: any }) => (
  <div className="flex flex-col gap-y-1">
    <Label size="small" weight="plus">{label}</Label>
    {children}
    {hint && <Text size="xsmall" className="text-ui-fg-subtle">{hint}</Text>}
  </div>
)

const ImageField = ({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) => {
  const [busy, setBusy] = useState(false)
  return (
    <Field label={label} hint="Cole uma URL ou envie um arquivo.">
      <div className="flex items-center gap-x-2">
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              setBusy(true)
              try {
                onChange(await uploadFile(f))
                toast.success("Imagem enviada")
              } catch (err: any) {
                toast.error(err.message)
              } finally {
                setBusy(false)
              }
            }}
          />
          <span className="txt-compact-small-plus border rounded-md px-3 py-1.5 whitespace-nowrap">
            {busy ? "Enviando..." : "Enviar"}
          </span>
        </label>
      </div>
      {value && <img src={value} alt="" className="h-16 w-auto object-contain mt-1 rounded border" />}
    </Field>
  )
}

/* ---------- aba: informações da loja ---------- */
const SettingsTab = () => {
  const [s, setS] = useState<Dict | null>(null)
  const [txt, setTxt] = useState<Dict>({})
  const [cats, setCats] = useState<Dict[]>([])
  const [cols, setCols] = useState<Dict[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api("/admin/avadesk-content").then(({ settings }) => {
      setS(settings)
      setTxt({
        header_links: linksToText(settings.header_links),
        footer_columns: columnsToText(settings.footer_columns),
        hero_badges: itemsToText(settings.hero_badges),
        benefits: itemsToText(settings.benefits),
        chat_quick_replies: listToText(settings.chat_quick_replies),
      })
    }).catch((e) => toast.error(e.message))
    api("/admin/product-categories?limit=200&fields=id,name,parent_category_id").then((d) => setCats(d.product_categories || [])).catch(() => {})
    api("/admin/collections?limit=200&fields=id,title").then((d) => setCols(d.collections || [])).catch(() => {})
  }, [])

  if (!s) return <Text className="p-6">Carregando...</Text>

  const set = (k: string) => (e: any) => setS({ ...s, [k]: e.target.value })
  const toggleId = (k: string, id: string) => {
    const cur: string[] = Array.isArray(s[k]) ? s[k] : []
    setS({ ...s, [k]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] })
  }

  const save = async () => {
    setSaving(true)
    try {
      const body = {
        ...s,
        pix_discount_percent: s.pix_discount_percent === "" || s.pix_discount_percent == null ? null : Number(s.pix_discount_percent),
        max_installments: s.max_installments === "" || s.max_installments == null ? null : Number(s.max_installments),
        header_links: textToLinks(txt.header_links || ""),
        footer_columns: textToColumns(txt.footer_columns || ""),
        hero_badges: textToItems(txt.hero_badges || ""),
        benefits: textToItems(txt.benefits || ""),
        chat_quick_replies: textToList(txt.chat_quick_replies || ""),
      }
      delete (body as Dict).id
      delete (body as Dict).created_at
      delete (body as Dict).updated_at
      delete (body as Dict).deleted_at
      const { settings } = await api("/admin/avadesk-content", { method: "POST", body: JSON.stringify(body) })
      setS(settings)
      toast.success("Configurações salvas")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const section = "flex flex-col gap-y-4 px-6 py-4"
  const grid = "grid grid-cols-1 md:grid-cols-2 gap-4"

  return (
    <div className="divide-y">
      <div className={section}>
        <Heading level="h2">Identidade</Heading>
        <div className={grid}>
          <Field label="Nome da loja"><Input value={s.store_name ?? ""} onChange={set("store_name")} /></Field>
          <Field label="Slogan / descrição curta"><Input value={s.tagline ?? ""} onChange={set("tagline")} /></Field>
          <ImageField label="Logo" value={s.logo_url} onChange={(v) => setS({ ...s, logo_url: v })} />
        </div>
      </div>
      <div className={section}>
        <Heading level="h2">Contatos</Heading>
        <div className={grid}>
          <Field label="Telefone"><Input value={s.phone ?? ""} onChange={set("phone")} /></Field>
          <Field label="WhatsApp" hint="Somente números com DDI, ex.: 5511999999999"><Input value={s.whatsapp ?? ""} onChange={set("whatsapp")} /></Field>
          <Field label="WhatsApp da Mobile" hint="Usado somente em Soluções em Energia. Somente números com DDI."><Input inputMode="numeric" value={s.mobile_whatsapp ?? ""} onChange={(e) => setS({ ...s, mobile_whatsapp: e.target.value.replace(/\D/g, "") })} /></Field>
          <Field label="E-mail"><Input value={s.email ?? ""} onChange={set("email")} /></Field>
          <Field label="Endereço"><Input value={s.address ?? ""} onChange={set("address")} /></Field>
        </div>
      </div>
      <div className={section}>
        <Heading level="h2">Preços e pagamento</Heading>
        <div className={grid}>
          <Field label="Desconto no PIX (%)" hint="Usado para mostrar o preço PIX nos cards. Vazio = oculto."><Input type="number" value={s.pix_discount_percent ?? ""} onChange={set("pix_discount_percent")} /></Field>
          <Field label="Parcelas sem juros (máx.)" hint="Vazio = oculto."><Input type="number" value={s.max_installments ?? ""} onChange={set("max_installments")} /></Field>
          <Field label="Texto de desconto PIX" hint="Ex.: 5% OFF no PIX em todo o site"><Input value={s.pix_discount_text ?? ""} onChange={set("pix_discount_text")} /></Field>
        </div>
      </div>
      <div className={section}>
        <Heading level="h2">Home</Heading>
        <div className={grid}>
          <Field label="Título de departamentos"><Input value={s.categories_title ?? ""} onChange={set("categories_title")} placeholder="Departamentos" /></Field>
          <Field label="Título de destaques"><Input value={s.featured_title ?? ""} onChange={set("featured_title")} placeholder="Produtos em Destaque" /></Field>
          <Field label="Título de recém-adicionados"><Input value={s.new_arrivals_title ?? ""} onChange={set("new_arrivals_title")} placeholder="Recém-adicionados" /></Field>
        </div>
        <Field label="Selos do banner principal" hint="Um por linha: ícone | título | texto. Ícones: nomes do Material Symbols (ex.: local_shipping, verified, support_agent).">
          <Textarea rows={3} value={txt.hero_badges} onChange={(e) => setTxt({ ...txt, hero_badges: e.target.value })} />
        </Field>
        <Field label="Benefícios (faixa antes do rodapé)" hint="Um por linha: ícone | título | texto">
          <Textarea rows={4} value={txt.benefits} onChange={(e) => setTxt({ ...txt, benefits: e.target.value })} />
        </Field>
        <Field label="Departamentos exibidos na home" hint="Nenhuma marcada = todos os departamentos principais.">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {cats.map((c) => (
              <label key={c.id} className="flex items-center gap-x-2 txt-small">
                <Checkbox checked={(s.home_category_ids || []).includes(c.id)} onCheckedChange={() => toggleId("home_category_ids", c.id)} />
                {c.name}{c.parent_category_id ? <Badge size="2xsmall">sub</Badge> : null}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Coleções em destaque (abas)" hint="Nenhuma marcada = todas as coleções.">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {cols.map((c) => (
              <label key={c.id} className="flex items-center gap-x-2 txt-small">
                <Checkbox checked={(s.featured_collection_ids || []).includes(c.id)} onCheckedChange={() => toggleId("featured_collection_ids", c.id)} />
                {c.title}
              </label>
            ))}
          </div>
        </Field>
      </div>
      <div className={section}>
        <Heading level="h2">Atendimento (Chatwoot)</Heading>
        <div className={grid}>
          <Field label="URL do Chatwoot" hint="Ex.: https://chat.suaempresa.com.br (as variáveis NEXT_PUBLIC_CHATWOOT_* do storefront têm prioridade)"><Input value={s.chatwoot_base_url ?? ""} onChange={set("chatwoot_base_url")} /></Field>
          <Field label="Website token"><Input value={s.chatwoot_website_token ?? ""} onChange={set("chatwoot_website_token")} /></Field>
          <Field label="Título do bloco de chat"><Input value={s.chat_title ?? ""} onChange={set("chat_title")} /></Field>
          <Field label="Texto do botão"><Input value={s.chat_button_label ?? ""} onChange={set("chat_button_label")} placeholder="Falar com Consultor" /></Field>
        </div>
        <Field label="Texto do bloco de chat"><Textarea rows={2} value={s.chat_text ?? ""} onChange={set("chat_text")} /></Field>
        <Field label="Respostas rápidas" hint="Uma por linha"><Textarea rows={3} value={txt.chat_quick_replies} onChange={(e) => setTxt({ ...txt, chat_quick_replies: e.target.value })} /></Field>
      </div>
      <div className={section}>
        <Heading level="h2">Cabeçalho e rodapé</Heading>
        <Field label="Links do cabeçalho" hint="Um por linha: Rótulo | /caminho-ou-url. Use #chat como URL para abrir o atendimento.">
          <Textarea rows={3} value={txt.header_links} onChange={(e) => setTxt({ ...txt, header_links: e.target.value })} />
        </Field>
        <Field label="Texto do rodapé"><Textarea rows={2} value={s.footer_text ?? ""} onChange={set("footer_text")} /></Field>
        <Field label="Colunas do rodapé" hint={"Linha iniciando com # = título da coluna; abaixo, um link por linha: Rótulo | URL"}>
          <Textarea rows={8} value={txt.footer_columns} onChange={(e) => setTxt({ ...txt, footer_columns: e.target.value })} />
        </Field>
        <Field label="Texto de copyright"><Input value={s.copyright_text ?? ""} onChange={set("copyright_text")} /></Field>
      </div>
      <div className="flex justify-end px-6 py-4">
        <Button onClick={save} isLoading={saving}>Salvar configurações</Button>
      </div>
    </div>
  )
}

/* ---------- aba: banners ---------- */
const emptyBanner: Dict = { position: "hero", title: "", is_active: true, rank: 0 }

const BannerForm = ({ initial, onDone }: { initial: Dict; onDone: () => void }) => {
  const [b, setB] = useState<Dict>(initial)
  const [saving, setSaving] = useState(false)
  const set = (k: string) => (e: any) => setB({ ...b, [k]: e.target.value })
  const save = async () => {
    setSaving(true)
    try {
      const body = { ...b, rank: Number(b.rank || 0) }
      ;["id", "created_at", "updated_at", "deleted_at"].forEach((k) => delete body[k])
      await api(b.id ? `/admin/avadesk-content/banners/${b.id}` : "/admin/avadesk-content/banners", {
        method: "POST",
        body: JSON.stringify(body),
      })
      toast.success("Banner salvo")
      onDone()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="flex flex-col gap-y-4 border rounded-lg p-4 bg-ui-bg-subtle">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Posição">
          <Select value={b.position} onValueChange={(v) => setB({ ...b, position: v })}>
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="hero">Banner principal (topo da home)</Select.Item>
              <Select.Item value="promo">Faixa promocional</Select.Item>
            </Select.Content>
          </Select>
        </Field>
        <Field label="Ordem" hint="Menor aparece primeiro"><Input type="number" value={b.rank ?? 0} onChange={set("rank")} /></Field>
        <Field label="Nome interno / texto alternativo *" hint="Identifica o banner no admin e descreve a imagem para acessibilidade."><Input value={b.title ?? ""} onChange={set("title")} /></Field>
      </div>
      <Text size="small" className="text-ui-fg-subtle">A arte enviada ocupa todo o banner. Inclua na própria imagem os textos e elementos visuais da campanha. Recomendação: desktop 1440 × 420 px e mobile 750 × 900 px.</Text>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageField label="Arte completa (desktop)" value={b.image_url} onChange={(v) => setB({ ...b, image_url: v })} />
        <ImageField label="Arte completa (mobile, opcional)" value={b.mobile_image_url} onChange={(v) => setB({ ...b, mobile_image_url: v })} />
      </div>
      {(b.image_url || b.mobile_image_url) && (
        <div className="overflow-hidden rounded-lg border bg-ui-bg-base">
          <img src={b.image_url || b.mobile_image_url} alt={b.title || "Prévia do banner"} className="block h-auto max-h-72 w-full object-contain" />
        </div>
      )}
      <Field label="Destino ao clicar no banner (opcional)" hint="Ex.: /store, /collections/ofertas, #chat ou uma URL completa. Vazio = banner sem clique."><Input value={b.cta_url ?? ""} onChange={set("cta_url")} /></Field>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-x-2 txt-small">
          <Switch checked={!!b.is_active} onCheckedChange={(v) => setB({ ...b, is_active: v })} /> Ativo
        </label>
        <div className="flex gap-x-2">
          <Button variant="secondary" onClick={onDone}>Cancelar</Button>
          <Button onClick={save} isLoading={saving}>Salvar banner</Button>
        </div>
      </div>
    </div>
  )
}

const BannersTab = () => {
  const [banners, setBanners] = useState<Dict[]>([])
  const [editing, setEditing] = useState<Dict | null>(null)
  const load = () => api("/admin/avadesk-content/banners").then((d) => setBanners(d.banners || [])).catch((e) => toast.error(e.message))
  useEffect(() => { load() }, [])
  const remove = async (id: string) => {
    if (!window.confirm("Excluir este banner?")) return
    await api(`/admin/avadesk-content/banners/${id}`, { method: "DELETE" })
    toast.success("Banner excluído")
    load()
  }
  return (
    <div className="flex flex-col gap-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <Text className="text-ui-fg-subtle">O primeiro banner "principal" ativo aparece no topo da home; o primeiro "promocional" aparece na faixa entre as seções.</Text>
        {!editing && <Button size="small" onClick={() => setEditing({ ...emptyBanner })}>Novo banner</Button>}
      </div>
      {editing && <BannerForm initial={editing} onDone={() => { setEditing(null); load() }} />}
      {banners.length === 0 && !editing && <Text>Nenhum banner cadastrado.</Text>}
      {banners.map((b) => (
        <div key={b.id} className="flex items-center gap-x-4 border rounded-lg p-3">
          {b.image_url ? <img src={b.image_url} alt="" className="h-12 w-20 object-cover rounded" /> : <div className="h-12 w-20 rounded bg-ui-bg-subtle" />}
          <div className="flex-1">
            <Text weight="plus">{b.title}</Text>
            <Text size="small" className="text-ui-fg-subtle">{b.position === "hero" ? "Principal" : "Promocional"} · ordem {b.rank}</Text>
          </div>
          <Badge color={b.is_active ? "green" : "grey"}>{b.is_active ? "Ativo" : "Inativo"}</Badge>
          <Button size="small" variant="secondary" onClick={() => setEditing(b)}>Editar</Button>
          <Button size="small" variant="danger" onClick={() => remove(b.id)}>Excluir</Button>
        </div>
      ))}
    </div>
  )
}

const ConteudoLojaPage = () => (
  <Container className="p-0 divide-y">
    <div className="px-6 py-4">
      <Heading level="h1">Conteúdo da loja</Heading>
      <Text className="text-ui-fg-subtle">Banners, informações da loja, rodapé, home e atendimento exibidos no site.</Text>
    </div>
    <Tabs defaultValue="banners">
      <Tabs.List className="px-6 pt-4">
        <Tabs.Trigger value="banners">Banners</Tabs.Trigger>
        <Tabs.Trigger value="settings">Informações e home</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="banners"><BannersTab /></Tabs.Content>
      <Tabs.Content value="settings"><SettingsTab /></Tabs.Content>
    </Tabs>
  </Container>
)

export const config = defineRouteConfig({
  label: "Conteúdo da loja",
  icon: BuildingStorefront,
})

export default ConteudoLojaPage
