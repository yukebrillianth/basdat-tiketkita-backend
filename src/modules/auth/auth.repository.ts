import pool from "../../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { User } from "../../types";

export const findById = async (id: string): Promise<User | null> => {
  const [rows] = await pool.execute<(User & RowDataPacket)[]>(
    "SELECT * FROM users WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await pool.execute<(User & RowDataPacket)[]>(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );
  return rows[0] ?? null;
};

export const create = async (data: {
  id: string;
  fullname: string;
  email: string;
  phone: string | null;
  password_hash: string;
  verification_code: string;
  verification_code_expires_at: Date;
}): Promise<User> => {
  const {
    id,
    fullname,
    email,
    phone,
    password_hash,
    verification_code,
    verification_code_expires_at,
  } = data;
  await pool.execute(
    `INSERT INTO users (id, fullname, email, phone, password_hash, verification_code, verification_code_expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      fullname,
      email,
      phone,
      password_hash,
      verification_code,
      verification_code_expires_at,
    ],
  );
  const user = await findById(id);
  if (!user) throw new Error("Failed to retrieve created user");
  return user;
};

export const updateVerification = async (
  id: string,
): Promise<void> => {
  await pool.execute(
    `UPDATE users SET is_verified = 1, verification_code = NULL, verification_code_expires_at = NULL WHERE id = ?`,
    [id],
  );
};

export const updateVerificationCode = async (
  id: string,
  code: string,
  expiresAt: Date,
): Promise<void> => {
  await pool.execute(
    `UPDATE users SET verification_code = ?, verification_code_expires_at = ? WHERE id = ?`,
    [code, expiresAt, id],
  );
};

export const updateResetCode = async (
  id: string,
  code: string,
  expiresAt: Date,
): Promise<void> => {
  await pool.execute(
    `UPDATE users SET reset_code = ?, reset_code_expires_at = ? WHERE id = ?`,
    [code, expiresAt, id],
  );
};

export const updatePassword = async (
  id: string,
  password_hash: string,
): Promise<void> => {
  await pool.execute(
    `UPDATE users SET password_hash = ?, reset_code = NULL, reset_code_expires_at = NULL WHERE id = ?`,
    [password_hash, id],
  );
};
