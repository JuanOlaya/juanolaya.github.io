/** Network-first copies of everything not precached (verb JSON, the other legacy pages…). */
export const RUNTIME_CACHE = 'memodeutsch-runtime';

/** The hand-written worker (up to `deutsch-lernen-v2.8`) kept every file in one versioned cache. */
const LEGACY_CACHE_PREFIX = 'deutsch-lernen-v';

export function isLegacyCacheName(name: string): boolean {
  return name.startsWith(LEGACY_CACHE_PREFIX);
}
