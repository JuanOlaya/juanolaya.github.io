[🇪🇸 Español](README.md) · [🇩🇪 Deutsch](README.de.md) · **🇬🇧 English**

# juanolaya.github.io

Juan Olaya's personal portfolio, published at <https://juanolaya.github.io>: HCI research apps, p5.js sketches, the **MemoDeutsch** PWA, infographics and prototypes.

The site is multi-page: each project lives in its own folder and keeps its public URL (`/Haptic_Cards/`, `/Balconity/`, `/Deutsch_lernen/`, …). It is being migrated incrementally from plain JavaScript to **TypeScript + Vue 3 + Vite** (see epic [#17](https://github.com/JuanOlaya/juanolaya.github.io/issues/17)).

> This README exists in three languages: [`README.md`](README.md) (Spanish, default), [`README.de.md`](README.de.md) and [`README.en.md`](README.en.md). If you change one, update all three in the same PR.

## Requirements

- Node.js 24 or later, and npm.

## Usage

```bash
npm ci              # install dependencies
npm run dev         # development server
npm run build       # build dist/ with every page
npm run preview     # serve dist/ locally
```

Quality:

```bash
npm run lint          # ESLint (typescript-eslint + eslint-plugin-vue)
npm run typecheck     # vue-tsc --noEmit
npm test              # Vitest
npm run format        # Prettier (format:check only checks)
npm run check:urls    # after the build: every public URL is still in dist/
```

`npm run build:legacy-scripts` regenerates the TS-compiled scripts that `legacy` pages load (they are committed next to the page; a test flags them when they are out of date).

On every push to `master`, the deploy workflow runs `lint`, `typecheck`, `test`, `build` and `check:urls` before publishing to GitHub Pages.

## Layout

| Path                                      | Contents                                                                                                                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tooling/site-pages.ts`                   | List of everything that gets published. Each entry is `legacy` (copied as is) or `vite` (built). Anything not listed stays out of `dist/`.                                       |
| `<Project>/index.html` + `<Project>/src/` | Migrated page: the Vite entry and its TS/Vue code.                                                                                                                               |
| `src/home/`                               | Home page (Vue + p5 in instance mode), including the **Projects** section that links the project pages (`src/home/projectPages.ts`).                                             |
| `src/shared/`                             | Shared components and styles (alias `@shared/*`; Tailwind 4 config in `src/shared/styles/tailwind.css`).                                                                         |
| `src/sketches/`                           | TypeScript p5 sketches used by more than one page.                                                                                                                               |
| `Deutsch_lernen/`                         | MemoDeutsch: the Vue app (code in `Deutsch_lernen/src/app/`, published at `/Deutsch_lernen/app/`) replaces the old pages one view at a time; their old URLs remain as redirects. |
| `legacy/`                                 | Archived pages; the original folders only keep redirects pointing here.                                                                                                          |
| `public/`                                 | Files loaded at runtime and copied unprocessed.                                                                                                                                  |
| `CV/`, `favicon/`, `assets/`              | Static resources published as is.                                                                                                                                                |
| `server/`                                 | Code GitHub Pages cannot run: Cloudflare Worker proxies (`gemini-proxy/`, `weather-proxy/`) and archived code. See [`server/README.md`](server/README.md).                       |
| `tooling/`                                | Build scripts and checks (`site-pages.ts`, public URL list, legacy scripts).                                                                                                     |
| `tools/memodeutsch/`                      | Offline MemoDeutsch scripts (Node/Python); not published.                                                                                                                        |
| `Haptic_Controller_3D_modelling/`         | Fusion 360 add-in (Python); outside the build.                                                                                                                                   |

`legacy` folders are published byte for byte, and only with files tracked in git.

### Migrating a page

1. Create `<Project>/index.html` with `<script type="module" src="./src/main.ts">` and put the code in `<Project>/src/`.
2. In `tooling/site-pages.ts`, replace `{ kind: 'legacy', path: '<Project>' }` with `{ kind: 'vite', dir: '<Project>' }`. The URL does not change.
3. Styles: `<Project>/src/style.css` with `@import '../../src/shared/styles/tailwind.css';` and `@source '..';`.
4. Tests next to the code (`<Project>/src/**/*.test.ts`); `lint`, `typecheck`, `test`, `build` and `check:urls` must pass.

## Versioning

The site uses [semantic versioning](https://semver.org/), automated with [release-please](https://github.com/googleapis/release-please):

- `fix:` commits bump the patch version and `feat:` commits the minor version; a `!` or `BREAKING CHANGE:` marks a major change. Other types (`chore:`, `docs:`, …) do not produce a release.
- On every push to `master`, release-please opens or updates a release PR with the new version and `CHANGELOG.md`.
- Merging that PR creates the `vX.Y.Z` tag and a GitHub Release with the built site attached (`juanolaya-site-vX.Y.Z.zip`).

## Contributing

- One branch and one PR per issue, with commits in [Conventional Commits](https://www.conventionalcommits.org/) format.
- Never commit keys or secrets: APIs that need a key are called through a serverless proxy (`server/`).
- Any change to this README also goes into `README.md` and `README.de.md`.
