'use client'

import { useState, useEffect } from 'react'
import { productsService } from '@/services/storeService'

export function useProducts(params = {}) {
  const [data, setData] = useState({ products: [], total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    productsService.list(params)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { ...data, loading }
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    productsService.getBySlug(slug)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  return { product, loading }
}

export function useRelatedProducts(categoryId, excludeId) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (!categoryId) return
    productsService.list({ categoryId, limit: 10 })
      .then((data) => {
        const filtered = data.products.filter((p) => String(p.id) !== String(excludeId))
        setProducts(filtered)
      })
      .catch(() => {})
  }, [categoryId, excludeId])

  return { products }
}
