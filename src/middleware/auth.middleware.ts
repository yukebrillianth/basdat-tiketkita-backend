import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";
import * as userRepo from "../modules/auth/auth.repository";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Token tidak ditemukan" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await userRepo.findById(decoded.id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User tidak ditemukan" });
    const { password_hash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Token tidak valid atau kadaluarsa" });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ success: false, message: "Akses ditolak" });
  next();
};
