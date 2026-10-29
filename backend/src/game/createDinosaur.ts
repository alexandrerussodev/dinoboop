import { randomUUID } from 'node:crypto';
import type { Dinosaur } from './dinosaur.js';

export function createDinosaur(name: string): Dinosaur {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    name,
    stage: 'baby',
    status: 'alive',
    hunger: 0,
    happiness: 100,
    energy: 100,
    createdAt: now,
    lastCaredAt: now,
  };
}
