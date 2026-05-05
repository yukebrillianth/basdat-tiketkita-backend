import { Request, Response, NextFunction } from "express";
import * as venueService from "./venue.service";
import { success } from "../../utils/response";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await venueService.getAll();
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
    const data = await venueService.getById(String(req.params.id));
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
    const data = await venueService.create(req.body);
    success(res, data, "Venue berhasil dibuat", 201);
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
    const data = await venueService.update(String(req.params.id), req.body);
    success(res, data, "Venue berhasil diupdate");
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
    await venueService.remove(String(req.params.id));
    success(res, null, "Venue berhasil dihapus");
  } catch (err) {
    next(err);
  }
};
