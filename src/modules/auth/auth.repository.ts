import pool from "../../config/database";
import { RowDataPacket } from "mysql2";
import { User } from "../../types";

export const findById = async (id: string): Promise<User | null> => {
  const [rows] = await pool.execute<(User & RowDataPacket)[]>(
    "SELECT * FROM users WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};
