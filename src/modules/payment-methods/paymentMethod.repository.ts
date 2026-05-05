import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { PaymentMethod } from "../../types";

export const findAllActive = async (): Promise<PaymentMethod[]> => {
  const [rows] = await pool.execute<(PaymentMethod & RowDataPacket)[]>(
    "SELECT * FROM payment_methods WHERE is_active = 1 ORDER BY name",
  );
  return rows;
};

export const findAllAdmin = async (): Promise<PaymentMethod[]> => {
  const [rows] = await pool.execute<(PaymentMethod & RowDataPacket)[]>(
    "SELECT * FROM payment_methods ORDER BY name",
  );
  return rows;
};

export const findById = async (id: string): Promise<PaymentMethod | null> => {
  const [rows] = await pool.execute<(PaymentMethod & RowDataPacket)[]>(
    "SELECT * FROM payment_methods WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

interface CreatePaymentMethodData {
  id: string;
  name: string;
  type: string;
  code: string;
  admin_fee: number;
  admin_fee_percent: number;
  is_active: boolean;
}

export const create = async (data: CreatePaymentMethodData): Promise<void> => {
  await pool.execute<ResultSetHeader>(
    `INSERT INTO payment_methods (id, name, type, code, admin_fee, admin_fee_percent, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id,
      data.name,
      data.type,
      data.code,
      data.admin_fee,
      data.admin_fee_percent,
      data.is_active ? 1 : 0,
    ],
  );
};

interface UpdatePaymentMethodData {
  name?: string;
  type?: string;
  code?: string;
  admin_fee?: number;
  admin_fee_percent?: number;
  is_active?: boolean;
}

export const update = async (id: string, data: UpdatePaymentMethodData): Promise<void> => {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }
  if (data.type !== undefined) {
    fields.push("type = ?");
    values.push(data.type);
  }
  if (data.code !== undefined) {
    fields.push("code = ?");
    values.push(data.code);
  }
  if (data.admin_fee !== undefined) {
    fields.push("admin_fee = ?");
    values.push(data.admin_fee);
  }
  if (data.admin_fee_percent !== undefined) {
    fields.push("admin_fee_percent = ?");
    values.push(data.admin_fee_percent);
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return;

  values.push(id);
  await pool.execute<ResultSetHeader>(
    `UPDATE payment_methods SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );
};
