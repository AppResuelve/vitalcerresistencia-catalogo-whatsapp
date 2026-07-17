'use client'
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";

export function ProductCard({ product }) {
  const { addItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const hasDiscount = product.discountPercentage;
  const hasWholesale = product.wholesalePrice && product.wholesaleMinQty;

  const getBadgeVariant = (tag) => {
    if (tag === "nuevo") return "new";
    if (tag === "oferta") return "sale";
    if (tag === "bestseller") return "bestseller";
    return "default";
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product.id);
  };

  const handleAddWholesale = (e) => {
    e.preventDefault();
    addItem(product.id, product.wholesaleMinQty);
  };

  return (
    <div
      className="group relative overflow-hidden flex flex-col transition-all duration-300"
      style={{
        borderRadius: "1rem",
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-card)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 8px 32px rgba(100,180,1,0.12)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* ── Imagen ── */}
      <div className="relative">
        <Link href={`/productos/${product.slug}`} className="block">
          <div
            className="aspect-square overflow-hidden"
            style={{ borderRadius: "1rem 1rem 0 0" }}
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
            />
          </div>

          {/* Badge descuento */}
          {hasDiscount && (
            <div className="absolute bottom-3 right-3">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "#ffffff",
                }}
              >
                {product.discountPercentage}% OFF
              </span>
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              {product.tags.map((tag) => (
                <Badge key={tag} variant={getBadgeVariant(tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Link>
      </div>

      {/* ── Contenido ── */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/productos/${product.slug}`} className="block flex-1">
          <h3
            className="line-clamp-2 mb-0.5"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              fontWeight: 500,
              lineHeight: 1.3,
              color: "var(--color-text-primary)",
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-3">
          {/* Precio minorista */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="flex items-center gap-1">
                <span
                  className="text-lg font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {formatPrice(product.retailPrice)}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  x 1 u.
                </span>
              </div>
              {hasDiscount && (
                <span
                  className="text-sm line-through"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Precio mayorista */}
          {hasWholesale && (
            <>
              <p
                className="text-xs mb-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                mayorista (a partir de {product.wholesaleMinQty} u.)
              </p>
              <div className="flex items-center gap-1 mb-1">
                <span
                  className="text-base font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {formatPrice(product.wholesalePrice)}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  x 1 u.
                </span>
              </div>
              {product.wholesaleComparePrice && (
                <span
                  className="text-sm line-through"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatPrice(product.wholesaleComparePrice)}
                </span>
              )}
            </>
          )}

          {/* Botón principal — pill verde */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium transition-all duration-200 mt-3"
            style={{
              borderRadius: "2rem",
              backgroundColor:
                quantity > 0
                  ? "var(--color-primary-light)"
                  : "var(--color-primary)",
              color: quantity > 0 ? "var(--color-primary)" : "#ffffff",
              border: quantity > 0 ? "1px solid var(--color-primary)" : "none",
            }}
            onMouseEnter={(e) => {
              if (quantity === 0)
                e.currentTarget.style.backgroundColor =
                  "var(--color-primary-hover)";
            }}
            onMouseLeave={(e) => {
              if (quantity === 0)
                e.currentTarget.style.backgroundColor = "var(--color-primary)";
              else
                e.currentTarget.style.backgroundColor =
                  "var(--color-primary-light)";
            }}
          >
            {quantity > 0 ? `Agregado (${quantity})` : "Agregar al carrito"}
          </button>

          {/* Botón mayorista — outline pill */}
          {hasWholesale && (
            <button
              onClick={handleAddWholesale}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium transition-all duration-200 mt-2"
              style={{
                borderRadius: "2rem",
                border: "1px solid var(--color-primary)",
                color: "var(--color-primary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-primary)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-primary)";
              }}
            >
              Agregar por {product.wholesaleMinQty} u.
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
