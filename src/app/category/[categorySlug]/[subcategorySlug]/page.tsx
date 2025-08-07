// src/app/category/[categorySlug]/[subcategorySlug]/page.tsx 

import { notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma';
import ProductCard from '@/components/ProductCard';

export default async function SubcategoryPage({
  params
}: {
  params: { categorySlug: string; subcategorySlug: string }
}) {
  const subcategory = await prisma.subcategory.findFirst({
    where: {
      slug: params.subcategorySlug,
      category: { slug: params.categorySlug }
    },
    include: { products: true }
  })

  if (!subcategory) return notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{subcategory.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {subcategory.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
