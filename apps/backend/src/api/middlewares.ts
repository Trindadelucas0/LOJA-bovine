import { authenticate, configureStoreSearch, defineMiddlewares } from '@medusajs/framework/http'
import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

/**
 * Compra somente com conta: rejeita a finalizacao de carrinhos sem cliente
 * (customer_id) ou quando a requisicao nao vem de um cliente autenticado.
 */
async function requireCustomerForCartComplete(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data } = await query.graph({
      entity: 'cart',
      fields: ['id', 'customer_id', 'customer.has_account'],
      filters: { id: req.params.id },
    })
    const cart = data?.[0] as any
    if (!cart) {
      return next()
    }
    const actorId = (req as any).auth_context?.actor_id
    const hasAccount = cart.customer?.has_account === true
    if (!cart.customer_id || !hasAccount || !actorId || actorId !== cart.customer_id) {
      return res.status(401).json({
        type: 'unauthorized',
        message: 'Entre ou crie sua conta para finalizar o pedido.',
      })
    }
    return next()
  } catch (e) {
    return next(e)
  }
}

// The product index declares filterable `status` and `sales_channel_ids`, so
// the route narrows it to published products in the key's sales channels.
export default defineMiddlewares({
  routes: [
    {
      method: ['POST'],
      matcher: '/store/search',
      middlewares: [
        configureStoreSearch({
          allowed_indexes: {
            product: true,
          },
        }),
      ],
    },
    {
      method: ['POST'],
      matcher: '/store/carts/:id/complete',
      middlewares: [
        authenticate('customer', ['session', 'bearer'], { allowUnauthenticated: true }),
        requireCustomerForCartComplete,
      ],
    },
  ],
})
