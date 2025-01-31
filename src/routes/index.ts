import express from "express";
import authRoutes from "./auth";
import userRoutes from "./users";
import tasksRoutes from "./tasks";
import schedulerRoutes from "./scheduler";

const router = express.Router();

export default (): express.Router => {
  authRoutes(router);
  userRoutes(router);
  tasksRoutes(router);
  schedulerRoutes(router);
  return router;
};
