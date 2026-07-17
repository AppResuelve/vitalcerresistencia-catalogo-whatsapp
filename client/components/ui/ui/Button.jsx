import { useStore } from "../../context/StoreContext";

/* ─────────────────────────────────────────────────────────────────────────
   ButtonPrimary
   Acción principal. Rojo sólido + shadow roja en hover.
   Sin gradiente — el gradiente rojo→amarillo distorsiona la paleta.
───────────────────────────────────────────────────────────────────────── */
export function ButtonPrimary({ children, className = "", ...props }) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-xl
        bg-[var(--color-primary)] text-white font-semibold text-sm
        hover:bg-[var(--color-primary-hover)]
        hover:-translate-y-0.5
        hover:shadow-[0_6px_20px_rgba(199,4,4,0.35)]
        active:translate-y-0 active:shadow-none
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ButtonSecondary
   Acción secundaria. Outline rojo translúcido, hover relleno suave.
   No usa borde gris genérico — se mantiene en paleta.
───────────────────────────────────────────────────────────────────────── */
export function ButtonSecondary({ children, className = "", ...props }) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-xl
        border-2 border-[var(--color-primary)]/40
        text-[var(--color-primary)] font-semibold text-sm
        bg-transparent
        hover:border-[var(--color-primary)]
        hover:bg-[var(--color-primary)]/6
        hover:-translate-y-0.5
        active:translate-y-0
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ButtonWhatsApp
   Amarillo con texto oscuro — el verde de WA no va con la paleta.
   El amarillo acá funciona como "acción destacada secundaria",
   igual que el botón del CTA en el home.
───────────────────────────────────────────────────────────────────────── */
export function ButtonWhatsApp({ children, className = "", ...props }) {
  const { store } = useStore();
  const whatsappNumber =
    (store?.whatsapp_number || "").replace(/\D/g, "") || "";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-xl
        bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-semibold text-sm
        hover:bg-[var(--color-secondary-muted)]
        hover:-translate-y-0.5
        hover:shadow-[0_6px_20px_rgba(239,242,58,0.4)]
        active:translate-y-0 active:shadow-none
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      <WhatsAppIcon className="w-5 h-5 shrink-0" />
      {children}
    </a>
  );
}

/* ── Ícono WhatsApp inline (no depende de lucide) ── */
function WhatsAppIcon({ className = "" }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
