import express from "express";
import { requireAuth } from "../middlewares/index"; // ✅ Ensure authentication for tasks
import {
  handleCreateTask,
  handleGetAllTasks,
  handleUpdateTaskStatus,
} from "../controller/taskController";

export default (router: express.Router) => {
  router.post("/tasks", requireAuth, handleCreateTask); 
  router.get("/tasks", requireAuth, handleGetAllTasks); 
  router.put("/tasks/:id/status", requireAuth, handleUpdateTaskStatus); 
};