// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { X, MapPin, Clock, MessageCircle } from "lucide-react";
import { siteData } from "@/data/siteData";

export default function SucursalModal({ open, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleSelect = (sucursal) => {
    const message = encodeURIComponent(
      "Hola! Quiero consultar por un producto."
    );
    window.open(
      `https://wa.me/${sucursal.phone}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sucursal-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-backdrop, rgba(0,0,0,0.6))" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <h3
            id="sucursal-modal-title"
            style={{
              fontSize: "1.25rem",
              fontWeight: 400,
              color: "var(--color-text-primary)",
            }}
          >
            ¿A qué sucursal escribís?
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1.5 transition-colors"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de sucursales */}
        <div className="px-6 py-5 space-y-3">
          {siteData.sucursales.map((sucursal) => (
            <button
              key={sucursal.id}
              onClick={() => handleSelect(sucursal)}
              className="w-full rounded-xl p-4 text-left transition-all duration-200"
              style={{
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-background)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.backgroundColor =
                  "var(--color-primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.backgroundColor =
                  "var(--color-background)";
              }}
            >
              <span
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                {sucursal.name}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {sucursal.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {sucursal.horarios}
                  </span>
                </div>
              </div>
            </button>
          ))}

          <p
            className="text-xs text-center pt-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            Te redirigimos a WhatsApp con el número de la sucursal elegida.
          </p>
        </div>
      </div>
    </div>
  );
}
