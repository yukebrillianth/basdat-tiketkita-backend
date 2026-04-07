import { Request, Response, NextFunction } from "express";
import { success } from "../../utils/response";

export const confirm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    success(res, { message: "Endpoint coming soon" });
  } catch (err) {
    next(err);
  }
};

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    success(res, { message: "Endpoint coming soon" });
  } catch (err) {
    next(err);
  }
};
