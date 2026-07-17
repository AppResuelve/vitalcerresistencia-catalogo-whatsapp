import { MessageCircle } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

export function FloatingWhatsAppButton({ className = '' }) {
  const { store } = useStore()
  const whatsappNumber = (store?.whatsapp_number || '').replace(/\D/g, '') || ''

  if (!whatsappNumber) return null

  const whatsappLink = `https://wa.me/${whatsappNumber}`

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center md:justify-start gap-2 p-4 md:p-3 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${className}`}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 md:w-5 md:h-5" />
      <span className="hidden md:inline">Contactanos</span>
    </a>
  )
}