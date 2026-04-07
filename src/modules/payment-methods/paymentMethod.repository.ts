import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { PaymentMethod } from "../../types";

export const findAll = async () => {
  return [];
};

export const findById = async (id: string): Promise<PaymentMethod | null> => {
  return null;
};

export const create = async (data: Partial<PaymentMethod>): Promise<string> => {
  return "";
};

export const update = async (id: string, data: Partial<PaymentMethod>): Promise<boolean> => {
  return false;
};
