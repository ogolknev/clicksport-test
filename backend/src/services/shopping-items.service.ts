import { eq } from "drizzle-orm";
import db from "../config/db";
import { shoppingItemTable } from "../config/db/schema";
import { ShoppingItem } from "../types/shooping-item";

export interface ShoppingItemsService {
  add(shoppingItem: ShoppingItem): Promise<ShoppingItem>;
  delete(id: NonNullable<ShoppingItem["id"]>): Promise<void>;
}

export class ShoppingItemsServiceDrizzle implements ShoppingItemsService {
  async add(shoppingItem: ShoppingItem): Promise<ShoppingItem> {
    const inserted = await db.insert(shoppingItemTable).values(shoppingItem);

    if (!inserted.lastInsertRowid) {
      throw new Error("Insert shopping item failed");
    }

    if (inserted.lastInsertRowid > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error("inserted.lastInsertRowid > MAX_SAFE_INTEGER");
    }
    const id = Number(inserted.lastInsertRowid);

    const [item] = await db
      .select()
      .from(shoppingItemTable)
      .where(eq(shoppingItemTable.id, id));

    if (!item) throw new Error("Inserted item not found");

    return item;
  }
  async delete(id: NonNullable<ShoppingItem["id"]>): Promise<void> {
    const deleted = await db
      .delete(shoppingItemTable)
      .where(eq(shoppingItemTable.id, id));

    if (!deleted.rowsAffected) {
      throw new Error("Failed delete shopping item");
    }
  }
}
