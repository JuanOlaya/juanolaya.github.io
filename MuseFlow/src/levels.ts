import demanding from '../json/platforms-demanding.json';
import undemanding from '../json/platforms-undemanding-gaming.json';
import training from '../json/platforms-undemanding-training.json';
import { type PlatformSpec, parseLevel } from './columns.ts';

export interface Level {
  id: string;
  label: string;
  platforms: PlatformSpec[];
}

/** The study's three level files: a short training run, then the calm and the demanding game. */
export const LEVELS: readonly Level[] = [
  { id: 'training', label: 'Training', platforms: parseLevel(training) },
  { id: 'undemanding', label: 'Undemanding', platforms: parseLevel(undemanding) },
  { id: 'demanding', label: 'Demanding', platforms: parseLevel(demanding) },
];

/** `?level=demanding` picks a level; anything else starts with training. */
export function levelIndexFromSearch(search: string): number {
  const id = new URLSearchParams(search).get('level');
  return Math.max(
    0,
    LEVELS.findIndex((level) => level.id === id),
  );
}

export function formatDuration(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
