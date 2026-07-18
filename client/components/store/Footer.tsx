// @ts-nocheck
"use client";
import Link from "next/link";
import { MapPin, Clock, Phone, Mail, Navigation } from "lucide-react";
import { siteData } from "@/data/siteData";

const NAV_COLUMNS = [
  {
    title: "Navegación",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Productos", href: "/productos" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

function FooterColTitle({ children }) {
  return (
    <h4
      className="text-sm font-medium tracking-[0.2em] uppercase mb-4"
      style={{ color: "var(--color-primary)" }}
    >
      {children}
    </h4>
  );
}

function ContactItem({ icon: Icon, href, children }) {
  const inner = (
    <>
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          color: "var(--color-primary)",
        }}
      >
        <Icon className="w-3.5 h-3.5" />
      </span>
      <span
        className="text-sm leading-snug"
        style={{ color: "var(--color-text-muted)" }}
      >
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="flex items-start gap-3 transition-colors"
      >
        {inner}
      </a>
    );
  }
  return <div className="flex items-start gap-3">{inner}</div>;
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "var(--color-bg, #1A1A1A)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Marca */}
          <div className="lg:col-span-2">
            <div className="flex flex-col items-center gap-2">
              <img
                src="/logotipo.png"
                alt="Vitalcer Resistencia"
                className="h-20 w-auto object-contain"
              />
              <span
                className="text-xs uppercase tracking-[0.15em]"
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.3,
                }}
              >
                Resistencia
              </span>
              <p
                className="text-sm leading-relaxed mt-1 max-w-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Rico, sano y saludable.
              </p>
            </div>
          </div>

          {/* Col 2: Navegación */}
          {NAV_COLUMNS.map((column) => (
            <div key={column.title}>
              <FooterColTitle>{column.title}</FooterColTitle>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 3: Email */}
          <div>
            <FooterColTitle>Contacto</FooterColTitle>
            <ContactItem
              icon={Mail}
              href="mailto:vitalcer.resistencia@gmail.com"
            >
              vitalcer.resistencia@gmail.com
            </ContactItem>
          </div>
        </div>

        {/* Sucursales */}
        <div
          className="pt-8 mb-8"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <FooterColTitle>Sucursales</FooterColTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteData.sucursales.map((sucursal) => (
              <div
                key={sucursal.id}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5
                    className="font-semibold"
                    style={{
                      color: "#ffffff",
                      fontSize: "1rem",
                    }}
                  >
                    {sucursal.name}
                  </h5>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sucursal.address + ", Resistencia, Chaco, Argentina")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
                    style={{
                      color: "var(--color-primary)",
                      backgroundColor: "rgba(100,180,1,0.1)",
                    }}
                  >
                    <Navigation className="w-4 h-4" />
                    Ir
                  </a>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {sucursal.address}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span
                      className="text-sm whitespace-pre-line"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {sucursal.horarios}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <a
                      href={`https://wa.me/${sucursal.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {sucursal.phone.replace(/^549/, "+54 9 ")}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="pt-6"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p
            className="text-xs text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            © {currentYear} Vitalcer Resistencia — Natural Market. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
