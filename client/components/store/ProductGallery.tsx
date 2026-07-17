'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ProductGallery({ images, productName, discountPercentage }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-[var(--color-surface)] rounded-lg flex items-center justify-center">
        <span className="text-[var(--color-text-muted)]">Sin imagen</span>
      </div>
    )
  }

  const goToPrevious = (e) => {
    e.preventDefault()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e) => {
    e.preventDefault()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-[var(--color-surface)]">
        <img
          src={images[currentIndex]}
          alt={`${productName} - Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {discountPercentage && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-[var(--color-secondary)] text-yellow-800">
              {discountPercentage}% OFF
            </span>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-background)]/80 backdrop-blur flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-background)]/80 backdrop-blur flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(index)
              }}
              className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? 'border-[var(--color-primary)]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
