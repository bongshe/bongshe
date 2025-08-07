// src/components/AdminProductForm.tsx 

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ImageUpload from "./ImageUpload";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false });

interface Category {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

export default function AdminProductForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [featuredImage, setFeaturedImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const slug = slugify(title);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const product = {
      title,
      slug,
      price,
      stock,
      featuredImage,
      galleryImages,
      description,
      categoryId: selectedCategoryId || null,
      subcategoryId: selectedSubcategoryId || null,
      status,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Error uploading product:", error);
        alert("Failed to upload product.");
      } else {
        alert("Product saved successfully!");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Something went wrong.");
    }
  };

  const handleAddGalleryImage = (url: string) => {
    if (galleryImages.length >= 4) return;
    setGalleryImages([...galleryImages, url]);
  };

  const handleRemoveGalleryImage = (url: string) => {
    setGalleryImages(galleryImages.filter((img) => img !== url));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded shadow max-w-2xl mx-auto"
    >
      {/* Product Name */}
      <div>
        <label className="block font-semibold mb-1">Product Name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block font-semibold mb-1">Price (৳)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block font-semibold mb-1">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value))}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      {/* Feature Image */}
      <div>
        <label className="block font-semibold mb-1">Feature Image</label>
        <ImageUpload imageUrl={featuredImage} onChange={setFeaturedImage} type="featured"/>
        
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block font-semibold mb-1">
          Additional Gallery Images (up to 4)
        </label>
        <div className="flex flex-wrap gap-4">
          {galleryImages.map((url, index) => (
            <div key={index} className="relative">
              <ImageUpload 
          imageUrl={url} 
          onChange={(newUrl) => {
            const newGallery = [...galleryImages]
            newGallery[index] = newUrl
            setGalleryImages(newGallery)
          }} 
          type="gallery"
        />
              <button
                type="button"
                onClick={() => handleRemoveGalleryImage(url)}
                className="absolute top-0 right-0 text-white bg-red-600 rounded-full px-2 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          {galleryImages.length < 4 && (
            <ImageUpload imageUrl="" onChange={handleAddGalleryImage} />
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <TiptapEditor content={description} onChange={setDescription} />
      </div>

      {/* Category */}
      <div>
        <label className="block font-semibold mb-1">Category</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setSelectedSubcategoryId(""); // reset subcategory when category changes
          }}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      {selectedCategoryId && (
        <div>
          <label className="block font-semibold mb-1">Subcategory</label>
          <select
            value={selectedSubcategoryId}
            onChange={(e) => setSelectedSubcategoryId(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select subcategory</option>
            {categories
              .find((cat) => cat.id === selectedCategoryId)
              ?.subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Status */}
      <div>
        <label className="block font-semibold mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "Draft" | "Published")}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Product
        </button>
      </div>
    </form>
  );
}
