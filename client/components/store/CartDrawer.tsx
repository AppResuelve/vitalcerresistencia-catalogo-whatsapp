'use client'

import Link from 'next/link'
import { X, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/formatPrice'

export function CartDrawer({ open, onClose, onRequestOrder }) {
  const { items, totalItems, totalPrice, removeItem, clearCart } = useCart()

  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map(
        (item) =>
          `🌿 ${item.quantity}x ${item.name} — ${formatPrice(item.unitPrice)} c/u`,
      )
      .join('\n')
    return encodeURIComponent(
      `Hola, quiero encargar este pedido de Vitalcer:\n\n${itemsList}\n\n💰 *Total: $${totalPrice.toLocaleString('es-AR')}*`,
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md z-[70] flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <h3
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Tu pedido
            </h3>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
              }}
            >
              {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-border)]/50"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart
                className="w-12 h-12 mb-4"
                style={{ color: 'var(--color-text-muted)', opacity: 0.4 }}
              />
              <p
                className="text-sm font-medium mb-1"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Tu pedido está vacío
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Agregá productos desde el catálogo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl"
                  style={{
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card)',
                  }}
                >
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary-light)' }}
                    >
                      <ShoppingCart className="w-6 h-6" style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium line-clamp-1"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item.name}
                    </p>
                    {item.variantLabel && (
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {item.variantLabel}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {item.quantity}x {formatPrice(item.unitPrice)}
                      </span>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 self-start text-[var(--color-text-muted)] hover:text-red-500 transition-colors shrink-0"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-5 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Total
              </span>
              <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                ${totalPrice.toLocaleString('es-AR')}
              </span>
            </div>

            <button
              onClick={() => onRequestOrder(generateWhatsAppMessage())}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-medium text-sm text-white transition-all duration-200 hover:-translate-y-0.5 mb-2"
              style={{
                backgroundColor: 'var(--color-primary)',
                boxShadow: '0 4px 14px rgba(100,180,1,0.35)',
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Enviar pedido por WhatsApp
            </button>

            <Link
              href="/carrito"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-medium text-sm transition-colors"
              style={{
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
