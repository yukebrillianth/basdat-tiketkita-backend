import { Request, Response, NextFunction } from "express";
import * as promoCodeService from "./promoCode.service";
import { success } from "../../utils/response";

export const validate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, subtotal } = req.body;
    const data = await promoCodeService.validate(code, subtotal);
    success(res, data, "Kode promo valid");
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await promoCodeService.getAll({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    success(res, data);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await promoCodeService.create(req.user!.id, req.body);
    success(res, data, "Kode promo berhasil dibuat", 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await promoCodeService.update(String(req.params.id), req.body);
    success(res, data, "Kode promo berhasil diperbarui");
  } catch (err) {
    next(err);
  }
};
