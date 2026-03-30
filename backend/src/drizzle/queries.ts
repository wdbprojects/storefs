import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  user,
  comment,
  product,
  type NewUserType,
  type NewProductType,
  type NewCommentType,
} from "./schema";

/* USER QUERIES */
export const createUser = async (data: NewUserType) => {
  const [newUser] = await db.insert(user).values(data).returning();
  return newUser;
};
export const getUserById = async (id: string) => {
  const foundUser = await db.query.user.findFirst({ where: eq(user.id, id) });
  return foundUser;
};
export const updateUser = async (id: string, data: Partial<NewUserType>) => {
  const existingUser = await getUserById(id);
  if (!existingUser) throw new Error(`User with id ${id} not found`);
  const [updatedUser] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, id))
    .returning();
  return updatedUser;
};
export const upsertUser = async (data: NewUserType) => {
  const [upsertedUser] = await db
    .insert(user)
    .values(data)
    .onConflictDoUpdate({
      target: user.id,
      set: data,
    })
    .returning();
  return upsertedUser;
};

/* PRODUCT QUERIES */
export const createProduct = async (data: NewProductType) => {
  const [newProduct] = await db.insert(product).values(data).returning();
  return newProduct;
};
export const getAllProducts = async () => {
  const allProducts = await db.query.product.findMany({
    with: { user: true },
    orderBy: (product, { desc }) => [desc(product.createdAt)],
  });
  return allProducts;
};
export const getProductById = async (id: string) => {
  const foundProduct = await db.query.product.findFirst({
    where: eq(user.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comment, { desc }) => [desc(comment.createdAt)],
      },
    },
  });
  return foundProduct;
};
export const getProductByUserId = async (userId: string) => {
  const productList = await db.query.product.findMany({
    where: eq(product.userId, userId),
    with: { user: true },
    orderBy: (product, { desc }) => [desc(product.createdAt)],
  });
  return productList;
};
export const updateProduct = async (
  id: string,
  data: Partial<NewProductType>,
) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) throw new Error(`Product with id ${id} not found`);
  const [updatedProduct] = await db
    .update(product)
    .set(data)
    .where(eq(product.id, id))
    .returning();
  return updatedProduct;
};
export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) throw new Error(`Product with id ${id} not found`);
  const deletedProduct = await db
    .delete(product)
    .where(eq(product.id, id))
    .returning();
  return deletedProduct;
};

/* COMMENT QUERIES */
export const createComment = async (data: NewCommentType) => {
  const newComment = await db.insert(comment).values(data).returning();
  return newComment;
};

export const deleteComment = async (id: string) => {
  const [deletedComment] = await db
    .delete(comment)
    .where(eq(comment.id, id))
    .returning();
  return deletedComment;
};

export const getCommentById = async (id: string) => {
  const foundComment = await db.query.comment.findFirst({
    where: eq(comment.id, id),
    with: { user: true },
  });
  return foundComment;
};
