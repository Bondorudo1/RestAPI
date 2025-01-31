

import { Request, Response } from "express";
import { getAllUsers as getUsersService } from "../services/usersService";


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsersService();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users." });
  }
};
