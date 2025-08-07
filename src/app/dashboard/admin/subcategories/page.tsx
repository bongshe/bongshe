//  src/app/dashboard/admin/subcategories/page.tsx

import SubcategoryForm from "@/components/SubcategoryForm";

export default function AdminSubcategoriesPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Add Subcategory</h1>
      <SubcategoryForm />
    </div>
  )
}
