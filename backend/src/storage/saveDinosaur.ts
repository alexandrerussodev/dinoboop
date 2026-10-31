
import type { DatabaseSync } from 'node:sqlite';
import type { Dinosaur } from '../game/dinosaur.js';

export function saveDinosaur(
  database: DatabaseSync,
  dinosaur: Dinosaur,
  playerId: string
): void {
  const statement = database.prepare(`
    INSERT INTO dinosaurs (
      id,
      player_id,
      name,
      stage,
      status,
      hunger,
      happiness,
      energy,
      created_at,
      last_cared_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  statement.run(
    dinosaur.id,
    playerId,
    dinosaur.name,
    dinosaur.stage,
    dinosaur.status,
    dinosaur.hunger,
    dinosaur.happiness,
    dinosaur.energy,
    dinosaur.createdAt,
    dinosaur.lastCaredAt
  );
}
