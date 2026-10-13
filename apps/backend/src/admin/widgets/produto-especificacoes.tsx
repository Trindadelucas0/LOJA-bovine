import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Input, Label, Text, Textarea, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Props = { data: { id: string; metadata?: Record<string, unknown> | null } }

const FIELDS = ["badge", "max_qty_per_order", "specs", "included_items", "warranty_text"] as const
type Field = (typeof FIELDS)[number]

const asText = (v: unknown) => (v === null || v === undefined ? "" : String(v))

/**
 * Edita campos de metadata usados pela página de produto do storefront AVADESK.
 * Os demais campos de metadata do produto são preservados.
 */
const ProdutoEspecificacoesWidget = ({ data }: Props) => {
  const [values, setValues] = useState<Record<Field, string>>(() =>
    Object.fromEntries(FIELDS.map((f) => [f, asText(data.metadata?.[f])])) as Record<Field, string>
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setValues(Object.fromEntries(FIELDS.map((f) => [f, asText(data.metadata?.[f])])) as Record<Field, string>)
  }, [data.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (f: Field) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [f]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      // Busca o metadata atual para não sobrescrever outros campos.
      const cur = await fetch(`/admin/products/${data.id}?fields=metadata`, { credentials: "include" }).then((r) => r.json())
      const metadata: Record<string, unknown> = { ...(cur.product?.metadata || {}) }
      FIELDS.forEach((f) => {
        const v = values[f].trim()
        metadata[f] = v === "" ? "" : v
      })
      const res = await fetch(`/admin/products/${data.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Erro ${res.status}`)
      }
      toast.success("Especificações salvas")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Especificações da loja (AVADESK)</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Exibidas na página do produto: ficha técnica, itens inclusos, garantia, selo e limite por pedido.
        </Text>
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label size="small" weight="plus">Selo na imagem</Label>
            <Input value={values.badge} onChange={set("badge")} placeholder="Ex.: Oficial" />
          </div>
          <div className="flex flex-col gap-1">
            <Label size="small" weight="plus">Limite por pedido (unidades)</Label>
            <Input type="number" min={1} value={values.max_qty_per_order} onChange={set("max_qty_per_order")} placeholder="Vazio = sem limite" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label size="small" weight="plus">Ficha técnica</Label>
          <Textarea rows={6} value={values.specs} onChange={set("specs")} placeholder={"Uma linha por item, no formato Rótulo: Valor\nPotência: 750 W\nTensão: 220 V\nPeso: 2,1 kg"} />
        </div>
        <div className="flex flex-col gap-1">
          <Label size="small" weight="plus">Itens inclusos</Label>
          <Textarea rows={4} value={values.included_items} onChange={set("included_items")} placeholder={"Um item por linha\n1 Furadeira\n1 Maleta\n1 Manual"} />
        </div>
        <div className="flex flex-col gap-1">
          <Label size="small" weight="plus">Garantia</Label>
          <Textarea rows={3} value={values.warranty_text} onChange={set("warranty_text")} placeholder="Ex.: 12 meses de garantia contra defeitos de fabricação." />
        </div>
      </div>
      <div className="flex justify-end px-6 py-4">
        <Button size="small" onClick={save} isLoading={saving}>Salvar especificações</Button>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProdutoEspecificacoesWidget
