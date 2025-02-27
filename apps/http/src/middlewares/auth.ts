import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-config/config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"] ?? "";

  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded) {
    req.userId = (decoded as JwtPayload).userId;
    next();
  } else {
    res.status(403).json({
      message: "unauthorized",
    });
  }
};

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
