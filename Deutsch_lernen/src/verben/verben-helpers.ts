/**
 * Entry of `verben/A1_A2_B1/script/verben-helpers.js`, the classic script that `verben.html` loads before
 * `script.js`. The legacy script calls these helpers by their bare names, so they are published as globals
 * under exactly those names until the page itself becomes a module.
 */
import { browserStore, createMemoStorage, migrateStorage } from '../storage/memo-storage.ts';
import { legacyGlobals } from './legacy-globals.ts';

// A blocked or missing localStorage must not stop the trainer from rendering its default level.
const store = browserStore();

// Runs before `script.js` reads anything, so it always sees the current storage schema.
migrateStorage(store);

Object.assign(globalThis, legacyGlobals, { memoStorage: createMemoStorage(store) });
