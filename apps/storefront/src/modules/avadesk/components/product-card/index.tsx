import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import Icon from "../icon"
import ProductChatButton from "./chat-button"

export type PriceConfig = {
  pixPercent?: number | null
  maxInstallments?: number | null
  sellerName?: string | null
  chatEnabled?: boolean
}

const stockOf = (p: HttpTypes.StoreProduct) => {
  const vs = p.variants || []
  if (!vs.length) return "out"
  const available = vs.some(
    (v) => !v.manage_inventory || v.allow_backorder || (v.inventory_quantity ?? 0) > 0
  )
  if (!available) return "out"
  const managed = vs.filter((v) => v.manage_inventory && !v.allow_backorder)
  if (managed.length === vs.length) {
    const total = managed.reduce((a, v) => a + (v.inventory_quantity ?? 0), 0)
    if (total > 0 && total <= 5) return "low"
  }
  return "in"
}

export default function AvaProductCard({
  product,
  config,
  compact,
}: {
  product: HttpTypes.StoreProduct
  config: PriceConfig
  compact?: boolean
}) {
  const { cheapestPrice: price } = getProductPrice({ product })
  const stock = stockOf(product)
  const hasDiscount = price && price.price_type === "sale" && price.original_price_number > price.calculated_price_number
  const pix =
    price && config.pixPercent && config.pixPercent > 0
      ? convertToLocale({
          amount: price.calculated_price_number * (1 - config.pixPercent / 100),
          currency_code: price.currency_code,
        })
      : null
  const installments =
    price && config.maxInstallments && config.maxInstallments > 1
      ? `ou ${config.maxInstallments}x de ${convertToLocale({
          amount: price.calculated_price_number / config.maxInstallments,
          currency_code: price.currency_code,
        })} sem juros`
      : null
  const stockLabel = {
    in: { text: "Disponível em estoque", cls: "text-stock-in", dot: "bg-stock-in" },
    low: { text: "Últimas unidades", cls: "text-stock-low", dot: "bg-stock-low" },
    out: { text: "Indisponível", cls: "text-stock-out", dot: "bg-stock-out" },
  }[stock]
  const href = `/products/${product.handle}`

  return (
    <article className="group relative flex flex-col bg-white rounded-ava-lg p-2.5 small:p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
      <LocalizedClientLink href={href} className="relative block w-full rounded-ava-md bg-subtle overflow-hidden mb-3">
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-brand text-white text-label-xs shadow-sm">
            -{price!.percentage_diff}%
          </span>
        )}
        <Thumbnail thumbnail={product.thumbnail} images={product.images} size="square" className="!rounded-none !shadow-none !bg-subtle group-hover:scale-105 transition-transform duration-300" />
      </LocalizedClientLink>

      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={`w-2 h-2 rounded-full ${stockLabel.dot}`} />
        <span className={`text-label-xs uppercase ${stockLabel.cls}`}>{stockLabel.text}</span>
      </div>

      <LocalizedClientLink href={href}>
        <h3 className={`font-display text-ink group-hover:text-brand transition-colors line-clamp-2 mb-1.5 ${compact ? "text-body-md font-bold min-h-[40px]" : "text-body-md small:text-h-sm min-h-[40px] small:min-h-[48px]"}`}>
          {product.title}
        </h3>
      </LocalizedClientLink>

      {config.sellerName && !compact && (
        <div className="hidden small:flex items-center gap-1.5 text-body-sm text-ink-muted mb-3">
          <Icon name="verified" className="text-[16px] text-chat" />
          <span>
            Vendido por <strong>{config.sellerName}</strong>
          </span>
        </div>
      )}

      <div className="mt-auto mb-3">
        {price ? (
          <>
            {hasDiscount && (
              <span className="text-body-sm text-ink-muted line-through block">{price.original_price}</span>
            )}
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="font-display text-price-sm small:text-price-display text-ink">
                {pix || price.calculated_price}
              </span>
              {pix && <span className="text-label-xs text-teal">no PIX</span>}
            </div>
            {pix && <span className="text-body-sm text-ink-soft block">{price.calculated_price} no cartão</span>}
            {installments && <span className="text-body-sm text-ink-soft block">{installments}</span>}
          </>
        ) : (
          <span className="text-body-sm text-ink-muted">Preço indisponível</span>
        )}
      </div>

      <div className={`grid ${config.chatEnabled ? "grid-cols-[1fr_auto] small:grid-cols-2" : "grid-cols-1"} gap-2`}>
        <LocalizedClientLink
          href={href}
          className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-ava-md bg-brand hover:bg-brand-dark text-white text-label-sm transition-colors shadow-sm"
        >
          <Icon name="shopping_cart" className="text-[18px]" />
          <span>Comprar</span>
        </LocalizedClientLink>
        {config.chatEnabled && (
          <ProductChatButton
            product={{ id: product.id, title: product.title, sku: product.variants?.[0]?.sku, price: price?.calculated_price }}
          />
        )}
      </div>
    </article>
  )
}
