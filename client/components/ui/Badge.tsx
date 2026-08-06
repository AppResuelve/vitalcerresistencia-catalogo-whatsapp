export function Badge({
  children,
  variant = "default",
  color,
  className = "",
}) {
  const variants = {
    default:
      "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20",
    new: "bg-[var(--color-secondary)]/20 text-yellow-700 border-[var(--color-secondary)]/40",
    sale: "bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/25",
    bestseller:
      "bg-[var(--color-secondary)]/15 text-yellow-700 border-[var(--color-secondary)]/30",
  };

  const colorStyle = color
    ? {
        backgroundColor: "#ffffff",
        color: color,
        borderColor: color,
      }
    : {};

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl text-sm font-semibold border ${color ? "" : variants[variant]} ${className}`}
      style={colorStyle}
    >
      {children}
    </span>
  );
}
