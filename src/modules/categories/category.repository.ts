import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Category } from "../../types";

export const findAll = async (): Promise<Category[]> => {
  const [rows] = await pool.execute<(Category & RowDataPacket)[]>(
    "SELECT * FROM categories ORDER BY name ASC",
  );
  return rows;
};

export const findById = async (id: string): Promise<Category | null> => {
  const [rows] = await pool.execute<(Category & RowDataPacket)[]>(
    "SELECT * FROM categories WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

export const create = async (data: {
  id: string;
  name: string;
}): Promise<void> => {
  await pool.execute<ResultSetHeader>(
    "INSERT INTO categories (id, name) VALUES (?, ?)",
    [data.id, data.name],
  );
};

export const update = async (
  id: string,
  data: { name?: string },
): Promise<boolean> => {
  const fields: string[] = [];
  const values: string[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (fields.length === 0) return false;

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );

  return result.affectedRows > 0;
};

export const remove = async (id: string): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM categories WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
};
