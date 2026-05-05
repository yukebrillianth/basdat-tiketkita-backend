import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { PromoCode, PaginatedResult } from "../../types";

export const findAll = async (
  page: number,
  limit: number,
  offset: number,
): Promise<PaginatedResult<PromoCode>> => {
  const [countRows] = await pool.execute<(RowDataPacket & { total: number })[]>(
    "SELECT COUNT(*) AS total FROM promo_codes",
  );
  const total = countRows[0].total;

  const [rows] = await pool.execute<(PromoCode & RowDataPacket)[]>(
    "SELECT * FROM promo_codes ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [String(limit), String(offset)],
  );

  return {
    items: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const findById = async (id: string): Promise<PromoCode | null> => {
  const [rows] = await pool.execute<(PromoCode & RowDataPacket)[]>(
    "SELECT * FROM promo_codes WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

export const findByCode = async (code: string): Promise<PromoCode | null> => {
  const [rows] = await pool.execute<(PromoCode & RowDataPacket)[]>(
    "SELECT * FROM promo_codes WHERE code = ? AND is_active = 1",
    [code],
  );
  return rows[0] ?? null;
};

interface CreatePromoCodeData {
  id: string;
  code: string;
  type: string;
  value: number;
  min_purchase: number;
  max_discount: number | null;
  quota: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_by: string;
}

export const create = async (data: CreatePromoCodeData): Promise<void> => {
  await pool.execute<ResultSetHeader>(
    `INSERT INTO promo_codes (id, code, type, value, min_purchase, max_discount, quota, start_date, end_date, is_active, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id,
      data.code,
      data.type,
      data.value,
      data.min_purchase,
      data.max_discount,
      data.quota,
      data.start_date,
      data.end_date,
      data.is_active ? 1 : 0,
      data.created_by,
    ],
  );
};

interface UpdatePromoCodeData {
  code?: string;
  type?: string;
  value?: number;
  min_purchase?: number;
  max_discount?: number | null;
  quota?: number | null;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export const update = async (id: string, data: UpdatePromoCodeData): Promise<void> => {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.code !== undefined) {
    fields.push("code = ?");
    values.push(data.code);
  }
  if (data.type !== undefined) {
    fields.push("type = ?");
    values.push(data.type);
  }
  if (data.value !== undefined) {
    fields.push("value = ?");
    values.push(data.value);
  }
  if (data.min_purchase !== undefined) {
    fields.push("min_purchase = ?");
    values.push(data.min_purchase);
  }
  if (data.max_discount !== undefined) {
    fields.push("max_discount = ?");
    values.push(data.max_discount);
  }
  if (data.quota !== undefined) {
    fields.push("quota = ?");
    values.push(data.quota);
  }
  if (data.start_date !== undefined) {
    fields.push("start_date = ?");
    values.push(data.start_date);
  }
  if (data.end_date !== undefined) {
    fields.push("end_date = ?");
    values.push(data.end_date);
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return;

  values.push(id);
  await pool.execute<ResultSetHeader>(
    `UPDATE promo_codes SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );
};
