import { Request, Response, NextFunction } from "express";
import { getSession } from "../services/sessionService";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const authenticatedUserId = "user-id-from-token";
  if (userId !== authenticatedUserId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies.session_id;
  // console.log("session doesnt exist auth",sessionId)
  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const session = await getSession(sessionId);

  if (!session || new Date(session.expires_at) < new Date()) {
    return res.status(401).json({ error: "Session expired" });
  }
  console.log("session",session)
  req.user = { id: session.user_id };
  next();
};
