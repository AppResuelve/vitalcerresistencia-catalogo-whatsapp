import { formatPrice } from './formatPrice'

interface CartItem {
  name: string
  quantity: number
  unitPrice: number
  variantLabel?: string | null
}

export function generateWhatsAppOrderMessage(items: CartItem[], totalPrice: number): string {
  const itemsList = items
    .map(
      (item) =>
        `🌿 ${item.quantity}x ${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ''} — ${formatPrice(item.unitPrice)} c/u`,
    )
    .join('\n')
  return encodeURIComponent(
    `Hola, quiero encargar este pedido de Vitalcer:\n\n${itemsList}\n\n💰 *Total: $${totalPrice.toLocaleString('es-AR')}*`,
  )
}
