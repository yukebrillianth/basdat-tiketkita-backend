import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Venue } from "../../types";

interface VenueWithStats extends Venue {
  events_count: number;
}

export const findAll = async (): Promise<VenueWithStats[]> => {
  const [rows] = await pool.execute<(VenueWithStats & RowDataPacket)[]>(
    `SELECT v.*, COUNT(e.id) AS events_count
     FROM venues v
     LEFT JOIN events e ON e.venue_id = v.id AND e.deleted_at IS NULL
     GROUP BY v.id
     ORDER BY v.name ASC`,
  );
  return rows;
};

export const findById = async (id: string): Promise<Venue | null> => {
  const [rows] = await pool.execute<(Venue & RowDataPacket)[]>(
    "SELECT * FROM venues WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

interface CreateVenueData {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
}

export const create = async (data: CreateVenueData): Promise<void> => {
  await pool.execute<ResultSetHeader>(
    "INSERT INTO venues (id, name, city, address, capacity) VALUES (?, ?, ?, ?, ?)",
    [data.id, data.name, data.city, data.address, data.capacity],
  );
};

interface UpdateVenueData {
  name?: string;
  city?: string;
  address?: string;
  capacity?: number;
}

export const update = async (
  id: string,
  data: UpdateVenueData,
): Promise<boolean> => {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }
  if (data.city !== undefined) {
    fields.push("city = ?");
    values.push(data.city);
  }
  if (data.address !== undefined) {
    fields.push("address = ?");
    values.push(data.address);
  }
  if (data.capacity !== undefined) {
    fields.push("capacity = ?");
    values.push(data.capacity);
  }

  if (fields.length === 0) return false;

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE venues SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );

  return result.affectedRows > 0;
};

export const remove = async (id: string): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM venues WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
};
