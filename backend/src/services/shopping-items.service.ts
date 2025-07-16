import { count, eq } from "drizzle-orm";
import db from "../config/db";
import { shoppingItemTable } from "../config/db/schema";
import { ShoppingItem, ShoppingItemCreate } from "../models/shoping-item";
import { Pagination, PaginationQuery } from "../types/pagination";
import { InternalServerError, NotFoundError } from "../errors";

export interface ShoppingItemsService {
  create(shoppingItem: ShoppingItemCreate): Promise<ShoppingItem>;
  get(pagination?: PaginationQuery): Promise<Pagination<ShoppingItem>>;
  getOne(id: number): Promise<ShoppingItem>;
  delete(id: number): Promise<void>;
}

export class ShoppingItemsServiceDrizzle implements ShoppingItemsService {
  async create(shoppingItem: ShoppingItemCreate): Promise<ShoppingItem> {
    const inserted = await db.insert(shoppingItemTable).values(shoppingItem);

    if (!inserted.lastInsertRowid) {
      throw new InternalServerError();
    }

    if (inserted.lastInsertRowid > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new InternalServerError(
        "inserted.lastInsertRowid > MAX_SAFE_INTEGER"
      );
    }
    const id = Number(inserted.lastInsertRowid);

    const [item] = await db
      .select()
      .from(shoppingItemTable)
      .where(eq(shoppingItemTable.id, id));

    if (!item) throw new InternalServerError("Inserted item not found");

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

    if (!item) throw new NotFoundError();

    return item;
  }
  async delete(id: NonNullable<ShoppingItem["id"]>): Promise<void> {

    const deleted = await db
      .delete(shoppingItemTable)
      .where(eq(shoppingItemTable.id, id));

    if (!deleted.rowsAffected) {
      throw new NotFoundError("Shopping item to delete not found");
    }
  }
}
