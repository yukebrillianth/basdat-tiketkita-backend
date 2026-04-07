import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Payment } from "../../types";

export const findByOrderId = async (orderId: string): Promise<Payment | null> => {
  return null;
};

export const create = async (data: Partial<Payment>): Promise<string> => {
  return "";
};

export const updateStatus = async (orderId: string, status: string): Promise<boolean> => {
  return false;
};
