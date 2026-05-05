import { Request, Response, NextFunction } from "express";
import * as paymentService from "./payment.service";
import { success } from "../../utils/response";

export const confirm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.role === "admin" ? null : req.user!.id;
    const data = await paymentService.confirm(String(req.params.orderId), userId);
    success(res, data, "Pembayaran berhasil dikonfirmasi");
  } catch (err) {
    next(err);
  }
};

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await paymentService.webhook(req.body);
    success(res, data);
  } catch (err) {
    next(err);
  }
};
