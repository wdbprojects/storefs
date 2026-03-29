import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth.schema";
import { product } from "./product.schema";

export const comment = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/* RELATIONS */
export const commentRelations = relations(comment, ({ one }) => ({
  users: one(user, { fields: [comment.userId], references: [user.id] }),
  products: one(product, {
    fields: [comment.userId],
    references: [product.id],
  }),
}));

/* TYPE INFERENCE */
export type CommentType = typeof comment.$inferSelect;
export type NewCommentType = typeof comment.$inferInsert;
