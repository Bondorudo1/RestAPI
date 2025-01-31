import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS: number = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "12", 10);


export const random = (length: number = 16): string => {
  return crypto.randomBytes(length).toString("hex");
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => await bcrypt.compare(password, hashedPassword);