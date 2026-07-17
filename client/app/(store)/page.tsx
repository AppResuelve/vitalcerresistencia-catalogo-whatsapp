import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd'
import HomeClient from './home-client'

export default async function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd
        store={{
          name: 'Vitalcer Resistencia',
          description: 'Alimentación consciente y productos naturales en Resistencia, Chaco',
          address: 'Av. Paraguay 78, Resistencia, Chaco',
          whatsapp_number: '5493625217986',
        }}
      />
      <HomeClient />
    </>
  )
}
