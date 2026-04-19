export interface Product {
  _id?: string
  id?: number | string
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviews?: number
  badge?: string
  description?: string
  unit?: string
  stock?: number
}

export const allProducts: Product[] = []

