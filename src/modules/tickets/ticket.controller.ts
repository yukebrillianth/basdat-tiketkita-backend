import { Request, Response, NextFunction } from "express";
import * as ticketService from "./ticket.service";
import { success } from "../../utils/response";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await ticketService.getAllByEvent(String(req.params.eventId));
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
    const data = await ticketService.create(String(req.params.eventId), req.body);
    success(res, data, "Tipe tiket berhasil dibuat", 201);
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
    const data = await ticketService.update(String(req.params.eventId), String(req.params.id), req.body);
    success(res, data, "Tipe tiket berhasil diupdate");
  } catch (err) {
    next(err);
  }
};
