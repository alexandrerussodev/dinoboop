
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function findGuestSession(
  database: DatabaseSync,
  token: string
): string | null {
  const session = database.prepare(`
    SELECT player_id AS playerId
    FROM guest_sessions
    WHERE token_hash = ? AND expires_at > ?
  `).get(
    hashToken(token),
    new Date().toISOString()
  ) as { playerId: string } | undefined;

  return session?.playerId ?? null;
}

export function createGuestSession(database: DatabaseSync): string {
  const playerId = randomUUID();
  const token = randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + SESSION_DURATION_MS
  ).toISOString();

  database.exec('BEGIN');

  try {
    database.prepare(`
      INSERT INTO players (id, created_at)
      VALUES (?, ?)
    `).run(playerId, now.toISOString());

    database.prepare(`
      INSERT INTO guest_sessions (token_hash, player_id, expires_at)
      VALUES (?, ?, ?)
    `).run(hashToken(token), playerId, expiresAt);

    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }

  return token;
}
