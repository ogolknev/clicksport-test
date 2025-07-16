import zod from 'zod'
import { shoppingItemTable } from '../config/db/schema';

export const shoppingItemSchema = zod.object({
  name: zod.string().nonempty(),
  description: zod.string().optional(),
  price: zod.number().nonnegative(),
  currency: zod.enum(["RUB", "USD", "EUR"]).default('RUB'),
})

export type ShoppingItemCreate = zod.input<typeof shoppingItemSchema>

export type ShoppingItem = typeof shoppingItemTable.$inferSelect