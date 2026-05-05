import { Request, Response, NextFunction } from "express";
import * as dashboardService from "./dashboard.service";
import { success } from "../../utils/response";

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await dashboardService.getDashboard();
    success(res, data);
  } catch (err) {
    next(err);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await dashboardService.getStats();
    success(res, data);
  } catch (err) {
    next(err);
  }
};

export const getTopEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const data = await dashboardService.getTopEvents(limit);
    success(res, data);
  } catch (err) {
    next(err);
  }
};

export const getRecentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const data = await dashboardService.getRecentOrders(limit);
    success(res, data);
  } catch (err) {
    next(err);
  }
};
