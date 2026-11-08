import type { Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * What the MemoDeutsch service worker precaches, relative to `Deutsch_lernen/`: the list of the hand-written
 * worker it replaces, plus the Vue app. Everything else is cached on first visit (network first).
 */
export const MEMODEUTSCH_PRECACHE: readonly string[] = [
  'index.html',
  'styles.css',
  'manifest.json',
  'images/german_flag.png',
  'verben/A1_A2_B1/verben.html',
  'verben/A1_A2_B1/style/styles.css',
  'verben/A1_A2_B1/script/verben-helpers.js',
  'verben/A1_A2_B1/script/script.js',
  'verben/A1_A2_B1/script/app/card-back.js',
  'verben/A1_A2_B1/script/app/conjugation-modal.js',
  'verben/A1_A2_B1/script/app/data-loading.js',
  'verben/A1_A2_B1/script/app/init.js',
  'verben/A1_A2_B1/script/app/layout.js',
  'verben/A1_A2_B1/script/app/levels.js',
  'verben/A1_A2_B1/script/app/search.js',
  'verben/A1_A2_B1/script/app/shared.js',
  'verben/A1_A2_B1/script/app/state.js',
  'verben/A1_A2_B1/script/app/verb-modal.js',
  'verben/A1_A2_B1/script/app/view-controls.js',
  'verben/A1_A2_B1/script/app/views.js',
  'verben/A1_A2_B1/json/verb_types.json',
  'verben/A1_A2_B1/json/verbs_index.json',
  'faelle/nominativ/nominativ.html',
  'faelle/akkusativ/akkusativ.html',
  'faelle/dativ/dativ.html',
  'substantiv/substantive.html',
  'substantiv/koerperteile_interaktiv.html',
  'substantiv/zeit_kalender.html',
  'adverbs/adverbien.html',
  'adverbs/adverbien_B1_DTZ.html',
  'adverbs/mengenpronomen.html',
  'konjunktionen/konjunktionen.html',
  'konjunktionen/konjunktionen_B1_DTZ.html',
  'praepositionen/praepositionen.html',
  'w-fragen/w-fragen.html',
  'uhrzeit/uhrzeit.html',
  'adjektive/adjektive.html',
  'Aussprache/aussprache.html',
  'Sprechen/interjecciones.html',
  'Sprechen/a1.html',
  'app/index.html',
];

const APP_HTML = 'Deutsch_lernen/app/index.html';

/** The parts of a Rolldown output file this module reads; a structural subset so tests can fake a bundle. */
export type BundleFile =
  | { type: 'asset'; source: string | Uint8Array }
  | {
      type: 'chunk';
      imports: string[];
      dynamicImports: string[];
      viteMetadata?: { importedCss: Set<string>; importedAssets: Set<string> };
    };

/** `/bundles/x.js` style references, as Vite writes them into HTML and CSS. */
function referencedFiles(source: string | Uint8Array): string[] {
  if (typeof source !== 'string') return [];
  return [...source.matchAll(/\/(bundles\/[^"')\s?#]+)/g)].map((match) => match[1]);
}

function directDependencies(file: BundleFile): string[] {
  if (file.type === 'asset') return referencedFiles(file.source);
  const css = file.viteMetadata?.importedCss ?? new Set<string>();
  const assets = file.viteMetadata?.importedAssets ?? new Set<string>();
  return [...file.imports, ...file.dynamicImports, ...css, ...assets];
}

/** Every bundle file an HTML entry needs, following HTML and CSS references and static and dynamic imports. */
export function filesReachableFrom(bundle: Record<string, BundleFile>, entry: string): Set<string> {
  const reached = new Set<string>();
  const pending = bundle[entry] ? directDependencies(bundle[entry]) : [];
  while (pending.length > 0) {
    const name = pending.pop()!;
    if (reached.has(name) || !bundle[name]) continue;
    reached.add(name);
    pending.push(...directDependencies(bundle[name]));
  }
  return reached;
}

interface ManifestEntry {
  url: string;
  revision: string | null;
  size: number;
}

/** Drops bundles of other site pages and makes URLs root-relative: the worker lives in `/Deutsch_lernen/`. */
export function keepPrecached<T extends ManifestEntry>(entries: T[], appFiles: ReadonlySet<string>): T[] {
  return entries
    .filter((entry) => !entry.url.startsWith('bundles/') || appFiles.has(entry.url))
    .map((entry) => ({ ...entry, url: `/${entry.url}` }));
}

/** Builds `dist/Deutsch_lernen/service-worker.js` from `Deutsch_lernen/src/pwa/service-worker.ts`. */
export function memoDeutschPwa(): Plugin[] {
  const appFiles = new Set<string>();
  const collectAppFiles: Plugin = {
    name: 'memodeutsch-app-files',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const files = filesReachableFrom(bundle as unknown as Record<string, BundleFile>, APP_HTML);
      files.forEach((file) => appFiles.add(file));
    },
  };
  return [
    collectAppFiles,
    ...VitePWA({
      strategies: 'injectManifest',
      srcDir: 'Deutsch_lernen/src/pwa',
      filename: 'service-worker.ts',
      outDir: 'dist/Deutsch_lernen',
      // Pages already register `service-worker.js`; the Vue app registers it itself.
      injectRegister: false,
      manifest: false,
      injectManifest: {
        rollupFormat: 'iife',
        globDirectory: 'dist',
        globPatterns: [...MEMODEUTSCH_PRECACHE.map((file) => `Deutsch_lernen/${file}`), 'bundles/**/*'],
        // verben/script.js is ~400 kB and the verb index ~1 MB; p5 bundles are filtered out afterwards.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        manifestTransforms: [
          async (entries) => ({ manifest: keepPrecached(entries, appFiles), warnings: [] }),
        ],
      },
    }),
  ];
}
