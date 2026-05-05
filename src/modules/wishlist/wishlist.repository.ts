import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Wishlist } from "../../types";

interface WishlistWithEvent extends Wishlist {
  title: string;
  poster_url: string | null;
  date_start: Date;
}

export const findAllByUser = async (userId: string): Promise<WishlistWithEvent[]> => {
  const [rows] = await pool.execute<(WishlistWithEvent & RowDataPacket)[]>(
    `SELECT w.*, e.title, e.poster_url, e.date_start
     FROM wishlist w
     JOIN events e ON e.id = w.event_id
     WHERE w.user_id = ? AND e.deleted_at IS NULL
     ORDER BY w.created_at DESC`,
    [userId],
  );
  return rows;
};

export const findByUserAndEvent = async (
  userId: string,
  eventId: string,
): Promise<Wishlist | null> => {
  const [rows] = await pool.execute<(Wishlist & RowDataPacket)[]>(
    "SELECT * FROM wishlist WHERE user_id = ? AND event_id = ?",
    [userId, eventId],
  );
  return rows[0] ?? null;
};

export const create = async (id: string, userId: string, eventId: string): Promise<void> => {
  await pool.execute<ResultSetHeader>(
    "INSERT INTO wishlist (id, user_id, event_id) VALUES (?, ?, ?)",
    [id, userId, eventId],
  );
};

export const remove = async (userId: string, eventId: string): Promise<void> => {
  await pool.execute<ResultSetHeader>(
    "DELETE FROM wishlist WHERE user_id = ? AND event_id = ?",
    [userId, eventId],
  );
};
