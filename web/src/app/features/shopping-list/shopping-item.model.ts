export interface ShoppingItem {
  id: number
  name: string
  description?: null | string
  price: number
  currency: 'RUB' | 'EUR' | 'USD',
  createdAt: string
}
