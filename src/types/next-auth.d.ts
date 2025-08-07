// src/types/next-auth.d.ts
import "next-auth"
import { DefaultSession } from "next-auth" // Explicit import

declare module "next-auth" {
  interface User {
    id: string
    role: string
  }
  
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}


// src/types/pages.d.ts
export interface SubcategoryPageProps {
  params: {
    categorySlug: string
    subcategorySlug: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}