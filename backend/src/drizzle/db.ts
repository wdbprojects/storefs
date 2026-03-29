import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { ENV } from "../config/env";

export const db = drizzle(ENV.DATABASE_URL!, { schema: schema });

if (db) {
  console.log("Database connection established successfully ☘️");
} else {
  console.error("Database connection error! ⛔️");
}
