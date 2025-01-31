import { requireAuth } from "../middlewares/index";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/authController";
import express from "express";

export default (router: express.Router) => {
  router.post("/auth/register", registerUser);
  router.post("/auth/login", loginUser);
  router.post("/auth/logout", requireAuth, logoutUser);
};
