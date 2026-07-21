// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { X, MapPin, Clock, ArrowLeft } from "lucide-react";
import { siteData } from "@/data/siteData";

const inputClass = `
  w-full px-4 py-3 rounded-xl text-sm
  border border-[var(--color-border)]
  bg-[var(--color-background)]
  text-[var(--color-text-primary)]
  placeholder-[var(--color-text-muted)]
  focus:outline-none
  focus:border-[var(--color-primary)]
  focus:ring-2 focus:ring-[var(--color-primary)]/15
  transition-all duration-200
`;

export default function SucursalModal({
  open,
  onClose,
  whatsappMessage,
  onOrderConfirmed,
}) {
  const [step, setStep] = useState(1);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep(1);
      setSelectedSucursal(null);
      setName("");
      setAddress("");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleSelectSucursal = (sucursal) => {
    if (!onOrderConfirmed) {
      const message = encodeURIComponent(
        "Hola! Quiero consultar por un producto."
      );
      window.open(
        `https://wa.me/${sucursal.phone}?text=${message}`,
        "_blank",
        "noopener,noreferrer"
      );
      onClose();
      return;
    }
    setSelectedSucursal(sucursal);
    setStep(2);
  };

  const handlePickup = () => {
    onOrderConfirmed({
      sucursal: selectedSucursal,
      deliveryMethod: "pickup",
    });
    onClose();
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    onOrderConfirmed({
      sucursal: selectedSucursal,
      deliveryMethod: "delivery",
      name,
      address,
    });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sucursal-modal-title"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--color-backdrop, rgba(0,0,0,0.6))" }}
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
        {/* ═══ PASO 1 — Selección de sucursal ═══ */}
        {step === 1 && (
          <>
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

            <div className="px-6 py-5 space-y-3">
              {siteData.sucursales.map((sucursal) => (
                <button
                  key={sucursal.id}
                  onClick={() => handleSelectSucursal(sucursal)}
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
                        className="text-xs whitespace-pre-line"
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
          </>
        )}

        {/* ═══ PASO 2 — Envío o retiro ═══ */}
        {step === 2 && (
          <>
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <div>
                <span
                  className="inline-block text-xs font-bold tracking-widest uppercase mb-1"
                  style={{ color: "var(--color-primary)" }}
                >
                  {selectedSucursal?.name}
                </span>
                <h3
                  id="sucursal-modal-title"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    color: "var(--color-text-primary)",
                  }}
                >
                  ¿Cómo recibís tu pedido?
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="rounded-full p-1.5 transition-colors"
                style={{ color: "var(--color-text-muted)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3">
              {/* Retiro en sucursal */}
              <button
                onClick={handlePickup}
                className="w-full p-4 rounded-xl text-left transition-all duration-200 group"
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
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--color-primary-light)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: "var(--color-primary)" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Retiro en sucursal
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Coordinamos día y horario por WhatsApp
                    </p>
                  </div>
                  <div
                    className="transition-colors"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Envío a domicilio */}
              <button
                onClick={() => setStep(3)}
                className="w-full p-4 rounded-xl text-left transition-all duration-200 group"
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
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--color-primary-light)" }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: "var(--color-primary)" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Envío a domicilio
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Te pedimos la dirección en el siguiente paso
                    </p>
                  </div>
                  <div
                    className="transition-colors"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-1.5 pt-2 pb-1 text-xs transition-colors"
                style={{ color: "var(--color-text-muted)" }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Elegir otra sucursal
              </button>
            </div>
          </>
        )}

        {/* ═══ PASO 3 — Formulario de envío ═══ */}
        {step === 3 && (
          <>
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <div>
                <span
                  className="inline-block text-xs font-bold tracking-widest uppercase mb-1"
                  style={{ color: "var(--color-primary)" }}
                >
                  Datos de envío
                </span>
                <h3
                  id="sucursal-modal-title"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    color: "var(--color-text-primary)",
                  }}
                >
                  ¿A dónde te lo enviamos?
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="rounded-full p-1.5 transition-colors"
                style={{ color: "var(--color-text-muted)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeliverySubmit} className="px-6 py-5 space-y-4">
              <div>
                <label
                  className="block text-xs font-bold tracking-wide uppercase mb-1.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold tracking-wide uppercase mb-1.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Dirección de envío
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle Falsa 123, Buenos Aires"
                  required
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center gap-1.5 flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--color-primary)",
                  }}
                >
                  Confirmar pedido
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
