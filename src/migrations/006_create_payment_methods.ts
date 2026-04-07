import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE payment_methods (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      type ENUM('bank', 'ewallet', 'cc', 'va', 'qris') NOT NULL,
      code VARCHAR(50) NOT NULL UNIQUE,
      admin_fee DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      admin_fee_percent DECIMAL(5,2) NOT NULL DEFAULT 0.00,
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS payment_methods");
};
