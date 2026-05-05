import { Request, Response, NextFunction } from "express";
import * as wishlistService from "./wishlist.service";
import { success } from "../../utils/response";

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await wishlistService.getAll(req.user!.id);
    success(res, data);
  } catch (err) {
    next(err);
  }
};

export const toggle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { event_id } = req.body;
    const data = await wishlistService.toggle(req.user!.id, event_id);
    const message = data.added
      ? "Event ditambahkan ke wishlist"
      : "Event dihapus dari wishlist";
    success(res, data, message);
  } catch (err) {
    next(err);
  }
};
