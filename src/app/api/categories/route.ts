// src/app/api/categories/route.ts

import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import slugify from 'slugify'

export async function GET() {
  const categories = await prisma.category.findMany()
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const { name, parentId } = await req.json()
  const slug = slugify(name, { lower: true })

  if (parentId) {
    const sub = await prisma.subcategory.create({
      data: {
        name,
        slug,
        categoryId: parentId,
      },
    })
    return NextResponse.json(sub)
  } else {
    const cat = await prisma.category.create({
      data: {
        name,
        slug,
      },
    })
    return NextResponse.json(cat)
  }
}
