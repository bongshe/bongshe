// src/app/checkout/OrderConfirmation.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'

export default function OrderConfirmation({ orderId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
      
      <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order number is: 
        <span className="font-medium ml-1">{orderId}</span>
      </p>
      
      <p className="mb-8">
        We have sent a confirmation email with your order details. 
        You can track your order status in your account.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          href="/products" 
          className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
        
        <Link 
          href="/account/orders" 
          className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50"
        >
          View Orders
        </Link>
      </div>
    </div>
  )
}