import { Request, Response, NextFunction } from "express";
import * as paymentMethodService from "./paymentMethod.service";
import { success } from "../../utils/response";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.user?.role === "admin"
      ? await paymentMethodService.getAllAdmin()
      : await paymentMethodService.getAll();
    success(res, data);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await paymentMethodService.create(req.body);
    success(res, data, "Metode pembayaran berhasil dibuat", 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await paymentMethodService.update(String(req.params.id), req.body);
    success(res, data, "Metode pembayaran berhasil diperbarui");
  } catch (err) {
    next(err);
  }
};
