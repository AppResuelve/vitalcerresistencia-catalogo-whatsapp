"use client";

interface TagOptionProps {
  label: string;
  color?: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function TagOption({
  label,
  color,
  selected,
  disabled,
  onClick,
}: TagOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        disabled
          ? "opacity-40 cursor-not-allowed text-[var(--color-text-muted)]"
          : selected
            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]/10"
      }`}
    >
      {color && (
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      <span>{label}</span>
    </button>
  );
}
