import { Request, Response } from "express";
import {
  createTask,
  getAllTasks,
  updateTaskStatus,
} from "../services/taskService";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number };
  }
}

export const handleCreateTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // ✅ Use the logged-in user ID
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { parameters, url, execution_date, status, status_description } =
      req.body;
    const task = await createTask(
      userId, // ✅ Now properly associates task with user
      parameters,
      url,
      new Date(execution_date),
      status,
      status_description
    );

    return res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("❌ Error creating task:", error);
    return res.status(500).json({ error: "Failed to create task." });
  }
};

export const handleGetAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const tasks = await getAllTasks(userId);
    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch tasks.",
    });
  }
};

export const handleUpdateTaskStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["in_queue", "completed", "canceled", "paused"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await updateTaskStatus(userId, Number(id), status);

    if (!updated) {
      return res.status(403).json({ error: "Forbidden: You do not own this task or task does not exist" });
    }

    return res.status(200).json({ success: true, message: "Task status updated." });
  } catch (error) {
    console.error("❌ Update task status error:", error);
    return res.status(500).json({ error: "Failed to update task status." });
  }
};
