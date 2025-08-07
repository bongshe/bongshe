// src/types/next.d.ts
import type { NextPage } from 'next'

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