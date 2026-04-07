import mysql from "mysql2/promise";

export const up = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE events (
      id CHAR(36) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT NULL,
      category_id CHAR(36) NOT NULL,
      venue_id CHAR(36) NOT NULL,
      date_start DATETIME NOT NULL,
      date_end DATETIME NOT NULL,
      status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
      poster_url VARCHAR(500) NULL,
      created_by CHAR(36) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (venue_id) REFERENCES venues(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);
};

export const down = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute("DROP TABLE IF EXISTS events");
};
