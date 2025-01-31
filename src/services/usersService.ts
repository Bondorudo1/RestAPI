import {
  findUserByEmail,
  insertUser,
  getAllUsers as getUsersFromDB,
} from "./authService";
import { hashPassword, verifyPassword } from "../helpers";


export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  const passwordHash = await hashPassword(password);
  const user = await insertUser(email, passwordHash, username);
  return user;
};


// export const verifyUserPassword = async (email: string, password: string) => {
//   const user = await findUserByEmail(email);
//   if (!user) return false;
//   return await verifyPassword(password, user.password_hash);
// };

export const getAllUsers = async () => {
  try {
    const users = await getUsersFromDB();
    return users;
  } catch (error) {
    throw new Error("Failed to fetch users.");
  }
};
