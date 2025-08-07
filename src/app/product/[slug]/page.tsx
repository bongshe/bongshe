import { notFound } from 'next/navigation'
import ImageSlider from '@/components/ImageSlider'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { prisma } from '@/app/lib/prisma'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true, category: true, subcategory: true }
  })

  if (!product) return notFound()

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <ImageSlider images={product.images} />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.price} ৳</p>
          <RichTextRenderer content={product.description} />

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
