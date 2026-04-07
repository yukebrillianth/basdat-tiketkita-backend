import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { success } from "../../utils/response";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.register(req.body);
    success(res, user, "Registrasi berhasil. Silakan verifikasi email Anda.", 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    success(res, data, "Login berhasil");
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, code } = req.body;
    await authService.verifyEmail(email, code);
    success(res, null, "Email berhasil diverifikasi");
  } catch (err) {
    next(err);
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    await authService.resendVerification(email);
    success(res, null, "Kode verifikasi baru telah dikirim");
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    success(res, null, "Kode reset password telah dikirim ke email");
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, code, password } = req.body;
    await authService.resetPassword(email, code, password);
    success(res, null, "Password berhasil direset");
  } catch (err) {
    next(err);
  }
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.me(req.user!.id);
    success(res, user);
  } catch (err) {
    next(err);
  }
};
