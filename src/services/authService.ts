import { eq } from "drizzle-orm";
import { db } from "../db";
import { createUser } from "./usersService";
import { users } from "../db/schema";
import { createSession } from "./sessionService";
import { verifyPassword } from "../helpers/index";

export const getAllUsers = async () => {
  return await db.select().from(users);
};

export const findUserByEmail = async (email: string) => {
  console.log("🔍 Searching for user by email:", email);

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    console.log("✅ Found user:", user);
    return user;
  } catch (error) {
    console.error("❌ Error in findUserByEmail:", error);
    throw error;
  }
};

export const insertUser = async (
  email: string,
  password_hash: string,
  username: string
) => {
  await db
    .insert(users)
    .values({
      email,
      password_hash,
      username,
    })
    .execute();

  return findUserByEmail(email);
};

export const register = async (
  email: string,
  password: string,
  username: string
) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  const user = await createUser(email, password, username);
  return user;
};

export const login = async (email: string, password: string) => {
  console.log("✅ User found:", email);
  const user = await findUserByEmail(email);
  if (!user) {
    console.log("❌ User not found", user);
    throw new Error("Invalid credentials");
  }
  console.log("✅ User found:", user);
  const isValidPassword = await verifyPassword(password, user.password_hash);
  console.log("🔐 Password valid:", isValidPassword);
  if (!isValidPassword) {
    console.log("❌ Password mismatch");
    throw new Error("Invalid credentials");
  }

  const sessionId = await createSession(user.id);
  console.log("✅ Session created:", sessionId);

  return { sessionId, user };
};
