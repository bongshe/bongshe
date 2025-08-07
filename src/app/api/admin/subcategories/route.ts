// src/app/api/admin/subcategories/route.ts

import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, slug, categoryId } = body

  try {
    const newSubcategory = await prisma.subcategory.create({
      data: {
        name,
        slug,
        category: {
          connect: { id: categoryId },
        },
      },
    })

    return NextResponse.json(newSubcategory)
  } catch (err) {
    console.error('Error creating subcategory:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
