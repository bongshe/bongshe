// src/app/products/[slug]/page.tsx

import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import ImageSlider from "@/components/ImageSlider";
import Breadcrumb from "@/components/Breadcrumb";
import AddToCart from "@/components/AddToCart";
import {
  FaStar,
  FaRegStar,
  FaTruck,
  FaShieldAlt,
  FaShareAlt,
} from "react-icons/fa";
import RelatedProducts from "@/components/RelatedProducts";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      subcategory: true,
      user: true,
    },
  });

  if (!product) return notFound();

  // Prepare images for slider
  const gallery = [product.featuredImage, ...product.galleryImages].map(
    (img) => ({ url: img })
  );

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: product.category.name, href: `/category/${product.category.slug}` },
  ];

  if (product.subcategory) {
    breadcrumbItems.push({
      name: product.subcategory.name,
      href: `/category/${product.category.slug}/${product.subcategory.slug}`,
    });
  }

  breadcrumbItems.push({ name: product.title, href: `#` });

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <ImageSlider images={gallery} />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) =>
                      i < 4 ? (
                        <FaStar key={i} className="text-yellow-400" />
                      ) : (
                        <FaRegStar key={i} className="text-yellow-400" />
                      )
                    )}
                  </div>
                  <span className="text-sm text-gray-500">(42 reviews)</span>
                </div>

                <button className="flex items-center text-gray-500 hover:text-indigo-600">
                  <FaShareAlt className="mr-1" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.title}
                  </h1>
                  <div className="mt-2 flex items-center">
                    <span className="text-indigo-600 text-2xl font-bold">
                      ৳{product.price}
                    </span>
                    {product.price > 1000 && (
                      <span className="ml-4 text-gray-500 line-through">
                        ৳{(product.price * 1.15).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {product.stock > 10 ? "In Stock" : "Low Stock"}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Description
                  </h3>
                  <div
                    className="mt-2 prose prose-sm max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">
                    Product Details
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="text-sm font-medium">
                        {product.category.name}
                      </p>
                    </div>
                    {product.subcategory && (
                      <div>
                        <p className="text-sm text-gray-500">Subcategory</p>
                        <p className="text-sm font-medium">
                          {product.subcategory.name}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Seller</p>
                      <p className="text-sm font-medium">
                        {product.user?.name || "Verified Seller"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="text-sm font-medium">New</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <AddToCart
                    productId={product.id}
                    name={product.title}
                    price={product.price}
                    image={product.featuredImage}
                    stock={product.stock}
                  />

                  <button className="px-6 py-3 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-50">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      ></path>
                    </svg>
                    Save for later
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaTruck className="text-indigo-600 text-xl mr-3" />
                    <div>
                      <p className="text-sm font-medium">Free Delivery</p>
                      <p className="text-xs text-gray-500">
                        Delivery in 1-3 days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaShieldAlt className="text-indigo-600 text-xl mr-3" />
                    <div>
                      <p className="text-sm font-medium">1 Year Warranty</p>
                      <p className="text-xs text-gray-500">
                        Easy return policy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-indigo-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      ></path>
                    </svg>
                    <div>
                      <p className="text-sm font-medium">Secure Payment</p>
                      <p className="text-xs text-gray-500">SSL encrypted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={product.id}
          />
        </div>
      </div>
    </div>
  );
}
