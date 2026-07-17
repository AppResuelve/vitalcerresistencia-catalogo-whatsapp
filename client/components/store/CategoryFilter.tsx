'use client'
import { X } from 'lucide-react'

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  isOpen,
  onClose,
}) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden pointer-events-auto"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-[70] lg:z-auto w-72 bg-[var(--color-surface)] lg:bg-transparent border-r lg:border-r-0 border-[var(--color-border)] transform transition-transform duration-300 lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-6 lg:p-0">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Filtrar por categoría
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onSelectCategory(category)
                  onClose()
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
