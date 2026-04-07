import { Response } from "express";

export const success = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
) => res.status(statusCode).json({ success: true, message, data });

export const error = (
  res: Response,
  message = "Error",
  statusCode = 400,
  errors: unknown = null,
) => res.status(statusCode).json({ success: false, message, errors });
