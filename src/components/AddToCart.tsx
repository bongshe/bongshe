// src/components/AddToCart.tsx
'use client'

import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

interface AddToCartProps {
  productId: string
  name: string
  price: number
  image: string
  stock: number
}

export default function AddToCart({ 
  productId, 
  name, 
  price, 
  image, 
  stock 
}: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  
  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name,
      price,
      image,
      quantity
    })
    toast.success(`${quantity} ${name} added to cart!`)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex border border-gray-300 rounded-lg">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100"
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={Math.min(stock, 10)}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(stock, Number(e.target.value))))}
          className="w-16 text-center border-0 focus:ring-0"
          aria-label="Quantity"
        />
        <button
          onClick={() => setQuantity(q => Math.min(stock, q + 1))}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100"
          disabled={quantity >= stock}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      
      <button
        onClick={handleAddToCart}
        className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={stock === 0}
      >
        <FaShoppingCart className="mr-2" />
        Add to Cart
      </button>
    </div>
  )
}