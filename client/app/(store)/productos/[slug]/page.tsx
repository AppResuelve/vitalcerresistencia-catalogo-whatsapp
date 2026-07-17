import { productsService } from '@/services/storeService'
import { productMetadata } from '@/lib/metadata'
import { ProductJsonLd } from '@/components/seo/ProductJsonLd'
import ProductDetailClient from './client'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const product = await productsService.getBySlug(slug)
    return productMetadata(product)
  } catch { return {} }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await productsService.getBySlug(slug)
  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetailClient product={product} />
    </>
  )
}
