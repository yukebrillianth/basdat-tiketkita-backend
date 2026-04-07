import { NextFunction, Request, Response } from "express";
import { success } from "../../utils/response";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    success(res, { message: "Auth register endpoint - coming soon" });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    success(res, { message: "Auth login endpoint - coming soon" });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    success(res, { message: "Auth me endpoint - coming soon" });
  } catch (err) {
    next(err);
  }
};
