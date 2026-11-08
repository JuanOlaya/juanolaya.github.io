/**
 * Typed access to what MemoDeutsch keeps in `localStorage`, with a schema version and ordered migrations.
 *
 * Key names stay exactly as the legacy pages wrote them, so progress and settings saved before this layer
 * existed keep working, and pages that still touch `localStorage` directly read the same values.
 */

/** The subset of the Web Storage API this layer needs; tests pass an in-memory store. */
export type KeyValueStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;

export const STORAGE_VERSION_KEY = 'memodeutsch-storage-version';

/** Bump the `script.js` cache name here only: migration 2 removes every other `verbAppCache_*` key. */
export const CURRENT_VERB_CACHE_KEY = 'verbAppCache_v46_wortfamilie_search_ready';

const VERB_CACHE_PREFIX = 'verbAppCache_';
const LEGACY_SETTINGS_FLAG = 'verbenSettingsMigration_v1_show_ik_lid';

type Migration = (store: KeyValueStore) => void;

function showIkAndLidTags(store: KeyValueStore): void {
  // Newer visibility tags default to visible even for users carrying older hidden states.
  if (!store.getItem(LEGACY_SETTINGS_FLAG)) {
    store.setItem('toggle-ik-switch', 'true');
    store.setItem('toggle-lid-switch', 'true');
  }
  store.removeItem(LEGACY_SETTINGS_FLAG);
}

function removeStaleVerbCaches(store: KeyValueStore): void {
  // Each cache bump left the previous multi-MB snapshot behind, eating the origin's storage quota.
  const keys = Array.from({ length: store.length }, (_, index) => store.key(index));
  for (const key of keys) {
    if (key?.startsWith(VERB_CACHE_PREFIX) && key !== CURRENT_VERB_CACHE_KEY) store.removeItem(key);
  }
}

/** Migration `n` (1-based) upgrades a store from schema version `n - 1` to `n`. Append only. */
const migrations: readonly Migration[] = [showIkAndLidTags, removeStaleVerbCaches];

export const STORAGE_SCHEMA_VERSION = migrations.length;

function readVersion(store: KeyValueStore): number {
  const version = Number(store.getItem(STORAGE_VERSION_KEY));
  return Number.isInteger(version) && version > 0 ? version : 0;
}

/** Brings `store` up to `STORAGE_SCHEMA_VERSION`; a store written by a newer version is left alone. */
export function migrateStorage(store: KeyValueStore): void {
  const from = readVersion(store);
  if (from >= STORAGE_SCHEMA_VERSION) return;
  migrations.slice(from).forEach((migrate) => migrate(store));
  store.setItem(STORAGE_VERSION_KEY, String(STORAGE_SCHEMA_VERSION));
}

/** The snapshot `script.js` saves so the verb list renders before the network answers. */
export interface VerbCache {
  allVerbsData: Record<string, unknown>;
  verbGroupsByLevel: Record<string, unknown>;
  [field: string]: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseVerbCache(raw: string | null): VerbCache | null {
  if (raw === null) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data) || !isRecord(data.allVerbsData) || !isRecord(data.verbGroupsByLevel)) return null;
    return data as VerbCache;
  } catch {
    return null;
  }
}

function parseGroupIndex(raw: string | null): number | null {
  // `parseInt` matches what the legacy page used, so values like "7.0" it wrote still load.
  const group = Number.parseInt(raw ?? '', 10);
  return Number.isNaN(group) ? null : group;
}

export function createMemoStorage(store: KeyValueStore) {
  return {
    getCurrentLevel: (): string | null => store.getItem('currentLevel'),
    getSavedGroup: (level: string): number | null => parseGroupIndex(store.getItem(`progress_${level}`)),
    saveProgress(level: string, groupIndex: number): void {
      store.setItem(`progress_${level}`, String(groupIndex));
      store.setItem('currentLevel', level);
    },
    getToggle(id: string): boolean | null {
      const value = store.getItem(`toggle-${id}`);
      return value === null ? null : value === 'true';
    },
    setToggle: (id: string, checked: boolean): void => store.setItem(`toggle-${id}`, String(checked)),
    getCardVersion: (): string | null => store.getItem('verben-card-version'),
    setCardVersion: (version: string): void => store.setItem('verben-card-version', version),
    readVerbCache: (): VerbCache | null => parseVerbCache(store.getItem(CURRENT_VERB_CACHE_KEY)),
    /** Throws when the payload exceeds the quota, so the caller can retry with a smaller one. */
    writeVerbCache: (payload: VerbCache): void =>
      store.setItem(CURRENT_VERB_CACHE_KEY, JSON.stringify(payload)),
  };
}

export type MemoStorage = ReturnType<typeof createMemoStorage>;
