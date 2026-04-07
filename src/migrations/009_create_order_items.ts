import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE order_items (
      id CHAR(36) PRIMARY KEY,
      order_id CHAR(36) NOT NULL,
      ticket_type_id CHAR(36) NOT NULL,
      ticket_name VARCHAR(100) NOT NULL,
      ticket_price DECIMAL(12,2) NOT NULL,
      quantity TINYINT UNSIGNED NOT NULL,
      subtotal DECIMAL(12,2) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id)
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS order_items");
};
