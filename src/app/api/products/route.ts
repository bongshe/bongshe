// src/app/api/products/route.ts

import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: Request) {
  const data = await req.json()
  const slug = slugify(data.title, { lower: true }) + '-' + uuidv4().slice(0, 6)

  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      galleryImages: data.images,
      featuredImage: data.featuredImage,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId || null,
      userId: data.userId, // In production, get from session
    },
  })

  return NextResponse.json(product)
}
