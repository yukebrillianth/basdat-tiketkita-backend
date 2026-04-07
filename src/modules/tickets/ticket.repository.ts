import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { TicketType } from "../../types";

export const findAllByEvent = async (eventId: string) => {
  return [];
};

export const findById = async (id: string): Promise<TicketType | null> => {
  return null;
};

export const create = async (data: Partial<TicketType>): Promise<string> => {
  return "";
};

export const update = async (id: string, data: Partial<TicketType>): Promise<boolean> => {
  return false;
};

export const remove = async (id: string): Promise<boolean> => {
  return false;
};
