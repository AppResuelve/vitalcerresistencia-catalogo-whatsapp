// @ts-nocheck
"use client";

import { MapPin, Clock, Phone, Mail, MessageCircle } from "lucide-react";
import { content, siteData } from "@/data/siteData";

export default function Contact() {
  const { title, subtitle } = content.contact;

  return (
    <>
      {/* Hero */}
      <section
        className="px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "7rem",
          paddingBottom: "4rem",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <span
            className="text-xs font-medium tracking-[0.2em] uppercase block mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Contacto
          </span>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "var(--color-text-primary)",
              marginBottom: "1rem",
            }}
          >
            {title}
          </h1>
          <p
            className="max-w-xl"
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>
        </div>
      </section>

      {/* Sucursales */}
      <section
        className="px-4 sm:px-6 lg:px-8"
        style={{ paddingBottom: "6rem" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {siteData.sucursales.map((sucursal) => (
              <div
                key={sucursal.id}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: "var(--color-text-primary)",
                  }}
                >
                  {sucursal.name}
                </h3>
                <div className="space-y-3">
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
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {sucursal.horarios}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <a
                      href={`https://wa.me/${sucursal.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {sucursal.phone.replace(/^549/, "+54 9 ")}
                    </a>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${sucursal.phone}?text=${encodeURIComponent("Hola! Quiero consultar por un producto.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "#ffffff",
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="mt-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div
                className="h-px w-10"
                style={{ backgroundColor: "var(--color-border)" }}
              />
              <Mail
                className="w-4 h-4"
                style={{ color: "var(--color-primary)" }}
              />
              <div
                className="h-px w-10"
                style={{ backgroundColor: "var(--color-border)" }}
              />
            </div>
            <a
              href="mailto:vitalcer.resistencia@gmail.com"
              className="text-sm transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              vitalcer.resistencia@gmail.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
