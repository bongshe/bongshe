import { prisma } from "@/app/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      subcategory: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow">
              <Image
                src={product.featuredImage}
                alt={product.title}
                width={400}
                height={300}
                className="object-cover rounded mb-4 w-full h-[200px]"
              />
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-700">${product.price}</p>
              <p className="text-sm text-gray-500">
                {product.category?.name}
                {product.subcategory ? ` → ${product.subcategory.name}` : ""}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Added by {product.user?.name || "Unknown"}
              </p>
              <Link
                href={`/products/${product.slug}`}
                className="text-blue-600 hover:underline mt-2 inline-block text-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
