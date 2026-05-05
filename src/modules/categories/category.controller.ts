import { Request, Response, NextFunction } from "express";
import * as categoryService from "./category.service";
import { success } from "../../utils/response";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await categoryService.getAll();
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
    const data = await categoryService.getById(String(req.params.id));
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
    const data = await categoryService.create(req.body);
    success(res, data, "Kategori berhasil dibuat", 201);
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
    const data = await categoryService.update(String(req.params.id), req.body);
    success(res, data, "Kategori berhasil diupdate");
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
    await categoryService.remove(String(req.params.id));
    success(res, null, "Kategori berhasil dihapus");
  } catch (err) {
    next(err);
  }
};
