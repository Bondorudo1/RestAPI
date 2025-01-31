import { db } from "../db";
import { tasks } from "../db/schema";
import { and, eq, InferInsertModel } from "drizzle-orm";

export const createTask = async (
  userId: number,
  parameters: object,
  url: string,
  executionDate: Date,
  status: "in_queue" | "completed" | "canceled" | "paused" = "in_queue",
  statusDescription?: string
) => {
  return await db.insert(tasks).values({
    user_id: userId,
    parameters: JSON.stringify(parameters),
    url,
    execution_date: executionDate,
    status,
    status_description: statusDescription,
  } as InferInsertModel<typeof tasks>);
};

export const getAllTasks = async (userId: number) => {
  return await db.select().from(tasks).where(eq(tasks.user_id, userId));
};

export const updateTaskStatus = async (
  userId: number,
  taskId: number,
  status: "in_queue" | "completed" | "canceled" | "paused"
) => {

  const existingTask = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)))
    .limit(1);

  if (existingTask.length === 0) {
    return false;
  }
  await db
    .update(tasks)
    .set({ status } as Partial<typeof tasks.$inferInsert>)
    .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)))
    .execute();

  return true; 
};

export const getPendingTasks = async (userId: number) => {
  return await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.status, "in_queue"), eq(tasks.user_id, userId)));
};
