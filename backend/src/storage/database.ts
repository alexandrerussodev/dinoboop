
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const databasePath = fileURLToPath(
  new URL('../../data/dinoboop.sqlite', import.meta.url)
);

export function initializeDatabase(): DatabaseSync {
  mkdirSync(dirname(databasePath), { recursive: true });

  const database = new DatabaseSync(databasePath);

  database.exec(`
    CREATE TABLE IF NOT EXISTS dinosaurs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      stage TEXT NOT NULL,
      status TEXT NOT NULL,
      hunger INTEGER NOT NULL,
      happiness INTEGER NOT NULL,
      energy INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      last_cared_at TEXT NOT NULL
    )
  `);

  
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL
    );
  `);

  const columns = database
    .prepare('PRAGMA table_info(dinosaurs)')
    .all() as Array<{ name: string }>;

  const hasPlayerId = columns.some(
    (column) => column.name === 'player_id'
  );

  if (!hasPlayerId) {
    database.exec(`
      ALTER TABLE dinosaurs
      ADD COLUMN player_id TEXT REFERENCES players(id)
    `);
  }

  
    database.exec(`
    CREATE TABLE IF NOT EXISTS guest_sessions (
        token_hash TEXT PRIMARY KEY,
        player_id TEXT NOT NULL REFERENCES players(id),
        expires_at TEXT NOT NULL
    );
    `);


  return database;
}
