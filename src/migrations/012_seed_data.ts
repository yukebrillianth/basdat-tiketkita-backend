import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  const paymentMethods = [
    { name: "GoPay", type: "ewallet", code: "gopay", admin_fee: 0, admin_fee_percent: 0 },
    { name: "OVO", type: "ewallet", code: "ovo", admin_fee: 0, admin_fee_percent: 0 },
    { name: "Dana", type: "ewallet", code: "dana", admin_fee: 0, admin_fee_percent: 0 },
    { name: "QRIS", type: "qris", code: "qris", admin_fee: 0, admin_fee_percent: 0.7 },
    { name: "BNI Virtual Account", type: "va", code: "bni_va", admin_fee: 4000, admin_fee_percent: 0 },
    { name: "BCA Virtual Account", type: "va", code: "bca_va", admin_fee: 4000, admin_fee_percent: 0 },
    { name: "Mandiri Virtual Account", type: "va", code: "mandiri_va", admin_fee: 4000, admin_fee_percent: 0 },
    { name: "Transfer BCA", type: "bank", code: "bca_tf", admin_fee: 0, admin_fee_percent: 0 },
    { name: "Kartu Kredit / Debit", type: "cc", code: "cc", admin_fee: 0, admin_fee_percent: 1.5 },
  ];

  for (const pm of paymentMethods) {
    await conn.execute(
      `INSERT INTO payment_methods (id, name, type, code, admin_fee, admin_fee_percent) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), pm.name, pm.type, pm.code, pm.admin_fee, pm.admin_fee_percent],
    );
  }

  const categories = ["Konser", "Festival", "Seminar", "Olahraga", "Pameran"];
  for (const cat of categories) {
    await conn.execute(
      `INSERT INTO categories (id, name) VALUES (?, ?)`,
      [uuidv4(), cat],
    );
  }

  const adminId = uuidv4();
  await conn.execute(
    `INSERT INTO users (id, fullname, email, password_hash, role, is_verified) VALUES (?, ?, ?, ?, ?, ?)`,
    [adminId, "Admin TiketKita", "admin@tiketkita.com", "$2a$10$dummyhashforadminaccount", "admin", 1],
  );

  const promos = [
    { code: "TIKET10", type: "percentage", value: 10, min_purchase: 100000, max_discount: 50000 },
    { code: "HEMAT50K", type: "nominal", value: 50000, min_purchase: 200000, max_discount: null },
    { code: "QRISDAY", type: "percentage", value: 15, min_purchase: 50000, max_discount: 75000 },
  ];

  for (const p of promos) {
    await conn.execute(
      `INSERT INTO promo_codes (id, code, type, value, min_purchase, max_discount, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), p.code, p.type, p.value, p.min_purchase, p.max_discount, "2025-01-01", "2025-12-31", adminId],
    );
  }
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DELETE FROM payment_methods");
  await conn.execute("DELETE FROM categories");
  await conn.execute("DELETE FROM promo_codes");
  await conn.execute("DELETE FROM users WHERE role = 'admin'");
};
