// src/app/cart/page.tsx
'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, cartTotal, clearCart } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Loading Cart...</h1>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      
      {cartCount === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link href="/products" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y">
                {cartItems.map(item => (
                  <div key={item.id} className="p-4 flex items-center">
                    <div className="w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">৳{item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={16} />
                      </button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        disabled={item.quantity >= 10}
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    
                    <div className="ml-4">
                      <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 p-2 text-gray-500 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="p-4 flex justify-between items-center border-t">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <div className="flex justify-between border-t pt-3 font-medium">
                  <span>Total</span>
                  <span>৳{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
            <Link href="/checkout">
              <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
                Proceed to Checkout
              </button>
              </Link>
              <Link 
                href="/products" 
                className="mt-4 block text-center text-indigo-600 hover:text-indigo-800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}