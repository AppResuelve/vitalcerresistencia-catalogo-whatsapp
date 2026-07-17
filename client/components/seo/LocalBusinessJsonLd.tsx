type StoreProps = {
  name?: string
  address?: string
  whatsapp_number?: string
  phone?: string
  description?: string
  logo_url?: string
}

export function LocalBusinessJsonLd({ store }: { store: StoreProps }) {
  const base = process.env.NEXT_PUBLIC_STORE_URL || 'https://vitalcerresistencia.com.ar'

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: store?.name,
          description: store?.description,
          telephone: store?.whatsapp_number || store?.phone,
          address: store?.address
            ? { '@type': 'PostalAddress', streetAddress: store.address, addressCountry: 'AR' }
            : undefined,
          url: base,
          image: store?.logo_url || `${base}/og-image.jpg`,
        }),
      }}
    />
  )
}
