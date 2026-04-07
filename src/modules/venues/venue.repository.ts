import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Venue } from "../../types";

export const findAll = async (page: number, limit: number) => {
  return { items: [], total: 0 };
};

export const findById = async (id: string): Promise<Venue | null> => {
  return null;
};

export const create = async (data: Partial<Venue>): Promise<string> => {
  return "";
};

export const update = async (id: string, data: Partial<Venue>): Promise<boolean> => {
  return false;
};

export const remove = async (id: string): Promise<boolean> => {
  return false;
};
