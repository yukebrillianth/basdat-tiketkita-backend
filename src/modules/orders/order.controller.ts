import { Request, Response, NextFunction } from "express";
import * as orderService from "./order.service";
import { success } from "../../utils/response";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    };

    const data =
      req.user!.role === "admin"
        ? await orderService.getAllAdmin(query)
        : await orderService.getAll(req.user!.id, query);

    success(res, data);
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data =
      req.user!.role === "admin"
        ? await orderService.getByIdAdmin(String(req.params.id))
        : await orderService.getById(String(req.params.id), req.user!.id);

    success(res, data);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await orderService.create(req.user!.id, req.body);
    success(res, data, "Order berhasil dibuat", 201);
  } catch (err) {
    next(err);
  }
};

export const cancel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.role === "admin" ? null : req.user!.id;
    const data = await orderService.cancel(String(req.params.id), userId);
    success(res, data, "Order berhasil dibatalkan");
  } catch (err) {
    next(err);
  }
};
