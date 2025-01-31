import { db } from "../db";
import { tasks, notifications, exceptions } from "../db/schema";
import nodemailer from "nodemailer";
import { getPendingTasks, updateTaskStatus } from "./taskService";
import { InferInsertModel } from "drizzle-orm";
import { getSession } from "./sessionService";
import { Request } from "express";

const sendEmailNotification = async (
  recipient: string,
  subject: string,
  text: string,
  taskId: number
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject,
      text,
    });

    await logNotification(
      taskId,
      "email",
      recipient,
      "sent",
      `Email sent successfully to ${recipient}`
    );
  } catch (error: any) {
    await logNotification(
      taskId,
      "email",
      recipient,
      "failed",
      `Failed to send email: ${error.message}`
    );
    await logException(taskId, error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

const executeTask = async (task: any, userEmail: string) => {
  try {
    console.log(`🚀 Executing Task ${task.id}: ${task.url}`);

    const response = { success: true };
    if (!response.success) throw new Error("Task execution failed");

    await updateTaskStatus(task.user_id, task.id, "completed");

    try {
      await sendEmailNotification(
        userEmail, 
        "Task Completed",
        `Task ${task.id} executed successfully.`,
        task.id
      );
    } catch {}

    console.log(`✅ Task ${task.id} executed successfully.`);
  } catch (error: any) {
    await handleTaskFailure(task.user_id, task.id, error);
  }
};

const logNotification = async (
  taskId: number,
  type: string,
  recipient: string,
  status: string,
  details: string
) => {
  await db
    .insert(notifications)
    .values({
      task_id: taskId,
      notification_type: type,
      recipient,
      status,
      details,
    } as InferInsertModel<typeof notifications>);
};

const logException = async (taskId: number, error: any) => {
  await db
    .insert(exceptions)
    .values({
      task_id: taskId,
      exception_message: error.message,
      stack_trace: error.stack,
    } as InferInsertModel<typeof exceptions>);
};

const handleTaskFailure = async (userId: number, taskId: number, error: any) => {
  await logException(taskId, error);
  await updateTaskStatus(userId, taskId, "canceled"); // Pass userId

  if (!error.message.includes("Email sending failed")) {
    await logNotification(
      taskId,
      "system",
      "admin@example.com",
      "failed",
      `Task execution failed: ${error.message}`
    );
  }
};

export const runScheduler = async (req: Request) => {
  console.log("🔄 Checking for scheduled tasks...");

  const sessionId = req.cookies.session_id;
  if (!sessionId) {
    console.log("❌ No session found. Scheduler stopped.");
    return;
  }

  const session = await getSession(sessionId);
  if (!session) {
    console.log("❌ Invalid session. Scheduler stopped.");
    return;
  }

  const { user_id, email } = session; 
  const pendingTasks = await getPendingTasks(user_id);

  if (pendingTasks.length === 0) {
    console.log("✅ No pending tasks for this user.");
    return;
  }

  for (const task of pendingTasks) {
    await executeTask(task, email); 
  }
};
