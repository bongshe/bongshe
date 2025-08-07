// src/app/api/admin/products.ts

import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    const {
      title,
      slug,
      price,
      stock,
      featuredImage,
      galleryImages,
      description,
      categoryId,
      subcategoryId,
      status,
    } = body;

    if (
      !title ||
      !slug ||
      !price ||
      !stock ||
      !featuredImage ||
      !galleryImages ||
      !description ||
      !categoryId
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        price,
        stock,
        featuredImage,
        galleryImages,
        description,
        status: status || "draft",
        category: {
          connect: { id: categoryId },
        },
        subcategory: subcategoryId
          ? {
              connect: { id: subcategoryId },
            }
          : undefined,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Server error", message: error.message },
      { status: 500 }
    );
  }
}
