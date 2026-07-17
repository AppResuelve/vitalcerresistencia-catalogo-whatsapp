'use client'

interface TagOptionProps {
  label: string
  selected: boolean
  disabled: boolean
  onClick: () => void
}

export function TagOption({ label, selected, disabled, onClick }: TagOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
        disabled
          ? 'opacity-40 cursor-not-allowed text-[var(--color-text-muted)]'
          : selected
            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]/10'
      }`}
    >
      <span>{label}</span>
    </button>
  )
}
