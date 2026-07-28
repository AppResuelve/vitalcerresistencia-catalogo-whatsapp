import { productsService, categoriesService, tagsService } from '@/services/storeService'
import ProductsClient from './client'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams
  const cat = typeof params.cat === 'string' ? params.cat : ''
  const tagsParam = typeof params.tags === 'string' ? params.tags : ''
  const pageParam = typeof params.page === 'string' ? params.page : ''
  const q = typeof params.q === 'string' ? params.q : ''

  let categories: any[] = []
  let category: any = null
  let initialProducts: any[] = []
  let initialTotal = 0
  let initialTotalPages = 1
  let initialTags: any[] = []
  let initialTagIds: number[] = []

  try {
    categories = await categoriesService.list()
  } catch {
    categories = []
  }

  if (cat && categories.length > 0) {
    category = categories.find((c: any) => c.slug === cat || c.name === cat) || null
  }

  try {
    const data = await productsService.list({
      categoryId: category?.id,
      tagIds: tagsParam || undefined,
      search: q || undefined,
      page: Number(pageParam) || 1,
      limit: 20,
    })
    initialProducts = data.products || []
    initialTotal = data.total || 0
    initialTotalPages = data.totalPages || 1
  } catch {
    initialProducts = []
  }

  try {
    initialTags = await tagsService.list(category ? { categoryId: category.id } : {})
  } catch {
    initialTags = []
  }

  if (tagsParam) {
    initialTagIds = tagsParam.split(',').map(Number).filter(Boolean)
  }

  return (
    <ProductsClient
      initialProducts={initialProducts}
      initialTotal={initialTotal}
      initialTotalPages={initialTotalPages}
      initialPage={Number(pageParam) || 1}
      categories={categories}
      initialCategoryId={category ? String(category.id) : 'Todos'}
      initialTags={initialTags}
      initialTagIds={initialTagIds}
      initialSearch={q}
    />
  )
}
