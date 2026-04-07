import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Wishlist } from "../../types";

export const findAllByUser = async (userId: string) => {
  return [];
};

export const findByUserAndEvent = async (userId: string, eventId: string): Promise<Wishlist | null> => {
  return null;
};

export const create = async (data: Partial<Wishlist>): Promise<string> => {
  return "";
};

export const remove = async (userId: string, eventId: string): Promise<boolean> => {
  return false;
};
