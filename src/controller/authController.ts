import { Request, Response } from "express";
import { register, login } from "../services/authService";
import logger from "../utils/logger";
import { CustomError } from "../utils/CustomError";
import { deleteSession } from "../services/sessionService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const user = await register(email, password, username);
    res.status(201).json(user);
  } catch (error: any) {
    logger.error(`Registration Error: ${error.message}`);
    if (error instanceof CustomError) {
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { sessionId, user } = await login(email, password);
    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "none", 
      maxAge: 8640000,
    });
    res
      .status(201)
      .json({ success: true, message: "Logged in successfully", user });
  } catch (error: any) {
    logger.error(`Login Error: ${error.message}`);
    if (error instanceof CustomError) {
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(401).json({ error: "Invalid creditials" });
  }
};
export const logoutUser = async (req: Request, res: Response) => {
  try {

    const sessionId = req.cookies.session_id;
    console.log("session",req.cookies)
    console.log("session doesnt exist",sessionId)
    if (sessionId) {
      await deleteSession(sessionId);
      res.clearCookie("session_id");
    }
    console.log("session does exist",sessionId)
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};