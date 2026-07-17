export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20',
    new: 'bg-[var(--color-secondary)]/20 text-yellow-700 border-[var(--color-secondary)]/40',
    sale: 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/25',
    bestseller: 'bg-[var(--color-secondary)]/15 text-yellow-700 border-[var(--color-secondary)]/30',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
