import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Category } from "../../types";

export const findAll = async () => {
  return [];
};

export const findById = async (id: string): Promise<Category | null> => {
  return null;
};

export const create = async (data: Partial<Category>): Promise<string> => {
  return "";
};

export const update = async (id: string, data: Partial<Category>): Promise<boolean> => {
  return false;
};

export const remove = async (id: string): Promise<boolean> => {
  return false;
};
