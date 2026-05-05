import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";

interface MySqlError extends Error {
  code: string;
  sqlMessage?: string;
}

const formatZodError = (err: ZodError): Record<string, string[]> => {
  const fieldErrors: Record<string, string[]> = {};
  err.issues.forEach((e) => {
    const key = e.path.join(".") || "_root";
    if (!fieldErrors[key]) fieldErrors[key] = [];
    fieldErrors[key].push(e.message);
  });
  return fieldErrors;
};

const isMySqlError = (err: unknown): err is MySqlError => {
  return err instanceof Error && "code" in err;
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validasi gagal",
      errors: formatZodError(err),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (isMySqlError(err)) {
    if (err.code === "ER_DUP_ENTRY") {
      const match = err.sqlMessage?.match(/Duplicate entry '.*' for key '(.*?)'/);
      const field = match ? match[1] : undefined;

      if (field === "email") {
        return res.status(409).json({
          success: false,
          message: "Email sudah terdaftar",
          errors: { email: ["Email sudah terdaftar"] },
        });
      }

      return res.status(409).json({
        success: false,
        message: "Data sudah ada",
      });
    }

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "Data referensi tidak ditemukan",
      });
    }

    console.error(`[MySQL Error] ${err.code}: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada database",
    });
  }

  if (err instanceof Error) {
    console.error(`[ERROR] ${err.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

  console.error(`[ERROR] ${err}`);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
