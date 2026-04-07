import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE venues (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      city VARCHAR(100) NOT NULL,
      address TEXT NOT NULL,
      capacity INT UNSIGNED NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS venues");
};
