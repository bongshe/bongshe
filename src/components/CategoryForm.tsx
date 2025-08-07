'use client'
import { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import axios from 'axios'

interface Category {
  id: string;
  name: string;
}

export default function CategoryForm() {
  const [name, setName] = useState<string>('')
  const [parentId, setParentId] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await axios.post('/api/categories', { name, parentId })
    setName('')
    setParentId('')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        type="text"
        placeholder="Category or Subcategory Name"
        value={name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        className="border px-3 py-2"
        required
      />
      <select
        value={parentId}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setParentId(e.target.value)}
        className="border px-3 py-2"
      >
        <option value="">-- This is a main category --</option>
        {categories.map((cat: Category) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <button className="bg-black text-white px-4 py-2 rounded">Save</button>
    </form>
  )
}