export type DinosaurStage = 'baby' | 'young' | 'adult';

export type DinosaurStatus = 'alive' | 'ghost';

export interface Dinosaur {
  id: string;
  name: string;
  stage: DinosaurStage;
  status: DinosaurStatus;
  hunger: number;
  happiness: number;
  energy: number;
  createdAt: string;
  lastCaredAt: string;
}
