'use client'

import { useState, Suspense } from "react"
import { usePathname } from "next/navigation"
import { StoreProvider } from "@/context/StoreContext"
import { CartProvider } from "@/context/CartContext"
import { Navbar } from "@/components/store/Navbar"
import { Footer } from "@/components/store/Footer"
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton"
import { ScrollToTop } from "@/components/ScrollToTop"
import { CartDrawer } from "@/components/store/CartDrawer"
import SucursalModal from "@/components/SucursalModal"

function StoreInner({ children }: { children: React.ReactNode }) {
  const [showSucursalModal, setShowSucursalModal] = useState(false)
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Suspense fallback={<div className="h-16" />}>
          <Navbar heroMode={isHome} onOpenModal={() => setShowSucursalModal(true)} onOpenCart={() => setShowCartDrawer(true)} />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <FloatingWhatsAppButton onClick={() => setShowSucursalModal(true)} />
      <SucursalModal open={showSucursalModal} onClose={() => setShowSucursalModal(false)} />
      <CartDrawer open={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
    </>
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
