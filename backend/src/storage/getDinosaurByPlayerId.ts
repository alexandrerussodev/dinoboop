import type { DatabaseSync } from 'node:sqlite';
import type { Dinosaur } from '../game/dinosaur.js';

export function getDinosaurByPlayerId(
  database: DatabaseSync,
  playerId: string
): Dinosaur | null {
  const dinosaur = database.prepare(`
    SELECT
      id,
      name,
      stage,
      status,
      hunger,
      happiness,
      energy,
      created_at AS createdAt,
      last_cared_at AS lastCaredAt
    FROM dinosaurs
    WHERE player_id = ?
    LIMIT 1
  `).get(playerId) as Dinosaur | undefined;

  return dinosaur ?? null;
}
