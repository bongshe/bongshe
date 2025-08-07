// src/app/actions/order.ts
'use server'

import { prisma } from '@/app/lib/prisma'

export async function createOrder(orderData) {
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
          create: orderData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase
          }))
        }
      }
    })
    
    return order
  } catch (error) {
    console.error('Order creation error:', error)
    throw new Error('Failed to create order')
  }
}