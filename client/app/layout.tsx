import type { Metadata } from "next"
import { Lobster, Source_Sans_3, Bebas_Neue } from "next/font/google"
import "./globals.css"
import { baseMetadata } from "@/lib/metadata"

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading',
  display: 'swap',
})

const lobster = Lobster({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-logo',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = baseMetadata as Metadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`h-full antialiased ${bebasNeue.variable} ${lobster.variable} ${sourceSans.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
