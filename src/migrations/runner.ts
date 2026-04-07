import pool from "../config/database";
import * as fs from "fs";
import * as path from "path";
import mysql from "mysql2/promise";

interface MigrationModule {
  up: (conn: mysql.PoolConnection) => Promise<void>;
  down: (conn: mysql.PoolConnection) => Promise<void>;
}

const MIGRATIONS_DIR = path.join(__dirname);

const ensureMigrationTable = async (conn: mysql.PoolConnection): Promise<void> => {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const getExecutedMigrations = async (conn: mysql.PoolConnection): Promise<string[]> => {
  const [rows]: any = await conn.execute(
    "SELECT name FROM _migrations ORDER BY id",
  );
  return rows.map((r: any) => r.name);
};

const runUp = async (): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await ensureMigrationTable(conn);
    const executed = await getExecutedMigrations(conn);

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter(
        (f) =>
          f.endsWith(".ts") && f !== "runner.ts" && /^\d{3}_/.test(f),
      )
      .sort();

    const pending = files.filter((f) => !executed.includes(f));

    if (pending.length === 0) {
      console.log("No pending migrations.");
      return;
    }

    for (const file of pending) {
      console.log(`Running migration: ${file}`);
      const migration = require(path.join(MIGRATIONS_DIR, file)) as MigrationModule;

      await conn.beginTransaction();
      try {
        await migration.up(conn);
        await conn.execute(
          "INSERT INTO _migrations (name) VALUES (?)",
          [file],
        );
        await conn.commit();
        console.log(`✓ ${file} executed successfully`);
      } catch (err) {
        await conn.rollback();
        console.error(`✗ ${file} failed:`, err);
        throw err;
      }
    }

    console.log("All migrations completed.");
  } finally {
    conn.release();
  }
};

const runDown = async (): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await ensureMigrationTable(conn);
    const [rows]: any = await conn.execute(
      "SELECT name FROM _migrations ORDER BY id DESC LIMIT 1",
    );

    if (rows.length === 0) {
      console.log("No migrations to rollback.");
      return;
    }

    const lastMigration = rows[0].name;
    console.log(`Rolling back: ${lastMigration}`);

    const migration = require(path.join(MIGRATIONS_DIR, lastMigration)) as MigrationModule;

    await conn.beginTransaction();
    try {
      await migration.down(conn);
      await conn.execute("DELETE FROM _migrations WHERE name = ?", [
        lastMigration,
      ]);
      await conn.commit();
      console.log(`✓ ${lastMigration} rolled back successfully`);
    } catch (err) {
      await conn.rollback();
      console.error(`✗ ${lastMigration} rollback failed:`, err);
      throw err;
    }
  } finally {
    conn.release();
  }
};

const command = process.argv[2];

if (command === "up") {
  runUp()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else if (command === "down") {
  runDown()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else {
  console.log("Usage: ts-node runner.ts [up|down]");
  process.exit(1);
}
