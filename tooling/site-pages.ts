import type { SiteEntry } from './page-inputs.ts';

/**
 * Everything that is published to GitHub Pages. Anything not listed here is left out of `dist/`.
 *
 * - `vite`: a migrated page; `<dir>/index.html` is processed and bundled by Vite.
 * - `legacy`: published byte-for-byte. When a page is migrated, its `legacy` entry is replaced by a
 *   `vite` entry with the same folder, so its public URL does not change.
 *
 * Not published on purpose: `Haptic_Controller_3D_modelling/` (Fusion 360 add-in, not web content),
 * `Repository_Housekeeping/` (maintenance reports), `Sockets/` server files (only `Sockets/public/` is a page).
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
  { kind: 'legacy', path: 'Antonella' },
  { kind: 'legacy', path: 'Balconity' },
  { kind: 'legacy', path: 'Deutsch_lernen' },
  { kind: 'legacy', path: 'EurekaWall' },
  { kind: 'legacy', path: 'EurekaWall3' },
  { kind: 'legacy', path: 'EurekaWall_old' },
  { kind: 'legacy', path: 'HCI_BHT_Website' },
  { kind: 'legacy', path: 'Haptic_Cards' },
  { kind: 'legacy', path: 'MuseFlow' },
  { kind: 'legacy', path: 'OldWebsite' },
  { kind: 'legacy', path: 'OldWebsite2' },
  { kind: 'legacy', path: 'ParticleCanvas' },
  { kind: 'legacy', path: 'PixelGrid' },
  { kind: 'legacy', path: 'PlatformGame' },
  { kind: 'legacy', path: 'Project_Management' },
  { kind: 'legacy', path: 'PruebaGithub' },
  { kind: 'legacy', path: 'Sockets/public' },
  { kind: 'legacy', path: 'TestingSoSci' },
  { kind: 'legacy', path: 'Tropical' },
  { kind: 'legacy', path: 'UX' },
  { kind: 'legacy', path: 'Website' },
  { kind: 'legacy', path: 'WeightLever' },
  { kind: 'legacy', path: 'multitouchTest' },
];
