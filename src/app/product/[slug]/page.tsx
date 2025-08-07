// src/app/product/[slug]/page.tsx

import { notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import ImageSlider from '@/components/ImageSlider'
import { JSONContent } from '@tiptap/react'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, subcategory: true }
  })

  if (!product) return notFound()

  const allImages = [
    { url: product.featuredImage },
    ...(product.galleryImages?.map(url => ({ url })) || [])
  ]

  // Parse the description string to JSONContent
  let descriptionContent: JSONContent | null = null
  try {
    descriptionContent = JSON.parse(product.description)
  } catch (error) {
    console.error('Failed to parse product description:', error)
    // Fallback to a simple text node if parsing fails
    descriptionContent = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: product.description }] }]
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <ImageSlider images={allImages} />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.price} ৳</p>
          <RichTextRenderer content={descriptionContent} />

          <div className="mt-6">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}