// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar({ heroMode = false, onOpenModal, onOpenCart }) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = usePathname();
  const closeTimer = useRef(null);
  const { totalItems } = useCart();
  const { categories } = useStore();
  const searchParams = useSearchParams();
  const currentCat = searchParams?.get("cat") || null;
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);

  const handleProductsEnter = () => {
    clearTimeout(closeTimer.current);
    setDesktopProductsOpen(true);
  };
  const handleProductsLeave = () => {
    closeTimer.current = setTimeout(() => setDesktopProductsOpen(false), 200);
  };

  const isTransparent = heroMode && !scrolled;
  const isActive = (path) => location === path;

  useEffect(() => {
    if (!heroMode) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [heroMode]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const bgStyle = {
    backgroundColor: isTransparent ? "transparent" : "var(--color-surface)",
    borderBottom: isTransparent
      ? "1px solid rgba(255, 255, 255, 0)"
      : "1px solid var(--color-border)",
  };

  const textColor = isTransparent
    ? "rgba(255,255,255,0.92)"
    : "var(--color-text-secondary)";
  const textColorActive = isTransparent ? "#ffffff" : "var(--color-primary)";

  const CartButton = () => (
    <button
      onClick={onOpenCart}
      className="relative p-2 rounded-lg transition-colors"
      style={{
        color: isTransparent ? "#ffffff" : "var(--color-text-secondary)",
      }}
      aria-label="Abrir carrito"
    >
      <ShoppingCart className="w-5 h-5" />
      <span
        className="absolute -top-1 -right-1 w-4.5 h-4.5 items-center justify-center rounded-full text-[10px] font-bold"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "#ffffff",
          minWidth: "18px",
          height: "18px",
          display: totalItems > 0 ? 'flex' : 'none',
        }}
      >
        {totalItems > 99 ? "99+" : totalItems}
      </span>
    </button>
  );

  return (
    <>
      {/* Degradé para legibilidad del logo sobre el hero */}
      {isTransparent && (
        <div
          className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
          style={{
            height: "128px",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
          }}
          aria-hidden="true"
        />
      )}

      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={bgStyle}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <img
                src="/logotipo.png"
                alt="Vitalcer Resistencia"
                className="h-14 w-auto object-contain"
              />
              <span
                className="inline text-xs uppercase tracking-[0.15em]"
                style={{
                  color: textColor,
                  lineHeight: 1.3,
                }}
              >
                Resistencia
              </span>
            </Link>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((item) => {
                const isProducts = item.href === "/productos";
                const hasCategories = isProducts && categories.length > 0;

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={hasCategories ? handleProductsEnter : undefined}
                    onMouseLeave={hasCategories ? handleProductsLeave : undefined}
                  >
                    <Link
                      href={item.href}
                      className="relative inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-300 group"
                      style={{ color: isActive(item.href) ? textColorActive : textColor }}
                    >
                      {item.label}
                      {hasCategories && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${desktopProductsOpen ? "rotate-180" : ""}`} />
                      )}
                    </Link>
                    {hasCategories && (
                      <div
                        className="absolute top-full left-0 mt-2 w-48 py-2 rounded-xl z-50"
                        style={{
                          opacity: desktopProductsOpen ? 1 : 0,
                          transform: desktopProductsOpen ? "translateY(0)" : "translateY(-6px)",
                          pointerEvents: desktopProductsOpen ? "auto" : "none",
                          transition: "opacity 0.15s ease, transform 0.15s ease",
                          backgroundColor: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        <Link
                          href="/productos"
                          className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-primary-light)]"
                          style={{ color: !currentCat ? "var(--color-primary)" : "var(--color-text-secondary)" }}
                        >
                          Todo
                        </Link>
                        {categories.map((cat) => {
                          const isCurrentCat = currentCat === cat.slug || currentCat === cat.name;
                          return (
                            <Link
                              key={cat.id}
                              href={`/productos?cat=${encodeURIComponent(cat.slug || cat.name)}`}
                              className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-primary-light)]"
                              style={{ color: isCurrentCat ? "var(--color-primary)" : "var(--color-text-secondary)" }}
                            >
                              {cat.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cart + hamburger */}
            <div className="flex items-center gap-1">
              {/* Mobile: cart button visible, left of hamburger */}
              <div className="md:hidden">
                <CartButton />
              </div>

              {/* Desktop: cart button */}
              <div className="hidden md:block">
                <CartButton />
              </div>

              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{
                  color: isTransparent ? "#ffffff" : "var(--color-text-primary)",
                }}
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── SIDEBAR MÓVIL ── */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: "var(--color-backdrop, rgba(0,0,0,0.6))" }}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: "var(--color-surface)",
          borderLeft: "1px solid var(--color-border)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-2">
            <img
              src="/logotipo.png"
              alt="Vitalcer"
              className="h-8 w-auto object-contain"
            />
            <span
              className="text-xs uppercase tracking-[0.15em]"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              Resistencia
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {NAV_LINKS.map((item) => {
              const isProducts = item.href === "/productos";
              const hasSubitems = isProducts && categories.length > 0;

              return (
                <li key={item.href}>
                  {hasSubitems ? (
                    <div>
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          color: isActive(item.href) ? "var(--color-primary)" : "var(--color-text-secondary)",
                        }}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{
                              backgroundColor: isActive(item.href) ? "var(--color-primary)" : "var(--color-border)",
                            }}
                          />
                          {item.label}
                        </span>
                        <ChevronDown
                          className="w-4 h-4 transition-transform"
                          style={{ transform: mobileProductsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                      </button>
                      {mobileProductsOpen && (
                        <div className="ml-6 mt-1 space-y-0.5">
                          <Link
                            href="/productos"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors"
                            style={{
                              color: !currentCat && isActive(item.href) ? "var(--color-primary)" : "var(--color-text-secondary)",
                            }}
                          >
                            Todo
                          </Link>
                          {categories.map((cat) => {
                            const isCurrentCat = currentCat === cat.slug || currentCat === cat.name;
                            return (
                              <Link
                                key={cat.id}
                                href={`/productos?cat=${encodeURIComponent(cat.slug || cat.name)}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors"
                                style={{
                                  color: isCurrentCat ? "var(--color-primary)" : "var(--color-text-secondary)",
                                  backgroundColor: isCurrentCat ? "var(--color-primary-light)" : "transparent",
                                }}
                              >
                                {cat.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        color: isActive(item.href) ? "var(--color-primary)" : "var(--color-text-secondary)",
                        backgroundColor: isActive(item.href) ? "var(--color-primary-light)" : "transparent",
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{
                          backgroundColor: isActive(item.href) ? "var(--color-primary)" : "var(--color-border)",
                        }}
                      />
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
