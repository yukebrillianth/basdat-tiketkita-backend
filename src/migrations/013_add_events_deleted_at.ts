import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(
    "ALTER TABLE events ADD COLUMN deleted_at DATETIME NULL"
  );
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("ALTER TABLE events DROP COLUMN deleted_at");
};
