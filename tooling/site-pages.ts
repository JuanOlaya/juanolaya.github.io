import type { SiteEntry } from './page-inputs.ts';

/**
 * Everything that is published to GitHub Pages. Anything not listed here is left out of `dist/`.
 *
 * - `vite`: a migrated page; `<dir>/index.html` is processed and bundled by Vite.
 * - `legacy`: published byte-for-byte. When a page is migrated, its `legacy` entry is replaced by a
 *   `vite` entry with the same folder, so its public URL does not change.
 *
 * Not published on purpose: `Haptic_Controller_3D_modelling/` (Fusion 360 add-in, not web content),
 * `Repository_Housekeeping/` (maintenance reports), `Sockets/` server files and dependencies.
 */
export const siteEntries: readonly SiteEntry[] = [
  // Pipeline sanity check: Vue 3 + Tailwind (build) + p5 from npm. Remove once a real page is migrated.
  { kind: 'vite', dir: 'tooling-check' },

  // Home page (Vue, sources in src/home/) and its assets.
  { kind: 'vite', dir: '' },
  { kind: 'legacy', path: 'assets' },
  { kind: 'legacy', path: 'favicon' },
  { kind: 'legacy', path: 'CV' },

  // Project pages, one public URL per folder.
  { kind: 'vite', dir: 'Antonella/Lenguajes' },
  { kind: 'vite', dir: 'Balconity' },
  // Old icon URLs (/Balconity/assets/...) keep working; the page itself uses the hashed copies.
  { kind: 'legacy', path: 'Balconity/assets' },
  // MemoDeutsch (#14): the Vue app (sources in Deutsch_lernen/src/app/) takes over pages one view at a time;
  // their old URLs stay as redirect stubs in the legacy tree. Deutsch_lernen/src/ is never published.
  { kind: 'vite', dir: 'Deutsch_lernen/app' },
  { kind: 'legacy', path: 'Deutsch_lernen', exclude: ['src', 'app'] },
  // Home migrated to TS; the tool pages (balconity/, pixelGrid/, Scripts/, demo) and assets stay verbatim.
  { kind: 'vite', dir: 'EurekaWall' },
  { kind: 'legacy', path: 'EurekaWall', exclude: ['index.html', 'src'] },
  { kind: 'legacy', path: 'EurekaWall3' },
  { kind: 'legacy', path: 'EurekaWall_old' },
  { kind: 'vite', dir: 'HCI_BHT_Website' },
  { kind: 'vite', dir: 'Haptic_Cards' },
  { kind: 'legacy', path: 'Haptic_Cards/img' },
  { kind: 'legacy', path: 'Haptic_Cards/README.md' },
  { kind: 'legacy', path: 'Haptic_Cards/metadata.json' },
  { kind: 'vite', dir: 'MuseFlow' },
  { kind: 'legacy', path: 'OldWebsite' },
  { kind: 'legacy', path: 'OldWebsite2' },
  // One TS sketch (src/sketches/inspirational-wall) behind two URLs; Scripts/ keeps an orphan legacy gallery page.
  { kind: 'vite', dir: 'ParticleCanvas' },
  { kind: 'legacy', path: 'ParticleCanvas/Scripts' },
  { kind: 'vite', dir: 'PixelGrid' },
  { kind: 'legacy', path: 'PixelGrid/Scripts' },
  { kind: 'vite', dir: 'PlatformGame' },
  { kind: 'vite', dir: 'Project_Management' },
  // Server code (moving to server/ in #16) must never be published; the page itself may live in
  // Sockets/public/ or Sockets/index.html depending on that move, so the whole folder is listed.
  {
    kind: 'legacy',
    path: 'Sockets',
    exclude: ['server.js', 'package.json', 'package-lock.json', 'node_modules'],
  },
  { kind: 'legacy', path: 'TestingSoSci' },
  { kind: 'vite', dir: 'UX' },
  { kind: 'legacy', path: 'Website' },
  { kind: 'vite', dir: 'multitouchTest' },

  // Archived pages (issue #7). The old folders above keep only redirect stubs pointing here.
  { kind: 'legacy', path: 'legacy' },
];
