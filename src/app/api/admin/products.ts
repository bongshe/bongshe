// src\app\api\admin\products\route.ts

import { prisma } from '@/app/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import slugify from 'slugify'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')

  const {
    title,
    price,
    stock,
    featuredImage,
    images,
    description,
    categoryId,
    subcategoryId,
    userId, // Make sure this is provided in request
  } = req.body

  // Enhanced validation
  const requiredFields = ['title', 'price', 'stock', 'featuredImage', 'images', 'description', 'categoryId', 'userId'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      fields: missingFields 
    })
  }

  const slug = slugify(title, { lower: true })

  try {
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        stock,
        featuredImage,
        galleryImages: images,
        // Connect relations instead of using scalar IDs
        category: {
          connect: { id: categoryId }
        },
        user: {
          connect: { id: userId }
        },
        // Conditionally connect subcategory if provided
        ...(subcategoryId && {
          subcategory: {
            connect: { id: subcategoryId }
          }
        })
      },
    })

    res.status(201).json(product)
  } catch (error: any) {
    console.error('Product creation error:', error)
    res.status(500).json({ 
      error: 'Server error',
      message: error.message || 'Unknown error'
    })
  }
}