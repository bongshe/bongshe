
'use client'

import dynamic from 'next/dynamic'

const AdminProductForm = dynamic(() => import('@/components/AdminProductForm'), {
  ssr: false,
})

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Upload Product</h1>
      <AdminProductForm />
    </div>
  )
}
