// src/app/dashboard/admin/page.tsx 

'use client'

import Link from 'next/link'

export default function AdminDashboardPage() {
  const links = [
    { href: '/dashboard/admin/products', label: '📦 Manage Products' },
    { href: '/dashboard/admin/orders', label: '🛒 Manage Orders' },
    { href: '/dashboard/admin/categories', label: '📁 Manage Categories' },
    { href: '/dashboard/admin/subcategories', label: '🗂️ Manage Subcategories' },
    { href: '/dashboard/admin/upload', label: '➕ Upload New Product' },
  ]

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="block px-6 py-3 bg-gray-100 hover:bg-gray-200 border rounded-lg text-lg font-medium"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
























