// @ts-nocheck
"use client";

import { MessageCircle } from "lucide-react";
import { siteData } from "@/data/siteData";

export function FloatingWhatsAppButton({ onClick }) {
  const defaultPhone = siteData.sucursales[0]?.phone || "";

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={`https://wa.me/${defaultPhone}?text=${encodeURIComponent("Hola! Quiero consultar por un producto.")}`}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center md:justify-start gap-2 p-4 md:p-3 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 md:w-5 md:h-5" />
      <span className="hidden md:inline">Contactanos</span>
    </a>
  );
}
