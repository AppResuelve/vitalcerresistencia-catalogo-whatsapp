// @ts-nocheck
'use client'
// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { content } from "@/data/siteData";
import { useRelatedProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { ProductGallery } from "@/components/store/ProductGallery";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/utils/formatPrice";
import { ProductGrid } from "@/components/store/ProductGrid";

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { addItem, getItemQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [selectedValues, setSelectedValues] = useState({});

  const categoryId = product?.categoryId;
  const { products: relatedProducts } = useRelatedProducts(
    categoryId,
    product?.id,
  );

  const skus = useMemo(() => product?.skus || [], [product])

  const UNIT_LABEL = { kg: 'Gr', m: 'Cm', l: 'Ml' }
  const UNIT_BASE_LABEL = { kg: 'Kg', m: 'M', l: 'L' }

  const attributeGroups = useMemo(() => {
    const groups = {}
    skus.forEach(sku => {
      sku.attributeValues.forEach(av => {
        if (!av.attribute) return
        const aId = av.attribute.id
        if (!groups[aId]) groups[aId] = { name: av.attribute.name, unitType: av.attribute.unitType || null, ids: [], valueMap: {} }
        if (!groups[aId].valueMap[av.id]) {
          groups[aId].ids.push(av.id)
          groups[aId].valueMap[av.id] = av.value
        }
      })
    })
    return Object.entries(groups).map(([aId, g]) => ({
      attributeId: Number(aId),
      name: g.name,
      unitType: g.unitType,
      ids: g.ids,
      valueMap: g.valueMap,
    }))
  }, [skus])

  const unitGroup = useMemo(() => attributeGroups.find(g => g.unitType), [attributeGroups])

  const derivedSku = useMemo(() => {
    const selected = Object.values(selectedValues).filter(Boolean)
    if (!selected.length) return skus[0]
    return skus.find(sku =>
      selected.every(vId => sku.attributeValues.some(av => av.id === vId))
    ) || skus[0]
  }, [skus, selectedValues])

  const price = derivedSku ? derivedSku.retailPrice : product?.retailPrice
  const wholesalePrice = derivedSku?.wholesalePrice ?? product?.wholesalePrice
  const wholesaleMinQty = derivedSku?.wholesaleMinQty ?? product?.wholesaleMinQty
  const hasWholesale = wholesalePrice && wholesaleMinQty

  const displayImages = useMemo(() => {
    if (!derivedSku) return product?.images || []
    const attrImages = (derivedSku.attributeValues || [])
      .flatMap(av => av.images || [])
      .filter(Boolean)
    return attrImages.length > 0 ? attrImages : (product?.images || [])
  }, [derivedSku, product])

  // Auto-seleccionar primer valor de cada grupo
  useEffect(() => {
    if (!attributeGroups.length || Object.keys(selectedValues).length) return
    const init = {}
    attributeGroups.forEach(g => { if (g.ids.length > 0) init[g.attributeId] = g.ids[0] })
    setSelectedValues(init)
  }, [attributeGroups])

  const related = relatedProducts
    .filter((p) => String(p.id) !== String(product?.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product.id, 1, derivedSku?.id)
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleAddWholesale = () => {
    const qty = wholesaleMinQty || product.wholesaleMinQty
    addItem(product.id, qty, derivedSku?.id)
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const quantity = getItemQuantity(product.id);
  const hasDiscount = product.discountPercentage;

  return (
    <section
      className="pb-24 px-4 sm:px-6 lg:px-8"
      style={{ paddingTop: "5rem" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Back link ── */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-medium mb-10 group transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-muted)")
          }
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          {content.productDetail.backTo}
        </button>

        {/* ── Grid principal ── */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Galería */}
          <ProductGallery
            images={displayImages}
            productName={product.name}
            discountPercentage={hasDiscount ? product.discountPercentage : null}
          />

          {/* Info */}
          <div>
            {/* Categoría */}
            {product.category && (
              <div className="mb-5">
                <span
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                  }}
                >
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Tags */}
            {product.tagValues?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {product.tagValues.map((tv) => (
                  <Badge key={tv.id} color={tv.tag?.color}>{tv.value}</Badge>
                ))}
              </div>
            )}

            {/* Nombre */}
            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "var(--color-text-primary)",
                marginBottom: "1rem",
              }}
            >
              {product.name}
            </h1>

            {/* Descripción corta */}
            {product.shortDescription && (
              <p
                className="mb-6 leading-relaxed"
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                {product.shortDescription}
              </p>
            )}

            {/* Línea decorativa */}
            <div className="flex items-center gap-3 mb-6" aria-hidden="true">
              <div
                className="h-px w-8"
                style={{ backgroundColor: "var(--color-secondary)", opacity: 0.6 }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-primary)", opacity: 0.6 }}
              />
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "var(--color-border)" }}
              />
            </div>

            {/* Selector de variantes por atributo */}
            {attributeGroups.length >= 1 && (
              <div className="mb-4 space-y-4">
                {attributeGroups.map(group => (
                  <div key={group.attributeId}>
                    <p className="text-sm font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>{group.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.ids.map(vId => {
                        const selected = selectedValues[group.attributeId] === vId
                        return (
                          <button
                            key={vId}
                            onClick={() => setSelectedValues(prev => ({ ...prev, [group.attributeId]: vId }))}
                            className="text-sm px-3 py-1.5 rounded-full border transition-all"
                            style={{
                              borderColor: selected ? "var(--color-primary)" : "var(--color-border)",
                              backgroundColor: selected ? "var(--color-primary-light)" : "transparent",
                              color: selected ? "var(--color-primary)" : "var(--color-text-secondary)",
                            }}
                          >
                            {group.unitType ? `${group.valueMap[vId]} ${UNIT_LABEL[group.unitType]}` : group.valueMap[vId]}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Precio minorista */}
            <div className="mb-1">
              {unitGroup && (
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Precio por {UNIT_BASE_LABEL[unitGroup.unitType]}: {formatPrice(product.retailPrice)}
                </p>
              )}
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                  }}
                >
                  {formatPrice(price)}
                </span>
                <span
                  className="text-base"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {unitGroup ? selectedValues[unitGroup.attributeId] ? `${unitGroup.valueMap[selectedValues[unitGroup.attributeId]]} ${UNIT_LABEL[unitGroup.unitType]}` : `x 1 ${UNIT_LABEL[unitGroup.unitType]}` : 'x 1 u.'}
                </span>
              </div>
              {product.discountPercentage && product.comparePrice && (
                <span
                  className="text-base line-through"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Precio mayorista */}
            {hasWholesale && (
              <div
                className="mt-4 mb-6 p-4 rounded-xl"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  border: "1px solid var(--color-secondary)",
                }}
              >
                <p
                  className="text-xs font-medium mb-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  Precio mayorista · a partir de {wholesaleMinQty}{" "}
                  unidades
                </p>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                    }}
                  >
                    {formatPrice(wholesalePrice)}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    x 1 u.
                  </span>
                </div>
              </div>
            )}

            {/* Descripción larga */}
            {product.description && (
              <p
                className="leading-relaxed mb-8"
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                }}
              >
                {product.description}
              </p>
            )}

            {/* Botón principal — pill verde */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full px-8 py-3.5 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{
                borderRadius: "2rem",
                backgroundColor: justAdded
                  ? "var(--color-secondary)"
                  : "var(--color-primary)",
                color: "#ffffff",
                boxShadow: justAdded
                  ? "0 4px 16px rgba(132,108,66,0.3)"
                  : "0 4px 20px rgba(100,180,1,0.3)",
              }}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  {content.productDetail.addedToCart}
                </>
              ) : (
                <>
                  {content.productDetail.addToCart}
                  {quantity > 0 && ` (${quantity} en carrito)`}
                </>
              )}
            </button>

            {/* Botón mayorista — outline pill */}
            {hasWholesale && (
              <button
                onClick={handleAddWholesale}
                className="flex items-center justify-center gap-2 w-full px-8 py-3.5 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 mt-3"
                style={{
                  borderRadius: "2rem",
                  border: "1px solid var(--color-primary)",
                  color: "var(--color-primary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-primary)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
              >
                Agregar por {wholesaleMinQty} u. (mayorista)
              </button>
            )}
          </div>
        </div>

        {/* ── Productos relacionados ── */}
        {related.length > 0 && (
          <>
            {/* Header de sección minimalista */}
            <div className="mb-8">
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase block mb-1"
                style={{ color: "var(--color-primary)" }}
              >
                Sugeridos para vos
              </span>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                }}
              >
                {product.category?.name || 'También te puede gustar'}
              </h2>
            </div>
            <ProductGrid products={related} />
          </>
        )}
      </div>
    </section>
  );
}
