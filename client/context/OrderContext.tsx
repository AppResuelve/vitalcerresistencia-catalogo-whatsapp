'use client'
import { createContext, useContext } from 'react'

interface OrderContextValue {
  requestOrder: (message: string) => void
}

const OrderContext = createContext<OrderContextValue>({
  requestOrder: () => {},
})

export const useOrder = () => useContext(OrderContext)
export { OrderContext }
