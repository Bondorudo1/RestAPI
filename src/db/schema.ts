
import {
  datetime,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", {length:128}).primaryKey(),
  user_id: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires_at: datetime("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const tasks = mysqlTable("tasks", {
  id: int().autoincrement().primaryKey(),
  user_id: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  parameters: json("parameters").notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  execution_date: datetime().notNull(),
  status: mysqlEnum("status", ["in_queue", "completed", "canceled", "paused"])
    .notNull()
    .default("in_queue"),
  status_description: text(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  task_id: int("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  notification_type: varchar("notification_type", { length: 50 }).notNull(),
  recipient: varchar("recipient", { length: 255 }).notNull(),
  sent_at: timestamp("sent_at").defaultNow().notNull(),
  status: mysqlEnum("status", ["sent", "failed"]).notNull().default("sent"),
  details: text("details"),
});

export const exceptions = mysqlTable("exceptions", {
  id: int().autoincrement().primaryKey(),
  task_id: int("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  exception_message: text().notNull(),
  stack_trace: text(),
  occured_at: timestamp("occured_at").defaultNow().notNull(),
});

export const logs = mysqlTable("logs", {
  id: int("id").autoincrement().primaryKey(),
  task_id: int("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  log_level: mysqlEnum("log_level", ["info", "warning", "error"]).default(
    "info"
  ),
  message: text("message").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const schema = { tasks, notifications, exceptions, logs };
