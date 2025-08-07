// src/app/api/admin/products/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import slugify from 'slugify'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      title,
      price,
      stock,
      featuredImage,
      images,
      description,
      categoryId,
      subcategoryId,
      userId,
    } = body

    const requiredFields = ['title', 'price', 'stock', 'featuredImage', 'images', 'description', 'categoryId', 'userId']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: 'Missing required fields',
        fields: missingFields,
      }, { status: 400 })
    }

    const slug = slugify(title, { lower: true })

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        stock,
        featuredImage,
        galleryImages: images,
        category: {
          connect: { id: categoryId },
        },
        user: {
          connect: { id: userId },
        },
        ...(subcategoryId && {
          subcategory: {
            connect: { id: subcategoryId },
          },
        }),
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
