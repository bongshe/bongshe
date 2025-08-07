// src/app/category/[categorySlug]/[subcategorySlug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import ProductCard from '@/components/ProductCard'
import type { Metadata } from 'next'
import type { SubcategoryPageProps } from '@/types/pages'

export async function generateMetadata({
  params
}: {
  params: { categorySlug: string; subcategorySlug: string }
}): Promise<Metadata> {
  const subcategory = await prisma.subcategory.findFirst({
    where: {
      slug: params.subcategorySlug,
      category: { slug: params.categorySlug }
    },
    select: {
      name: true,
      category: {
        select: {
          name: true
        }
      }
    }
  })

  return {
    title: subcategory 
      ? `${subcategory.category.name} - ${subcategory.name}`
      : 'Subcategory Not Found',
    description: subcategory 
      ? `Browse products in ${subcategory.name} subcategory`
      : 'Subcategory not found'
  }
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const subcategory = await prisma.subcategory.findFirst({
    where: {
      slug: params.subcategorySlug,
      category: { slug: params.categorySlug }
    },
    include: {
      products: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!subcategory) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{subcategory.name}</h1>
      
      {subcategory.products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subcategory.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found in this subcategory</p>
      )}
    </div>
  )
}