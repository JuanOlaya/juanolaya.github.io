import { beforeEach, describe, expect, it } from 'vitest';
import {
  CURRENT_VERB_CACHE_KEY,
  STORAGE_SCHEMA_VERSION,
  STORAGE_VERSION_KEY,
  createMemoStorage,
  migrateStorage,
  type KeyValueStore,
} from './memo-storage.ts';

/** In-memory stand-in for `localStorage`; `quota` makes `setItem` throw like a full browser store. */
class MemoryStore implements KeyValueStore {
  readonly items = new Map<string, string>();
  quota = Infinity;

  get length(): number {
    return this.items.size;
  }
  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }
  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    if (value.length > this.quota) throw new DOMException('full', 'QuotaExceededError');
    this.items.set(key, String(value));
  }
  removeItem(key: string): void {
    this.items.delete(key);
  }
}

let store: MemoryStore;

beforeEach(() => {
  store = new MemoryStore();
});

describe('migrateStorage', () => {
  it('turns IK and LiD tags on for a user who never ran the legacy settings migration', () => {
    store.setItem('toggle-ik-switch', 'false');
    store.setItem('toggle-lid-switch', 'false');

    migrateStorage(store);

    expect(store.getItem('toggle-ik-switch')).toBe('true');
    expect(store.getItem('toggle-lid-switch')).toBe('true');
    expect(store.getItem(STORAGE_VERSION_KEY)).toBe(String(STORAGE_SCHEMA_VERSION));
  });

  it('keeps hidden IK/LiD tags for a user who already ran the legacy migration, and drops its flag', () => {
    store.setItem('verbenSettingsMigration_v1_show_ik_lid', 'true');
    store.setItem('toggle-ik-switch', 'false');

    migrateStorage(store);

    expect(store.getItem('toggle-ik-switch')).toBe('false');
    expect(store.getItem('verbenSettingsMigration_v1_show_ik_lid')).toBeNull();
  });

  it('removes verb caches written by older app versions and keeps the current one', () => {
    store.setItem('verbAppCache_v45_old', '{}');
    store.setItem('verbAppCache_v12', '{}');
    store.setItem(CURRENT_VERB_CACHE_KEY, '{"allVerbsData":{}}');
    store.setItem('theme', 'dark');

    migrateStorage(store);

    expect([...store.items.keys()].sort()).toEqual(
      [CURRENT_VERB_CACHE_KEY, STORAGE_VERSION_KEY, 'theme', 'toggle-ik-switch', 'toggle-lid-switch'].sort(),
    );
  });

  it('runs each migration only once', () => {
    migrateStorage(store);
    store.setItem('toggle-ik-switch', 'false');

    migrateStorage(store);

    expect(store.getItem('toggle-ik-switch')).toBe('false');
  });

  it('leaves data written by a newer schema version untouched', () => {
    store.setItem(STORAGE_VERSION_KEY, String(STORAGE_SCHEMA_VERSION + 1));
    store.setItem('verbAppCache_v1', '{}');

    migrateStorage(store);

    expect(store.getItem('verbAppCache_v1')).toBe('{}');
    expect(store.getItem(STORAGE_VERSION_KEY)).toBe(String(STORAGE_SCHEMA_VERSION + 1));
  });

  it('treats a corrupt version as a fresh store', () => {
    store.setItem(STORAGE_VERSION_KEY, 'banana');

    migrateStorage(store);

    expect(store.getItem('toggle-lid-switch')).toBe('true');
    expect(store.getItem(STORAGE_VERSION_KEY)).toBe(String(STORAGE_SCHEMA_VERSION));
  });
});

describe('progress', () => {
  it('round-trips the current level and the group per level under the legacy keys', () => {
    const memo = createMemoStorage(store);

    memo.saveProgress('A2', 3);

    expect(store.getItem('currentLevel')).toBe('A2');
    expect(store.getItem('progress_A2')).toBe('3');
    expect(memo.getCurrentLevel()).toBe('A2');
    expect(memo.getSavedGroup('A2')).toBe(3);
  });

  it('returns null for a missing or non-numeric group', () => {
    store.setItem('progress_B1', 'abc');
    const memo = createMemoStorage(store);

    expect(memo.getSavedGroup('B1')).toBeNull();
    expect(memo.getSavedGroup('A1')).toBeNull();
    expect(memo.getCurrentLevel()).toBeNull();
  });

  it('reads groups saved by the old parseInt-based code', () => {
    store.setItem('progress_A1', '7.0');

    expect(createMemoStorage(store).getSavedGroup('A1')).toBe(7);
  });
});

describe('view settings', () => {
  it('stores toggles as the "true"/"false" strings the legacy page wrote', () => {
    const memo = createMemoStorage(store);

    memo.setToggle('es-switch', false);
    memo.setToggle('kompakt-light', true);

    expect(store.getItem('toggle-es-switch')).toBe('false');
    expect(memo.getToggle('es-switch')).toBe(false);
    expect(memo.getToggle('kompakt-light')).toBe(true);
    expect(memo.getToggle('de-switch')).toBeNull();
  });

  it('round-trips the card version', () => {
    const memo = createMemoStorage(store);
    expect(memo.getCardVersion()).toBeNull();

    memo.setCardVersion('niedlich');

    expect(store.getItem('verben-card-version')).toBe('niedlich');
    expect(memo.getCardVersion()).toBe('niedlich');
  });
});

describe('verb cache', () => {
  it('round-trips a payload as JSON', () => {
    const memo = createMemoStorage(store);
    const payload = { allVerbsData: { sein: { es: 'ser' } }, verbGroupsByLevel: {}, lastUpdated: 'x' };

    memo.writeVerbCache(payload);

    expect(memo.readVerbCache()).toEqual(payload);
  });

  it('returns null when the cache is missing, corrupt or not a verb cache', () => {
    const memo = createMemoStorage(store);
    expect(memo.readVerbCache()).toBeNull();

    store.setItem(CURRENT_VERB_CACHE_KEY, '{not json');
    expect(memo.readVerbCache()).toBeNull();

    store.setItem(CURRENT_VERB_CACHE_KEY, '{"allVerbsData":{}}');
    expect(memo.readVerbCache()).toBeNull();
  });

  it('lets a quota error reach the caller, which falls back to a compact payload', () => {
    store.quota = 10;

    expect(() =>
      createMemoStorage(store).writeVerbCache({ allVerbsData: {}, verbGroupsByLevel: {} }),
    ).toThrow('full');
  });
});
