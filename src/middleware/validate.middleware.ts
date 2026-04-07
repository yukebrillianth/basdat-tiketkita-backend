import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const friendlyMessages: Record<string, string> = {
  fullname: "Nama lengkap wajib diisi",
  email: "Email wajib diisi",
  password: "Password wajib diisi",
  code: "Kode verifikasi wajib diisi",
};

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        err.issues.forEach((e) => {
          const key = e.path.join(".") || "_root";
          let message = e.message;
          if (message.includes("expected string, received undefined") && friendlyMessages[key]) {
            message = friendlyMessages[key];
          }
          if (!fieldErrors[key]) fieldErrors[key] = [];
          fieldErrors[key].push(message);
        });
        return res.status(400).json({
          success: false,
          message: "Validasi gagal",
          errors: fieldErrors,
        });
      }
      next(err);
    }
  };
};
