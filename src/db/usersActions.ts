
import { db } from "../db"; 
import { eq, sql } from "drizzle-orm";

import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";


export const users = mysqlTable("users", {
   id: varchar("id", { length: 36 }) 
     .primaryKey()
     .default(sql`UUID()`), 
   email: varchar("email", { length: 255 }).unique().notNull(),
   username: varchar("username", { length: 255 }).unique().notNull(),
   passwordHash: text("password_hash").notNull(),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().notNull(),
 });

