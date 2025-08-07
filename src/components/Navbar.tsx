// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { FiShoppingCart, FiUser } from 'react-icons/fi'

export default function Navbar() {
  const { data: session } = useSession()
  const { cartCount } = useCart()

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                BongShe
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            
            <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {session ? (
              <>
                <Link href="/account" className="text-gray-700 hover:text-gray-900 flex items-center">
                  <FiUser className="mr-1" />
                  Account
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Sign In
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}