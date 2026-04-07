import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE orders (
      id CHAR(36) PRIMARY KEY,
      order_number VARCHAR(50) NOT NULL UNIQUE,
      user_id CHAR(36) NOT NULL,
      promo_id CHAR(36) NULL,
      subtotal DECIMAL(12,2) NOT NULL,
      discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      admin_fee DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      total DECIMAL(12,2) NOT NULL,
      status ENUM('pending', 'waiting_payment', 'paid', 'cancelled', 'expired') DEFAULT 'pending',
      expired_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (promo_id) REFERENCES promo_codes(id)
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS orders");
};
