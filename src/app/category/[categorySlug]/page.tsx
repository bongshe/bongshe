// src/app/category/[categorySlug]/page.tsx



import { notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import ProductCard from '@/components/ProductCard'

export default async function CategoryPage({ params }: { params: { categorySlug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.categorySlug },
    include: {
      subcategories: {
        include: {
          products: true
        }
      },
      products: true
    }
  })

  if (!category) return notFound()

  const allProducts = [
    ...category.products,
    ...category.subcategories.flatMap((sc) => sc.products)
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
