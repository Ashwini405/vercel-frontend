import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

/* =========================
   TYPES
========================= */

export interface AuthPayload extends JwtPayload {
  userId: string
  email: string 
  role: "admin" | "customer"
}

export interface AuthRequest extends Request {
  user?: AuthPayload
}

/* =========================
   AUTH MIDDLEWARE
========================= */

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "grosgo-secret-key-2024"
    ) as AuthPayload

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

/* =========================
   ADMIN MIDDLEWARE
========================= */

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" })
  }

  next()
}
