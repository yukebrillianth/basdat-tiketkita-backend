import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Event } from "../../types";

export const findAll = async (page: number, limit: number) => {
  return { items: [], total: 0 };
};

export const findById = async (id: string): Promise<Event | null> => {
  return null;
};

export const create = async (data: Partial<Event>): Promise<string> => {
  return "";
};

export const update = async (id: string, data: Partial<Event>): Promise<boolean> => {
  return false;
};

export const remove = async (id: string): Promise<boolean> => {
  return false;
};
