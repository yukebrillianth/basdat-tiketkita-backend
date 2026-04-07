import { Request, Response, NextFunction } from "express";
import { success } from "../../utils/response";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    success(res, { message: "Endpoint coming soon" });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    success(res, { message: "Endpoint coming soon" });
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    success(res, { message: "Endpoint coming soon" });
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    success(res, { message: "Endpoint coming soon" });
  } catch (err) {
    next(err);
  }
};
