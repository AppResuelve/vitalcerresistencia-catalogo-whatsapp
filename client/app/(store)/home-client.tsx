// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Clock,
  Leaf,
  Flame,
  Sprout,
  Wheat,
  FlaskConical,
  Cookie,
} from "lucide-react";
import { content, siteData } from "@/data/siteData";
import { BannerCarousel } from "@/components/store/BannerCarousel";
import { useInView } from "@/hooks/useInView";

const CATEGORIES = [
  {
    name: "Frutos Secos",
    icon: Leaf,
    description: "Nueces, almendras, avellanas y más",
    image: "/categorias/frutos-secos.jpeg",
  },
  {
    name: "Condimentos y Especies",
    icon: Flame,
    description: "Especias, condimentos y sazonadores",
    image: "/categorias/condimentos-especies.jpeg",
  },
  {
    name: "Hierbas",
    icon: Sprout,
    description: "Hierbas medicinales y aromáticas",
    image: "/categorias/hierbas.jpeg",
  },
  {
    name: "Semillas y Legumbres",
    icon: Wheat,
    description: "Semillas, legumbres y granos variados",
    image: "/categorias/semillas-legumbres.jpeg",
  },
  {
    name: "Laboratorio",
    icon: FlaskConical,
    description: "Vitaminas, minerales y suplementos",
    image: "/categorias/laboratorio.jpeg",
  },
  {
    name: "Kiosco",
    icon: Cookie,
    description: "Golosinas, bebidas y snacks saludables",
    image: "/categorias/kiosco.jpeg",
  },
];

function CategoryCard({ cat }: { cat: (typeof CATEGORIES)[number] }) {
  const { ref, isInView } = useInView();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <Link
      ref={ref}
      href={`/productos?cat=${encodeURIComponent(cat.name)}`}
      className={`category-card relative rounded-2xl overflow-hidden ${isMobile && isInView ? "revealed" : ""}`}
      style={{
        border: "1px solid var(--color-border)",
        minHeight: "10rem",
      }}
    >
      {/* Background image — always present */}
      <img
        src={cat.image}
        alt={cat.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Backdrop — covers image, animates up to reveal */}
      <div className="card-backdrop absolute inset-0" />
      {/* Content — always on top */}
      <div
        className="relative z-10 p-6 flex flex-col justify-between"
        style={{ minHeight: "11rem" }}
      >
        <div>
          <div className="card-title-group inline-flex items-center gap-3 rounded-full px-4 py-2 mb-6">
            <cat.icon
              className="w-5 h-5 shrink-0"
              style={{ color: "var(--color-primary)" }}
            />
            <h3
              className="text-base font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {cat.name}
            </h3>
          </div>
          <p
            className="card-description text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {cat.description}
          </p>
        </div>
        <div className="card-cta absolute bottom-2 right-2 rounded-full flex items-center gap-2 text-sm color-text-primary font-medium">
          Ver
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default function HomeClient() {
  const {
    hero,
    featuredTitle,
    featuredSubtitle,
    categoriesTitle,
    categoriesSubtitle,
    cta,
  } = content.home;

  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex overflow-hidden">
        <img
          src="/hero/hero-image.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(26,26,26,0.55)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-24 flex flex-col min-h-[92vh]">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span
              className="text-lg md:text-2xl font-medium bg-black/10 max-md:bg-black/80 px-4 py-2 max-md:p-0 max-md:px-2 rounded-full tracking-[0.25em] uppercase block mb-8 shadow-lg shadow-black/15 max-md:shadow-black"
              style={{ color: "var(--color-primary)" }}
            >
              {hero.badge}
            </span>
            <h1
              style={{
                fontFamily: "var(--font-logo)",
                fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
                fontWeight: 400,
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                marginBottom: "1.5rem",
              }}
            >
              {hero.title}{" "}
              <span style={{ color: "var(--color-primary)" }}>
                {hero.highlightedText}
              </span>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                maxWidth: "34rem",
                fontWeight: 300,
              }}
            >
              {hero.subtitle}
            </p>
            <div className="hidden md:block mt-8">
              <Link
                href={hero.primaryButtonLink}
                className="inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  padding: "0.9rem 2.25rem",
                  borderRadius: "2rem",
                  backgroundColor: "var(--color-primary)",
                  color: "#ffffff",
                  boxShadow: "0 8px 30px rgba(100,180,1,0.25)",
                }}
              >
                {hero.primaryButtonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="md:hidden w-full flex justify-center pb-8">
            <Link
              href={hero.primaryButtonLink}
              className="inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-300 hover:-translate-y-0.5"
              style={{
                padding: "0.9rem 2.25rem",
                borderRadius: "2rem",
                backgroundColor: "var(--color-primary)",
                color: "#ffffff",
                boxShadow: "0 8px 30px rgba(100,180,1,0.25)",
              }}
            >
              {hero.primaryButtonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BANNER CARRUSEL ── */}
      <BannerCarousel
        images={[
          "/banner/banner1.webp",
          {
            desktop: "/banner/banner2.webp",
            mobile: "/banner/banner2mobile.webp",
          },
          // "/banner/banner3.webp",
        ]}
      />

      {/* ── CATEGORÍAS ── */}
      <section
        className="px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--color-surface)",
          paddingTop: "6rem",
          paddingBottom: "6rem",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase block mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              {categoriesTitle}
            </span>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
              }}
            >
              {categoriesSubtitle}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.name} cat={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SUCURSALES ── */}
      <section
        className="px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "6rem",
          paddingBottom: "6rem",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase block mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              Encontranos
            </span>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
              }}
            >
              Nuestras sucursales
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {siteData.sucursales.map((sucursal) => (
              <div
                key={sucursal.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {sucursal.image && (
                  <img
                    src={sucursal.image}
                    alt={sucursal.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {sucursal.name}
                  </h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {sucursal.address}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: "var(--color-primary)" }}
                      />
                      <span
                        className="text-sm whitespace-pre-line"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {sucursal.horarios}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${sucursal.phone}?text=${encodeURIComponent("Hola! Quiero consultar por un producto.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "#ffffff",
                    }}
                  >
                    WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "24rem" }}
      >
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url(/categorias/frutos-secos.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url(/categorias/condimentos-especies.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url(/categorias/hierbas.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="hidden md:block w-full h-full"
            style={{
              backgroundImage: "url(/categorias/semillas-legumbres.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          aria-hidden="true"
        />
        <div
          className="relative z-10 flex flex-col items-center justify-start h-full gap-10 px-4 sm:px-6 lg:px-8 py-12"
          style={{ minHeight: "24rem" }}
        >
          <h2
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#ffffff",
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              textAlign: "center",
            }}
          >
            {cta.title}
          </h2>
          <Link
            href={cta.buttonLink}
            className="inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{
              padding: "1rem 2.5rem",
              borderRadius: "2rem",
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
              boxShadow: "0 8px 30px rgba(100,180,1,0.25)",
            }}
          >
            {cta.buttonText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
