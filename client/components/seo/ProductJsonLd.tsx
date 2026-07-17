type ProductProps = {
  name: string
  description?: string
  images: string[]
  price: number
  slug: string
  sku?: string
}

export function ProductJsonLd({ product }: { product: ProductProps }) {
  const base = process.env.NEXT_PUBLIC_STORE_URL || 'https://vitalcerresistencia.com.ar'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0],
    sku: product.sku || product.slug,
    url: `${base}/productos/${product.slug}`,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      url: `${base}/productos/${product.slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
