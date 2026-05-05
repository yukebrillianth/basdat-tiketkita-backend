import { Request, Response, NextFunction } from "express";
import * as eventService from "./event.service";
import { success } from "../../utils/response";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const data = await eventService.getAll({
      search: req.query.search ? String(req.query.search) : undefined,
      category_id: req.query.category_id ? String(req.query.category_id) : undefined,
      status: req.query.status ? String(req.query.status) : undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      isAdmin,
    });
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
    const isAdmin = req.user?.role === "admin";
    const data = await eventService.getById(String(req.params.id), isAdmin);
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
    const data = await eventService.create(req.user!.id, req.body);
    success(res, data, "Event berhasil dibuat", 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await eventService.update(String(req.params.id), req.body);
    success(res, data, "Event berhasil diupdate");
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await eventService.remove(String(req.params.id));
    success(res, null, "Event berhasil dihapus");
  } catch (err) {
    next(err);
  }
};
