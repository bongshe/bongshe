// src/app/api/admin/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true, // Assuming relation is named "subcategories"
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return new NextResponse("Error fetching categories", { status: 500 });
  }
}
