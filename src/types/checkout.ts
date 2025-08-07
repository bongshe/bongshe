// src/types/checkout.ts
export interface ContactInfo {
  name: string
  email: string
  phone: string
  address: string
}

export interface OrderData extends ContactInfo {
  userId: string | null
  totalAmount: number
  items: Array<{
    productId: string
    quantity: number
    priceAtPurchase: number
  }>
}