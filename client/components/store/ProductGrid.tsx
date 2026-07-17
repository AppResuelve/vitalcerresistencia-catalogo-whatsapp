'use client'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products, className = '' }) {
  if (products.length === 0) {
    return null
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
