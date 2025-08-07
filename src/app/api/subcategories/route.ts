// src/app/api/subcategories/route.ts


import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('categoryId')

  if (!categoryId) return NextResponse.json([])

  const subs = await prisma.subcategory.findMany({
    where: { categoryId },
  })

  return NextResponse.json(subs)
}
