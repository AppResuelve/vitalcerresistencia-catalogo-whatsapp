'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { settingsService, categoriesService, productsService } from '@/services/storeService'

const StoreContext = createContext<any>(null)

export function StoreProvider({ children }) {
  const [store, setStore] = useState(null)
  const [categories, setCategories] = useState([])
  const [productsMap, setProductsMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await settingsService.get()
        setStore(settings)

        const status = settings.store_status || 'active'
        if (status !== 'active') {
          setCategories([])
          setProductsMap({})
          return
        }

        const [cats, prods] = await Promise.all([
          categoriesService.list(),
          productsService.list({ limit: 1000 }),
        ])

        setCategories(cats)

        const map = {}
        prods.products.forEach((p) => {
          map[p.id] = p
        })
        setProductsMap(map)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <StoreContext.Provider value={{ store, categories, productsMap, loading }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}
