import { ShoppingItem } from "../types/shooping-item";

export interface ShoppingItemsService {
  add(shoppingItem: ShoppingItem): Promise<ShoppingItem>
  delete(id: NonNullable<ShoppingItem['id']>): Promise<void>
}

export class ShoppingItemsServiceDrizzle implements ShoppingItemsService {
  add(shoppingItem: ShoppingItem): Promise<ShoppingItem> {
    throw new Error("Method not implemented.");
  }
  delete(id: NonNullable<ShoppingItem["id"]>): Promise<void> {
    throw new Error("Method not implemented.");
  }

}