import { Wrench } from 'lucide-react'

export function StoreBlocked({ status }: { status: string }) {
  const isDraft = status === 'draft'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--color-background)]">
      <div className="text-center max-w-md">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6
          ${isDraft ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
          <Wrench className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
          {isDraft ? 'Tienda en construcción' : 'Tienda en mantenimiento'}
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-2">
          {isDraft ? 'Estamos preparando algo increíble.' : 'Estamos trabajando para mejorar tu experiencia.'}
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          {isDraft ? 'Volvé pronto.' : 'Disculpá las molestias.'}
        </p>
      </div>
      <p className="mt-16 text-xs text-[var(--color-text-muted)]">
        Powered by <span className="font-semibold">AppResuelve</span>
      </p>
    </div>
  )
}
