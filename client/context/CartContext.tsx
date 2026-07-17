'use client'

import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { siteData } from '@/data/siteData'
import { useStore } from '@/context/StoreContext'

const CartContext = createContext<any>(null)

const STORAGE_KEY = siteData.cart.persistenceKey || 'appresuelve-cart'

function itemKey(productId, skuId) {
  return `${productId}-${skuId || 0}`
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, skuId } = action.payload
      const quantityToAdd = action.payload.quantity || 1
      const key = itemKey(productId, skuId)
      const existingIndex = state.items.findIndex(
        (item) => item.key === key
      )

      if (existingIndex >= 0) {
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantityToAdd,
        }
        return { ...state, items: newItems }
      }

      return {
        ...state,
        items: [
          ...state.items,
          { key, productId, skuId: skuId || null, quantity: quantityToAdd },
        ],
      }
    }

    case 'ADD_SERVICE_ITEM': {
      const { serviceId, serviceSlug, serviceName, variantId, variantName, variantPrice, selectedModifiers, quantity } = action.payload
      const key = `svc-${serviceId}-${variantId}-${selectedModifiers.map(m => m.id).sort().join(',')}`
      const existingIndex = state.items.findIndex(
        (item) => item.key === key
      )
      if (existingIndex >= 0) {
        const newItems = [...state.items]
        newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + quantity }
        return { ...state, items: newItems }
      }
      return { ...state, items: [...state.items, { type: 'service', key, serviceId, serviceSlug, serviceName, variantId, variantName, variantPrice, selectedModifiers, quantity }] }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.key !== action.payload.key),
      }

    case 'UPDATE_QUANTITY': {
      const { key, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.key !== key),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.key === key ? { ...item, quantity } : item
        ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const { productsMap, loading } = useStore()

  const [state, dispatch] = useReducer(cartReducer, undefined, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return { items: stored ? JSON.parse(stored) : [] }
    } catch {
      return { items: [] }
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const cartItems = useMemo(() => {
    return state.items.map((item) => {
      if (item.type === 'service') {
        const modifiersTotal = (item.selectedModifiers || []).reduce((sum, m) => sum + Number(m.price), 0)
        const unitPrice = item.variantPrice + modifiersTotal
        return { ...item, id: item.key, unitPrice, subtotal: unitPrice * item.quantity }
      }

      const product = productsMap[item.productId]
      if (!product) {
        return {
          ...item,
          id: item.key,
          name: loading ? 'Cargando...' : 'Producto',
          images: [],
          retailPrice: 0,
          unitPrice: 0,
          subtotal: 0,
          variantLabel: null,
        }
      }

      let unitPrice = Number(product.retailPrice)
      let variantLabel = null

      if (item.skuId) {
        const sku = (product.skus || []).find(s => s.id === item.skuId)
        if (sku) {
          unitPrice = Number(sku.retailPrice)
          if (sku.attributeValues?.length) {
            variantLabel = sku.attributeValues.map(v => v.value).join(' / ')
          }
          if (sku.wholesalePrice && sku.wholesaleMinQty && item.quantity >= sku.wholesaleMinQty) {
            unitPrice = Number(sku.wholesalePrice)
          }
        }
      } else if (product.wholesalePrice && product.wholesaleMinQty && item.quantity >= product.wholesaleMinQty) {
        unitPrice = Number(product.wholesalePrice)
      }

      return {
        ...item,
        ...product,
        id: item.key,
        unitPrice,
        subtotal: unitPrice * item.quantity,
        variantLabel,
      }
    })
  }, [state.items, productsMap, loading])

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = cartItems.reduce((sum, item) => sum + item.subtotal, 0)

  const addItem = (productId, quantity = 1, skuId = null) => {
    dispatch({ type: 'ADD_ITEM', payload: { productId, quantity, skuId } })
  }

  const addServiceItem = (data) => {
    dispatch({ type: 'ADD_SERVICE_ITEM', payload: data })
  }

  const removeItem = (key) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { key } })
  }

  const updateQuantity = (key, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemQuantity = (productId, skuId = null) => {
    const key = itemKey(productId, skuId)
    const item = state.items.find((item) => item.key === key)
    return item ? item.quantity : 0
  }

  const value = {
    items: cartItems,
    totalItems,
    totalPrice,
    addItem,
    addServiceItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}
