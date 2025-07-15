import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const shoppingItemTable = sqliteTable("shopping_items", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  price: int(),
  currency: text({ enum: ["RUB", "USD", "EUR"] }).default("USD"),
  createdAt: text().default(sql`CURRENT_TIMESTAMP`),
});
