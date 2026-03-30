import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth.schema";
import { comment } from "./comment.schema";

export const product = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/* RELATIONS */
export const productRelations = relations(product, ({ one, many }) => ({
  user: one(user, { fields: [product.userId], references: [user.id] }),
  comments: many(comment),
}));

/* TYPE INFERENCE */
export type ProductType = typeof product.$inferSelect;
export type NewProductType = typeof product.$inferInsert;
