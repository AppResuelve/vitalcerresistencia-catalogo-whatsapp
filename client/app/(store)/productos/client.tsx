// @ts-nocheck
'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, MessageCircle, X, ChevronDown, Leaf } from "lucide-react";
import { content } from "@/data/siteData";
import { useStore } from "@/context/StoreContext";
import { useProducts } from "@/hooks/useProducts";
import { tagsService } from "@/services/storeService";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SearchBar } from "@/components/store/SearchBar";
import { TagFilter } from "@/components/store/TagFilter";

/* ── Leaf decorativo — firma visual ── */
function LeafDeco({ className = "", style = {} }) {
  return (
    <Leaf
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}

/* ── Skeleton ── */
function ProductSkeleton() {
  return (
    <div
      className="overflow-hidden animate-pulse"
      style={{
        borderRadius: "1rem",
        border: "1px solid var(--color-border)",
        backgroundColor: "white",
      }}
    >
      <div
        className="aspect-square"
        style={{ backgroundColor: "var(--color-border)" }}
      />
      <div className="p-4 space-y-2">
        <div
          className="h-3 rounded-full w-3/4"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <div
          className="h-3 rounded-full w-1/2"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <div
          className="h-4 rounded-full w-1/3 mt-3"
          style={{ backgroundColor: "var(--color-border)" }}
        />
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Estado vacío ── */
function EmptyState({
  searchQuery,
  whatsappNumber,
  onClear,
  noResults,
  clearFilters,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative w-20 h-28 mx-auto mb-6">
        <LeafDeco
          className="absolute inset-0 w-full h-full text-[var(--color-primary-light)]"
          style={{ opacity: 1 }}
        />
        <LeafDeco
          className="absolute inset-0 w-full h-full text-[var(--color-secondary)]"
          style={{
            opacity: 0.4,
            transform: "rotate(20deg) scale(0.7)",
          }}
        />
      </div>

      <p
        className="text-sm mb-2"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {noResults}
      </p>

      {searchQuery ? (
        <>
          <p
            className="text-xs mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            No encontramos resultados para{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              &quot;{searchQuery}&quot;
            </span>
          </p>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`🔍 ¡Hola! Me gustaría saber si tienen disponible: ${searchQuery}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "2rem",
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
              boxShadow: "0 4px 16px rgba(100,180,1,0.3)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            <MessageCircle className="w-4 h-4" />
            Preguntar por WhatsApp
          </a>
        </>
      ) : (
        <button
          onClick={onClear}
          className="text-sm font-medium hover:underline underline-offset-2 transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          {clearFilters}
        </button>
      )}
    </div>
  );
}

/* ── Paginación ── */
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 text-sm font-medium transition-colors disabled:opacity-30"
        style={{
          borderRadius: "2rem",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
          e.currentTarget.style.color = "var(--color-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.color = "var(--color-text-secondary)";
        }}
      >
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="w-9 h-9 text-sm font-medium transition-all duration-200"
            style={{
              borderRadius: "50%",
              backgroundColor:
                p === page ? "var(--color-primary)" : "transparent",
              color: p === page ? "#ffffff" : "var(--color-text-secondary)",
              boxShadow:
                p === page ? "0 4px 12px rgba(100,180,1,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (p !== page)
                e.currentTarget.style.backgroundColor =
                  "var(--color-primary-light)";
            }}
            onMouseLeave={(e) => {
              if (p !== page)
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 text-sm font-medium transition-colors disabled:opacity-30"
        style={{
          borderRadius: "2rem",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
          e.currentTarget.style.color = "var(--color-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.color = "var(--color-text-secondary)";
        }}
      >
        Siguiente
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PRODUCTS CLIENT — hydrated from server with initial data
══════════════════════════════════════════════════════════════════════ */
export default function ProductsClient({
  initialProducts,
  initialTotal,
  initialTotalPages,
  initialPage,
  categories: serverCategories,
  initialCategoryId,
  initialTags,
  initialTagIds,
  initialSearch,
}) {
  const router = useRouter();
  const { store, categories: ctxCategories } = useStore();
  const categories = ctxCategories.length > 0 ? ctxCategories : serverCategories;

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [selectedTagIds, setSelectedTagIds] = useState(initialTagIds);
  const [tags, setTags] = useState(initialTags);
  const [page, setPage] = useState(initialPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(true);
  const [openTags, setOpenTags] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { title, subtitle, noResults, clearFilters } = content.products;

  const categoryId =
    selectedCategory !== "Todos" ? selectedCategory : undefined;

  const isFirstFetch = searchQuery === initialSearch &&
    selectedCategory === initialCategoryId &&
    selectedTagIds.length === initialTagIds.length &&
    selectedTagIds.every((id, i) => id === initialTagIds[i]) &&
    page === initialPage;

  const { products: fetchedProducts, total: fetchedTotal, totalPages: fetchedTotalPages, loading } = useProducts(
    isFirstFetch ? null : {
      search: searchQuery || undefined,
      categoryId,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds.join(",") : undefined,
      page,
      limit: 20,
    }
  );

  const products = isFirstFetch ? initialProducts : fetchedProducts;
  const total = isFirstFetch ? initialTotal : fetchedTotal;
  const totalPages = isFirstFetch ? initialTotalPages : fetchedTotalPages;

  useEffect(() => {
    const params = { ...(categoryId ? { categoryId } : {}) };
    if (selectedTagIds.length > 0) params.tagIds = selectedTagIds.join(",");
    tagsService.list(params).then(setTags).catch(() => setTags([]));
  }, [categoryId, selectedTagIds]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  useEffect(() => {
    const sp = new URLSearchParams();
    if (selectedCategory !== "Todos") {
      const cat = categories.find((c) => String(c.id) === selectedCategory);
      if (cat) sp.set("cat", cat.slug);
    }
    if (selectedTagIds.length > 0) sp.set("tags", selectedTagIds.join(","));
    if (searchQuery) sp.set("q", searchQuery);
    if (page > 1) sp.set("page", String(page));
    router.replace(sp.toString() ? `?${sp.toString()}` : window.location.pathname, { scroll: false });
  }, [selectedCategory, selectedTagIds, searchQuery, page]);

  const hasActiveFilters = searchQuery || selectedCategory !== "Todos" || selectedTagIds.length > 0;

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const handleCategoryChange = (category) => {
    setPage(1);
    setSelectedTagIds([]);
    if (category === "Todos") {
      setSelectedCategory("Todos");
    } else {
      const cat = categories.find((c) => c.name === category);
      if (cat) setSelectedCategory(String(cat.id));
    }
  };

  const handleToggleTag = (tagValueId, tagId) => {
    setPage(1);
    const tagGroup = tags.find((t) => t.id === tagId);
    const groupValueIds = tagGroup ? tagGroup.values.map((v) => v.id) : [];
    setSelectedTagIds((prev) => {
      const existingInGroup = prev.find((id) => groupValueIds.includes(id));
      if (existingInGroup === tagValueId) return prev.filter((id) => id !== tagValueId);
      if (existingInGroup) return prev.map((id) => (id === existingInGroup ? tagValueId : id));
      return [...prev, tagValueId];
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todos");
    setSelectedTagIds([]);
    setPage(1);
  };

  const whatsappNumber = store?.whatsapp_number || "";
  const categoryLabels = ["Todos", ...categories.map((c) => c.name)];

  return (
    <>
      {/* ══ HERO ══ */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "5rem",
          paddingBottom: "1rem",
        }}
      >
        <LeafDeco
          className="absolute top-6 right-[6%] w-28 h-36 text-[var(--color-secondary)] hidden lg:block pointer-events-none"
          style={{ opacity: 0.12 }}
        />
        <LeafDeco
          className="absolute bottom-4 left-[3%] w-16 h-20 text-[var(--color-primary)] hidden lg:block pointer-events-none"
          style={{
            opacity: 0.15,
            transform: "rotate(15deg)",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-px w-8"
              style={{ backgroundColor: "var(--color-primary)" }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: "var(--color-primary)" }}
            >
              Catálogo
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "var(--color-text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: "32rem",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ══ CONTENIDO ══ */}
      <section className="bg-white pb-20 px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8 min-h-[calc(100vh-8rem)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
            {/* Sidebar */}
            <div className="w-72 flex-shrink-0">
              {isFilterOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
                  onClick={() => setIsFilterOpen(false)}
                />
              )}

              <aside
                className={`fixed lg:static inset-y-0 left-0 z-[70] lg:z-auto w-72 bg-[var(--color-surface)] lg:bg-transparent border-r lg:border-r-0 border-[var(--color-border)] transform transition-transform duration-300 lg:transform-none ${
                  isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
              >
                <div className="flex flex-col h-full p-6 lg:p-0 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6 lg:hidden">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      Filtrar por
                    </h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <button
                      onClick={() => setOpenCategories(!openCategories)}
                      className="flex items-center justify-between w-full text-left mb-3"
                    >
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-body)' }}>
                        Categorías
                      </h3>
                      <ChevronDown className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${openCategories ? 'rotate-180' : ''}`} />
                    </button>
                    {openCategories && (
                      <div className="space-y-2">
                        {categoryLabels.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              (selectedCategory === "Todos" ? "Todos" : categories.find((c) => String(c.id) === selectedCategory)?.name || "Todos") === category
                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20'
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]/10'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {tags.length > 0 && (
                    <div>
                      <button
                        onClick={() => setOpenTags(!openTags)}
                        className="flex items-center justify-between w-full text-left mb-3"
                      >
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-body)' }}>
                          Etiquetas
                        </h3>
                        <ChevronDown className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${openTags ? 'rotate-180' : ''}`} />
                      </button>
                      {openTags && (
                        <TagFilter
                          tags={tags}
                          selectedTagIds={selectedTagIds}
                          onToggleTag={handleToggleTag}
                        />
                      )}
                    </div>
                  )}
                </div>
              </aside>
            </div>

            <div className="flex-1">
              <div className="max-md:sticky max-md:top-[calc(4rem+12px)] max-md:z-30 mb-6">
                <div className="flex flex-row gap-3 items-center">
                  <div className="flex-1">
                    <SearchBar
                      value={searchQuery}
                      onChange={(v) => {
                        setSearchQuery(v);
                        setPage(1);
                      }}
                      placeholder="Buscar productos..."
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden shrink-0 h-11 flex items-center gap-2 px-3 font-medium text-sm transition-all duration-200"
                    style={{
                      borderRadius: "2rem",
                      border: "1px solid var(--color-primary)",
                      color: "var(--color-primary)",
                      backgroundColor: "var(--color-card)",
                    }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filtros</span>
                  </button>
                </div>
              </div>

              {selectedTagIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTagIds.map(id => {
                    let label = '';
                    for (const tag of tags) {
                      const found = tag.values.find(v => v.id === id);
                      if (found) { label = `${tag.name}: ${found.value}`; break; }
                    }
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          const tagGroup = tags.find(t => t.values.some(v => v.id === id));
                          if (tagGroup) handleToggleTag(id, tagGroup.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: 'var(--color-primary-light)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {label}
                        <X className="w-3 h-3" />
                      </button>
                    );
                  })}
                </div>
              )}

              {hasActiveFilters && (
                <div className="flex items-center justify-between mb-5">
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {total}
                    </span>{" "}
                    producto{total !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                    style={{ color: "var(--color-primary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-primary-light)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {clearFilters}
                  </button>
                </div>
              )}

              {loading && !isFirstFetch ? (
                <LoadingGrid />
              ) : products.length > 0 ? (
                <>
                  <ProductGrid products={products} />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <EmptyState
                  searchQuery={searchQuery}
                  whatsappNumber={whatsappNumber}
                  onClear={handleClearFilters}
                  noResults={noResults}
                  clearFilters={clearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
