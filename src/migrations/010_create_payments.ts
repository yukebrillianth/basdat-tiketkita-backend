import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE payments (
      id CHAR(36) PRIMARY KEY,
      order_id CHAR(36) NOT NULL UNIQUE,
      payment_method_id CHAR(36) NOT NULL,
      unique_code SMALLINT UNSIGNED DEFAULT 0,
      total DECIMAL(12,2) NOT NULL,
      payment_code VARCHAR(100) NULL,
      status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
      paid_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS payments");
};
