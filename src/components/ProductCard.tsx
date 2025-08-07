'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@prisma/client'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.featuredImage || (product.galleryImages && product.galleryImages[0]) || '/placeholder.jpg'

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
        <div className="relative w-full h-56">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="text-sm text-gray-600 truncate">{product.description}</p>
          <p className="mt-2 font-bold text-primary">৳{product.price}</p>
        </div>
      </div>
    </Link>
  )
}