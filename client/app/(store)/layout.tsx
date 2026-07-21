'use client'

import { useState, Suspense, useCallback } from "react"
import { usePathname } from "next/navigation"
import { StoreProvider } from "@/context/StoreContext"
import { CartProvider } from "@/context/CartContext"
import { OrderContext } from "@/context/OrderContext"
import { Navbar } from "@/components/store/Navbar"
import { Footer } from "@/components/store/Footer"
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton"
import { ScrollToTop } from "@/components/ScrollToTop"
import { CartDrawer } from "@/components/store/CartDrawer"
import SucursalModal from "@/components/SucursalModal"

function StoreInner({ children }: { children: React.ReactNode }) {
  const [showSucursalModal, setShowSucursalModal] = useState(false)
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const [pendingWhatsAppMessage, setPendingWhatsAppMessage] = useState<string | null>(null)
  const pathname = usePathname()
  const isHome = pathname === '/'

  const handleOrderConfirmed = useCallback((data: { sucursal: any; deliveryMethod: string; name?: string; address?: string }) => {
    const baseMessage = pendingWhatsAppMessage || encodeURIComponent("Hola! Quiero consultar por un producto.")
    let message = baseMessage

    if (data.deliveryMethod === "delivery" && data.name && data.address) {
      const decoded = decodeURIComponent(baseMessage)
      const deliverySection = `\n\n📦 *Datos de envío:*\n👤 Nombre: ${data.name}\n📍 Dirección: ${data.address}`
      message = encodeURIComponent(decoded + deliverySection)
    }

    window.open(
      `https://wa.me/${data.sucursal.phone}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    )
    setShowSucursalModal(false)
    setPendingWhatsAppMessage(null)
  }, [pendingWhatsAppMessage])

  const requestOrder = useCallback((message: string) => {
    setPendingWhatsAppMessage(message)
    setShowCartDrawer(false)
    setShowSucursalModal(true)
  }, [])

  return (
    <OrderContext.Provider value={{ requestOrder }}>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Suspense fallback={<div className="h-16" />}>
          <Navbar heroMode={isHome} onOpenModal={() => setShowSucursalModal(true)} onOpenCart={() => setShowCartDrawer(true)} />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <FloatingWhatsAppButton onClick={() => setShowSucursalModal(true)} />
      <SucursalModal
        open={showSucursalModal}
        onClose={() => { setShowSucursalModal(false); setPendingWhatsAppMessage(null); }}
        whatsappMessage={pendingWhatsAppMessage}
        onOrderConfirmed={pendingWhatsAppMessage ? handleOrderConfirmed : undefined}
      />
      <CartDrawer
        open={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        onRequestOrder={requestOrder}
      />
    </OrderContext.Provider>
  )
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <CartProvider>
        <StoreInner>{children}</StoreInner>
      </CartProvider>
    </StoreProvider>
  )
}
