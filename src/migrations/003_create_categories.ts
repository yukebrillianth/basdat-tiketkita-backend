import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE categories (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS categories");
};
