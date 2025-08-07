'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Category } from '@prisma/client'

export default function SubcategoryForm() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Fetch categories to populate dropdown
    axios.get('/api/admin/categories').then((res) => {
      setCategories(res.data || [])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await axios.post('/api/admin/subcategories', {
      name,
      slug,
      categoryId,
    })

    setName('')
    setSlug('')
    setCategoryId('')
    setSuccess(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Subcategory Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Parent Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Add Subcategory
      </button>

      {success && <p className="text-green-600 mt-2">Subcategory added!</p>}
    </form>
  )
}
