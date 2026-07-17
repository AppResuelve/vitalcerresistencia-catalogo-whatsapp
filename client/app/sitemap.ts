import { productsService } from '@/services/storeService'

export default async function sitemap() {
  const base = 'https://vitalcerresistencia.com.ar'

  const staticPages = [
    { url: base, lastModified: new Date() },
    { url: `${base}/productos`, lastModified: new Date() },
    { url: `${base}/carrito`, lastModified: new Date() },
    { url: `${base}/contacto`, lastModified: new Date() },
  ]

  const productRes = await productsService.list({ limit: 500 }).catch(() => ({ products: [] }))

  const productPages = (productRes?.products || []).map((p: any) => ({
    url: `${base}/productos/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  }))

  return [...staticPages, ...productPages]
}
