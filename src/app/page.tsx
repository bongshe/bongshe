// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our E-Commerce Store</h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover amazing products at great prices. Shop now and experience the best online shopping!
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Browse Products
          </Link>
          <Link href="/register" className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}