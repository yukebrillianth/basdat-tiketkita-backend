import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(
    "ALTER TABLE events MODIFY COLUMN poster_url TEXT NULL"
  );
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(
    "ALTER TABLE events MODIFY COLUMN poster_url VARCHAR(500) NULL"
  );
};
