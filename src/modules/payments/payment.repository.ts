import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { Payment } from "../../types";

export const findByOrderId = async (orderId: string): Promise<Payment | null> => {
  const [rows] = await pool.execute<(Payment & RowDataPacket)[]>(
    "SELECT * FROM payments WHERE order_id = ?",
    [orderId],
  );
  return rows[0] ?? null;
};

export const findById = async (id: string): Promise<Payment | null> => {
  const [rows] = await pool.execute<(Payment & RowDataPacket)[]>(
    "SELECT * FROM payments WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

export const confirmPayment = async (
  conn: PoolConnection,
  paymentId: string,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE payments SET status = 'success', paid_at = NOW() WHERE id = ?",
    [paymentId],
  );
};

export const failPayment = async (
  conn: PoolConnection,
  paymentId: string,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE payments SET status = 'failed' WHERE id = ?",
    [paymentId],
  );
};
