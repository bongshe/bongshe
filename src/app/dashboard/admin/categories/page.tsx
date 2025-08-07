// src/app/dashboard/admin/categories/page.tsx

import CategoryForm from "@/components/CategoryForm";



export default function AdminCategoriesPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Add Category or Subcategory</h1>
      <CategoryForm />
    </div>
  )
}
