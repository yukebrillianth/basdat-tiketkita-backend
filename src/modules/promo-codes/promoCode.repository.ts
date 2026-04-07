import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { PromoCode } from "../../types";

export const findByCode = async (code: string): Promise<PromoCode | null> => {
  return null;
};

export const findAll = async (page: number, limit: number) => {
  return { items: [], total: 0 };
};

export const create = async (data: Partial<PromoCode>): Promise<string> => {
  return "";
};

export const update = async (id: string, data: Partial<PromoCode>): Promise<boolean> => {
  return false;
};
