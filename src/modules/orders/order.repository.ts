import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Order } from "../../types";

export const findAllByUser = async (userId: string, page: number, limit: number) => {
  return { items: [], total: 0 };
};

export const findById = async (id: string): Promise<Order | null> => {
  return null;
};

export const create = async (data: Partial<Order>): Promise<string> => {
  return "";
};

export const update = async (id: string, data: Partial<Order>): Promise<boolean> => {
  return false;
};

export const cancel = async (id: string): Promise<boolean> => {
  return false;
};
