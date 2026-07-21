'use client'
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Leaf } from "lucide-react";
import { content, siteData } from "@/data/siteData";
import { formatPrice } from "@/utils/formatPrice";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { CartItem } from "@/components/store/CartItem";
import { ordersService } from "@/services/storeService";

function ThinLine({ className = "", style = {} }) {
  return (
    <div
      className={`h-px ${className}`}
      style={{ backgroundColor: "var(--color-border)", ...style }}
    />
  );
}

function LeafDeco({ className = "", style = {} }) {
  return (
    <Leaf
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}

/* ── Estado vacío ─────────────────────────────────────────────────────── */
function CartEmpty({ emptyTitle, emptyMessage, browseProducts }) {
  return (
    <>
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "5rem",
          paddingBottom: "5rem",
        }}
      >
        <LeafDeco
          className="absolute top-8 right-[5%] w-20 h-20 text-[var(--color-secondary)] hidden md:block"
          style={{ opacity: 0.1 }}
        />
        <div className="relative max-w-7xl mx-auto">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold
              text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
              transition-colors mb-5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {content.productDetail.backTo}
          </Link>
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-3">
              Carrito
            </span>
            <h1
              className="text-4xl md:text-5xl font-normal tracking-tight text-[var(--color-text-primary)] mb-2"
            >
              {emptyTitle}
            </h1>
            <ThinLine className="w-16 my-4" />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="w-28 h-28 rounded-full bg-[var(--color-primary-light)]/30 flex items-center justify-center">
              <ShoppingCart
                className="w-12 h-12 text-[var(--color-primary)]"
                style={{ opacity: 0.5 }}
              />
            </div>
            <LeafDeco
              className="absolute -bottom-3 -right-3 w-8 h-8 text-[var(--color-secondary)]"
              style={{ opacity: 0.3 }}
            />
          </div>

          <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            {emptyMessage}
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold text-sm transition-all duration-200"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
              borderRadius: "2rem",
              boxShadow: "0 4px 14px rgba(203,110,228,0.35)",
            }}
          >
            {browseProducts}
          </Link>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CART PAGE
══════════════════════════════════════════════════════════════════════ */
export default function Cart() {
  const { items, totalItems, totalPrice } = useCart();
  const { requestOrder } = useOrder();
  const {
    title,
    emptyTitle,
    emptyMessage,
    browseProducts,
    itemCount,
    subtotal,
    total,
    requestQuote,
  } = content.cart;

  if (items.length === 0)
    return (
      <CartEmpty
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        browseProducts={browseProducts}
      />
    );

  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map(
        (item) =>
          `🌿 ${item.quantity}x ${item.name} — ${formatPrice(item.unitPrice)} c/u`,
      )
      .join("\n");
    const message = `Hola, quiero encargar este pedido de Vitalcer:\n\n${itemsList}\n\n💰 *Total: $${totalPrice.toLocaleString("es-AR")}*`;
    return encodeURIComponent(message);
  };

  const productItems = items.filter(i => i.type !== 'service')
  const serviceItems = items.filter(i => i.type === 'service')

  const handleRequest = () => {
    const message = generateWhatsAppMessage();
    requestOrder(message);
    ordersService.create({
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.unitPrice,
        qty: i.quantity,
      })),
      total: totalPrice,
    }).catch(() => {});
  };

  return (
    <>
      {/* ══ HERO — crema floral ══ */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "5rem",
          paddingBottom: "3rem",
        }}
      >
        <LeafDeco
          className="absolute top-6 right-[5%] w-24 h-24 text-[var(--color-secondary)] hidden md:block"
          style={{ opacity: 0.08 }}
        />
        <LeafDeco
          className="absolute bottom-2 left-[3%] w-12 h-12 text-[var(--color-primary)] hidden md:block"
          style={{ opacity: 0.15, transform: "rotate(-15deg)" }}
        />

        <div className="relative max-w-6xl mx-auto">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold
              text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
              transition-colors mb-5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {content.productDetail.backTo}
          </Link>

          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-2">
                Carrito
              </span>
              <h1
                className="text-4xl md:text-5xl font-normal tracking-tight text-[var(--color-text-primary)]"
              >
                {title}
              </h1>
            </div>
            <div
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 mb-1 text-sm font-semibold text-[var(--color-primary)]"
              style={{
                backgroundColor: "var(--color-primary-light)",
                borderRadius: "2rem",
                color: "var(--color-primary)",
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount.replace("{count}", totalItems)}
            </div>
          </div>

          <ThinLine className="w-16 mt-5" />
        </div>
      </section>

      {/* ══ CONTENIDO ══ */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* ── Items ── */}
            <div className="lg:col-span-2 space-y-6">
              {productItems.length > 0 && (
                <>
                  <h3 className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>Productos</h3>
                  <div className="border-t border-[var(--color-border)]" />
                  {productItems.map((item) => <CartItem key={item.id} item={item} />)}
                </>
              )}
              {serviceItems.length > 0 && (
                <>
                  <h3 className="text-xs font-bold tracking-widest uppercase mt-2" style={{ color: "var(--color-text-muted)" }}>Servicios</h3>
                  <div className="border-t border-[var(--color-border)]" />
                  {serviceItems.map((item) => <CartItem key={item.id} item={item} />)}
                </>
              )}
              <Link
                href="/productos"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors group mt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                {content.cart.continueShopping}
              </Link>
            </div>

            {/* ── Resumen ── */}
            <div className="lg:col-span-1">
              <div
                className="sticky top-24 rounded-2xl border overflow-hidden"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-card)",
                }}
              >
                <div className="px-6 pt-6 pb-4">
                  <h3
                    className="text-lg font-normal text-[var(--color-text-primary)] mb-1"
                  >
                    Resumen
                  </h3>
                  <ThinLine className="w-10 mb-6" />

                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {subtotal}
                    </span>
                    <span className="text-sm text-[var(--color-text-primary)]">
                      ${totalPrice.toLocaleString("es-AR")}
                    </span>
                  </div>

                  <ThinLine className="my-4" />

                  <div className="flex justify-between items-center mb-8">
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {total}
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      ${totalPrice.toLocaleString("es-AR")}
                    </span>
                  </div>

                  <button
                    onClick={handleRequest}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      borderRadius: "2rem",
              boxShadow: "0 4px 14px rgba(100,180,1,0.35)",
                    }}
                  >
                    <svg
                      className="w-5 h-5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {requestQuote}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
