import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_STORE_URL || 'https://vitalcerresistencia.com.ar'
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin/' },
      { userAgent: '*', disallow: '/api/' },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
