import { count, eq } from "drizzle-orm";
import db from "../config/db";
import { shoppingItemTable } from "../config/db/schema";
import { ShoppingItem } from "../types/shooping-item";
import { Pagination, PaginationQuery } from "../types/pagination";

export interface ShoppingItemsService {
  add(shoppingItem: ShoppingItem): Promise<ShoppingItem>;
  get(pagination?: PaginationQuery): Promise<Pagination<ShoppingItem>>;
  getOne(id: NonNullable<ShoppingItem["id"]>): Promise<ShoppingItem>;
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
  async get(pagination?: PaginationQuery): Promise<Pagination<ShoppingItem>> {
    const page = Math.max(1, pagination?.page ?? 1);
    const pageSize = Math.max(1, pagination?.pageSize ?? 20);

    const offset = (page - 1) * pageSize;

    const total = (
      await db.select({ count: count() }).from(shoppingItemTable)
    )[0].count;

    const items = await db
      .select()
      .from(shoppingItemTable)
      .limit(pageSize)
      .offset(offset);

    return {
      items,
      page,
      pageSize,
      total,
    };
  }
  async getOne(id: NonNullable<ShoppingItem["id"]>): Promise<ShoppingItem> {
    const [item] = await db
      .select()
      .from(shoppingItemTable)
      .where(eq(shoppingItemTable.id, id));

    if (!item) throw new Error("Shopping item not found");

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
