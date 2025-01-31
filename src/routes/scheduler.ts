import express from "express";
import { runScheduler } from "../services/schedulerService";

export default (router: express.Router) => {
  router.get("/scheduler/run", async (req, res) => {
    try {
      await runScheduler(req); 
      res.json({ success: true, message: "Scheduler executed successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to run scheduler." });
    }
  });
};
