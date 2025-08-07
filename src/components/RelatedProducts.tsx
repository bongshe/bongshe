// src/components/RelatedProducts.tsx
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
}

export default async function RelatedProducts({ 
  categoryId, 
  currentProductId 
}: RelatedProductsProps) {
  // Fetch related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: categoryId,
      id: { not: currentProductId },
      stock: { gt: 0 }
    },
    take: 4,
    include: {
      category: true
    }
  })

  if (relatedProducts.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/products/${product.slug}`}
            className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={product.featuredImage}
                alt={product.title}
                fill
                className="object-contain p-4"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                {product.title}
              </h3>
              <p className="mt-1 text-lg font-semibold text-indigo-600">৳{product.price}</p>
              
              <div className="mt-2 flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    i < 4 ? 
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg> : 
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">(42)</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}