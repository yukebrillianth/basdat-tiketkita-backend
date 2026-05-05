import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { TicketType } from "../../types";

export const findAllByEvent = async (eventId: string): Promise<TicketType[]> => {
  const [rows] = await pool.execute<(TicketType & RowDataPacket)[]>(
    "SELECT * FROM ticket_types WHERE event_id = ? ORDER BY price ASC",
    [eventId],
  );
  return rows;
};

export const findById = async (id: string): Promise<TicketType | null> => {
  const [rows] = await pool.execute<(TicketType & RowDataPacket)[]>(
    "SELECT * FROM ticket_types WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

interface CreateTicketData {
  id: string;
  event_id: string;
  name: string;
  price: number;
  quota: number;
  available: number;
  max_per_order?: number;
}

export const create = async (data: CreateTicketData): Promise<TicketType | null> => {
  await pool.execute<ResultSetHeader>(
    `INSERT INTO ticket_types (id, event_id, name, price, quota, available, max_per_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id,
      data.event_id,
      data.name,
      data.price,
      data.quota,
      data.available,
      data.max_per_order ?? 5,
    ],
  );

  return findById(data.id);
};

interface UpdateTicketData {
  name?: string;
  price?: number;
  quota?: number;
  max_per_order?: number;
}

export const update = async (id: string, data: UpdateTicketData): Promise<TicketType | null> => {
  const current = await findById(id);
  if (!current) return null;

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }
  if (data.price !== undefined) {
    fields.push("price = ?");
    values.push(data.price);
  }
  if (data.quota !== undefined) {
    const delta = data.quota - current.quota;
    const newAvailable = Math.max(0, current.available + delta);
    fields.push("quota = ?");
    values.push(data.quota);
    fields.push("available = ?");
    values.push(newAvailable);
  }
  if (data.max_per_order !== undefined) {
    fields.push("max_per_order = ?");
    values.push(data.max_per_order);
  }

  if (fields.length === 0) return current;

  values.push(id);

  await pool.execute<ResultSetHeader>(
    `UPDATE ticket_types SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );

  return findById(id);
};
