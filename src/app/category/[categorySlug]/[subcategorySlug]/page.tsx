// src/app/category/[categorySlug]/[subcategorySlug]/page.tsx

import { prisma } from '@/app/lib/prisma'
import ProductCard from '@/components/ProductCard'
import type { Metadata } from 'next/types'
import type { Product } from '@prisma/client'

type PageParams = {
  params: {
    categorySlug: string;
    subcategorySlug: string;
  };
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const subcategory = await prisma.subcategory.findFirst({
    where: {
      slug: params.subcategorySlug,
      category: { slug: params.categorySlug },
    },
    select: {
      name: true,
      category: {
        select: { name: true },
      },
    },
  });

  return {
    title: subcategory
      ? `${subcategory.category.name} - ${subcategory.name}`
      : 'Subcategory Not Found',
    description: subcategory
      ? `Browse products in ${subcategory.name} subcategory`
      : 'Subcategory not found',
  };
}

export default async function SubcategoryPage({ params }: PageParams) {
  const products = await prisma.product.findMany({
    where: {
      subcategory: {
        slug: params.subcategorySlug,
        category: { slug: params.categorySlug },
      },
    },
  });

  return (
    <div>
      <h1>Products in {params.subcategorySlug}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}