// src/types/next.d.ts

declare module 'next' {
  interface PageProps {
    params?: {
      categorySlug?: string
      subcategorySlug?: string
      [key: string]: string | string[] | undefined
    }
    searchParams?: { [key: string]: string | string[] | undefined }
  }
}