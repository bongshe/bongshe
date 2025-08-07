// src/types/pages.d.ts
// export interface SubcategoryPageProps {
//   params: {
//     categorySlug: string
//     subcategorySlug: string
//   }
//   searchParams?: { [key: string]: string | string[] | undefined }
// }

export type SubcategoryPageProps = {
  params: {
    categorySlug: string;
    subcategorySlug: string;
  };
};
