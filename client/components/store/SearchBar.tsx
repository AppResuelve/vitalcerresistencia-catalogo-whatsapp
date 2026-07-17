'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function SearchBar({ value, onChange, placeholder = 'Buscar productos...', onFocus, onBlur }) {
  const [ignoreBlur, setIgnoreBlur] = useState(false)

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={() => {
          if (!ignoreBlur) onBlur()
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-md border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all pl-11 h-11"
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {value && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIgnoreBlur(true)
            onChange('')
            setTimeout(() => setIgnoreBlur(false), 100)
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}