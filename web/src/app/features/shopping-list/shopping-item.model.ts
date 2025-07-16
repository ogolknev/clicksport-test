export type ShoppingItem = {
  id: number;
  name: string;
  description?: null | string;
  price: number;
  currency: 'RUB' | 'EUR' | 'USD';
  createdAt: string;
};

export type ShoppingItemCreate = {
  name: string;
  price: number;
  description?: string;
  currency?: 'RUB' | 'USD' | 'EUR';
};
