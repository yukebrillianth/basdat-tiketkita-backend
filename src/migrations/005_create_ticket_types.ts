import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE ticket_types (
      id CHAR(36) PRIMARY KEY,
      event_id CHAR(36) NOT NULL,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(12,2) NOT NULL,
      quota INT UNSIGNED NOT NULL,
      available INT UNSIGNED NOT NULL,
      max_per_order TINYINT UNSIGNED DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id)
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS ticket_types");
};
