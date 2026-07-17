const BASE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://vitalcerresistencia.com.ar'

export const baseMetadata = {
  title: {
    default: 'Vitalcer Resistencia — Natural Market',
    template: `%s — Vitalcer Resistencia`,
  },
  description: 'Alimentación consciente y productos naturales en Resistencia, Chaco',
  icons: [{ url: '/logotipo.png' }],
  openGraph: {
    siteName: 'Vitalcer Resistencia',
    images: [`${BASE_URL}/og-image.jpg`],
  },
}

export function productMetadata(product: any) {
  const desc = product?.description?.substring(0, 155)
  return {
    title: product?.name,
    description: desc,
    alternates: { canonical: `${BASE_URL}/productos/${product?.slug}` },
    openGraph: {
      title: product?.name,
      description: desc,
      images: product?.images?.[0] ? [product.images[0]] : undefined,
      url: `${BASE_URL}/productos/${product?.slug}`,
    },
  }
}
