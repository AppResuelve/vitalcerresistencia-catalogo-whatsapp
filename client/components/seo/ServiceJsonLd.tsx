type ServiceProps = {
  name: string
  description?: string
  images: string[]
  price: number
  slug: string
}

export function ServiceJsonLd({ service }: { service: ServiceProps }) {
  const base = process.env.NEXT_PUBLIC_STORE_URL || 'https://vitalcerresistencia.com.ar'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    image: service.images?.[0],
    url: `${base}/servicios/${service.slug}`,
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'ARS',
      url: `${base}/servicios/${service.slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
