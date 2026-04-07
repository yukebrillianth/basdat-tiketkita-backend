import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE promo_codes (
      id CHAR(36) PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      type ENUM('percentage', 'nominal') NOT NULL,
      value DECIMAL(12,2) NOT NULL,
      min_purchase DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      max_discount DECIMAL(12,2) NULL,
      quota INT UNSIGNED NULL,
      used_count INT UNSIGNED DEFAULT 0,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_by CHAR(36) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS promo_codes");
};
