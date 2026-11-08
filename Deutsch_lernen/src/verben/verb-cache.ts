/** Verb fields too large for the localStorage snapshot; the modal fetches them again when needed. */
const HEAVY_VERB_DATA_KEYS = ['praesens_examples', 'praeteritum_examples', 'praesens_fragen', 'wortfamilie'];

type VerbMap = Record<string, Record<string, unknown>>;

function isVerbObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** Copies every verb without its heavy fields, so the snapshot fits in the storage quota. */
export function lightweightVerbData(source: Record<string, unknown> | null | undefined): VerbMap {
  const snapshot: VerbMap = {};
  Object.entries(source ?? {}).forEach(([verbName, verbData]) => {
    if (!isVerbObject(verbData)) return;
    const compactVerbData = { ...verbData };
    HEAVY_VERB_DATA_KEYS.forEach((key) => delete compactVerbData[key]);
    snapshot[verbName] = compactVerbData;
  });
  return snapshot;
}

interface CachePayload {
  allVerbsData: Record<string, unknown>;
  verbGroupsByLevel: Record<string, unknown>;
}

/** Narrows a cache payload to one level's groups and their verbs: the retry when the full one is too big. */
export function compactToLevel<T extends CachePayload>(payload: T, level: string): T {
  const groups = (payload.verbGroupsByLevel[level] as { verbs?: unknown }[] | undefined) ?? [];
  const verbs: Record<string, unknown> = {};
  groups.forEach((group) => {
    if (!group || !Array.isArray(group.verbs)) return;
    group.verbs.forEach((verbName: string) => {
      if (payload.allVerbsData[verbName]) verbs[verbName] = payload.allVerbsData[verbName];
    });
  });
  return { ...payload, allVerbsData: verbs, verbGroupsByLevel: { [level]: groups } };
}
