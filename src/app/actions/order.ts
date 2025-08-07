// src/app/actions/order.ts
'use server'

import { prisma } from '@/app/lib/prisma'

interface OrderItem {
  productId: string
  quantity: number
  priceAtPurchase: number
}

interface OrderData {
  userId?: string | null
  totalAmount: number
  name: string
  email: string
  phone: string
  address: string
  items: OrderItem[]
}

export async function createOrder(orderData: OrderData) {
  try {
    const order = await prisma.order.create({
      data: {
        userId: orderData.userId || null,
        totalAmount: orderData.totalAmount,
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        items: {
          create: orderData.items.map((item: OrderItem) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase
          }))
        }
      },
      include: {
        items: true
      }
    })
    
    return order
  } catch (error) {
    console.error('Order creation error:', error)
    throw new Error('Failed to create order')
  }
}