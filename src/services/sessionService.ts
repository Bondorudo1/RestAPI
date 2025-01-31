import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import { eq } from "drizzle-orm";

export const createSession = async (userId: number) => {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await db.insert(sessions).values({
    id: sessionId,
    user_id: userId,
    expires_at: expiresAt,
  });

  return sessionId;
};

export const getSession = async (sessionId: string) => {
   const session = await db
     .select({
       id: sessions.id,
       user_id: sessions.user_id,
       email: users.email,
       expires_at:sessions.expires_at 
     })
     .from(sessions)
     .innerJoin(users, eq(sessions.user_id, users.id)) 
     .where(eq(sessions.id, sessionId))
     .limit(1);
 
   return session.length > 0 ? session[0] : null;
 };
 
export const deleteSession = async (sessionId: string) => {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
};
