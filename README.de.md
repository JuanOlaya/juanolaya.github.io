[🇪🇸 Español](README.md) · **🇩🇪 Deutsch** · [🇬🇧 English](README.en.md)

# juanolaya.github.io

Persönliches Portfolio von Juan Olaya, veröffentlicht unter <https://juanolaya.github.io>: HCI-Forschungs-Apps, p5.js-Sketches, die PWA **MemoDeutsch**, Infografiken und Prototypen.

Die Website besteht aus mehreren Seiten: Jedes Projekt liegt in einem eigenen Ordner und behält seine öffentliche URL (`/Haptic_Cards/`, `/Balconity/`, `/Deutsch_lernen/`, …). Sie wird schrittweise von reinem JavaScript auf **TypeScript + Vue 3 + Vite** umgestellt (siehe Epic [#17](https://github.com/JuanOlaya/juanolaya.github.io/issues/17)).

> Diese README gibt es in drei Sprachen: [`README.md`](README.md) (Spanisch, Standard), [`README.de.md`](README.de.md) und [`README.en.md`](README.en.md). Wer eine davon ändert, aktualisiert alle drei im selben PR.

## Voraussetzungen

- Node.js 24 oder neuer und npm.

## Verwendung

```bash
npm ci              # Abhängigkeiten installieren
npm run dev         # Entwicklungsserver
npm run build       # erzeugt dist/ mit allen Seiten
npm run preview     # liefert dist/ lokal aus
```

Qualität:

```bash
npm run lint          # ESLint (typescript-eslint + eslint-plugin-vue)
npm run typecheck     # vue-tsc --noEmit
npm test              # Vitest
npm run format        # Prettier (format:check prüft nur)
npm run check:urls    # nach dem Build: alle öffentlichen URLs sind noch in dist/
```

`npm run build:legacy-scripts` erzeugt die aus TS kompilierten Skripte neu, die `legacy`-Seiten laden (sie werden neben der Seite versioniert; ein Test meldet, wenn sie veraltet sind).

Der Deploy-Workflow führt bei jedem Push auf `master` `lint`, `typecheck`, `test`, `build` und `check:urls` aus, bevor er auf GitHub Pages veröffentlicht.

## Aufbau

| Pfad                                      | Inhalt                                                                                                                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tooling/site-pages.ts`                   | Liste von allem, was veröffentlicht wird. Jeder Eintrag ist `legacy` (unverändert kopiert) oder `vite` (gebaut). Was fehlt, landet nicht in `dist/`.                                                          |
| `<Projekt>/index.html` + `<Projekt>/src/` | Migrierte Seite: Vite-Einstiegspunkt und zugehöriger TS/Vue-Code.                                                                                                                                             |
| `src/home/`                               | Startseite (Vue + p5 im Instanzmodus) mit dem Abschnitt **Projects**, der auf die Projektseiten verlinkt (`src/home/projectPages.ts`).                                                                        |
| `src/shared/`                             | Gemeinsame Komponenten und Styles (Alias `@shared/*`; Tailwind-4-Konfiguration in `src/shared/styles/tailwind.css`).                                                                                          |
| `src/sketches/`                           | p5-Sketches in TypeScript, die mehrere Seiten nutzen.                                                                                                                                                         |
| `Deutsch_lernen/`                         | MemoDeutsch: Die Vue-App (Code in `Deutsch_lernen/src/app/`, veröffentlicht unter `/Deutsch_lernen/app/`) ersetzt die alten Seiten Ansicht für Ansicht; deren alte URLs bleiben als Weiterleitungen erhalten. |
| `legacy/`                                 | Archivierte Seiten; die ursprünglichen Ordner enthalten nur noch Weiterleitungen hierher.                                                                                                                     |
| `public/`                                 | Dateien, die zur Laufzeit geladen und unverarbeitet kopiert werden.                                                                                                                                           |
| `CV/`, `favicon/`, `assets/`              | Statische Ressourcen, unverändert veröffentlicht.                                                                                                                                                             |
| `server/`                                 | Code, den GitHub Pages nicht ausführen kann: Cloudflare-Worker-Proxys (`gemini-proxy/`, `weather-proxy/`) und archivierter Code. Siehe [`server/README.md`](server/README.md).                                |
| `tooling/`                                | Build-Skripte und Prüfungen (`site-pages.ts`, Liste der öffentlichen URLs, Legacy-Skripte).                                                                                                                   |
| `tools/memodeutsch/`                      | Offline-Skripte (Node/Python) für MemoDeutsch; werden nicht veröffentlicht.                                                                                                                                   |
| `Haptic_Controller_3D_modelling/`         | Fusion-360-Add-in (Python); nicht Teil des Builds.                                                                                                                                                            |

`legacy`-Ordner werden Byte für Byte veröffentlicht, und zwar nur mit Dateien, die in git versioniert sind.

### Eine Seite migrieren

1. `<Projekt>/index.html` mit `<script type="module" src="./src/main.ts">` anlegen, den Code nach `<Projekt>/src/`.
2. In `tooling/site-pages.ts` `{ kind: 'legacy', path: '<Projekt>' }` durch `{ kind: 'vite', dir: '<Projekt>' }` ersetzen. Die URL bleibt gleich.
3. Styles: `<Projekt>/src/style.css` mit `@import '../../src/shared/styles/tailwind.css';` und `@source '..';`.
4. Tests neben dem Code (`<Projekt>/src/**/*.test.ts`); `lint`, `typecheck`, `test`, `build` und `check:urls` müssen durchlaufen.

## Versionen

Die Website nutzt [semantische Versionierung](https://semver.org/lang/de/), automatisiert mit [release-please](https://github.com/googleapis/release-please):

- `fix:`-Commits erhöhen die Patch-Version, `feat:`-Commits die Minor-Version; ein `!` oder `BREAKING CHANGE:` kennzeichnet eine Major-Änderung. Andere Typen (`chore:`, `docs:`, …) erzeugen keine Version.
- Bei jedem Push auf `master` öffnet oder aktualisiert release-please einen Release-PR mit der neuen Version und dem `CHANGELOG.md`.
- Wird dieser PR gemergt, entstehen das Tag `vX.Y.Z` und ein GitHub Release mit der gebauten Website als Anhang (`juanolaya-site-vX.Y.Z.zip`).

## Mitwirken

- Ein Branch und ein PR pro Issue, Commits im Format [Conventional Commits](https://www.conventionalcommits.org/).
- Keine Schlüssel oder Secrets committen: APIs, die einen Schlüssel brauchen, werden über einen Serverless-Proxy aufgerufen (`server/`).
- Jede Änderung an dieser README gehört auch in `README.md` und `README.en.md`.
