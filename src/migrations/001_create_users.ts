import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE users (
      id CHAR(36) PRIMARY KEY,
      fullname VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      phone VARCHAR(20) NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      is_verified TINYINT(1) DEFAULT 0,
      verification_code VARCHAR(6) NULL,
      verification_code_expires_at DATETIME NULL,
      reset_code VARCHAR(6) NULL,
      reset_code_expires_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS users");
};
