**🇪🇸 Español** · [🇩🇪 Deutsch](README.de.md) · [🇬🇧 English](README.en.md)

# juanolaya.github.io

Portafolio personal de Juan Olaya publicado en <https://juanolaya.github.io>: apps de investigación HCI, sketches de p5.js, la PWA **MemoDeutsch**, infografías y prototipos.

El sitio es multi-página: cada proyecto vive en su carpeta y conserva su URL pública (`/Haptic_Cards/`, `/Balconity/`, `/Deutsch_lernen/`, …). Se está migrando de JavaScript plano a **TypeScript + Vue 3 + Vite** de forma incremental (ver la épica [#17](https://github.com/JuanOlaya/juanolaya.github.io/issues/17)).

> Este README existe en tres idiomas: [`README.md`](README.md) (español, por defecto), [`README.de.md`](README.de.md) y [`README.en.md`](README.en.md). Si cambias uno, actualiza los tres en el mismo PR.

## Requisitos

- Node.js 24 o superior y npm.

## Uso

```bash
npm ci              # instalar dependencias
npm run dev         # servidor de desarrollo
npm run build       # genera dist/ con todas las páginas
npm run preview     # sirve dist/ en local
```

Calidad:

```bash
npm run lint          # ESLint (typescript-eslint + eslint-plugin-vue)
npm run typecheck     # vue-tsc --noEmit
npm test              # Vitest
npm run format        # Prettier (format:check solo comprueba)
npm run check:urls    # tras el build: todas las URL públicas siguen en dist/
```

`npm run build:legacy-scripts` regenera los scripts compilados desde TS que cargan páginas `legacy` (se versionan junto a la página; un test avisa si están desactualizados).

El workflow de despliegue ejecuta `lint`, `typecheck`, `test`, `build` y `check:urls` antes de publicar en GitHub Pages con cada push a `master`.

## Cómo está organizado

| Ruta                                        | Qué contiene                                                                                                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tooling/site-pages.ts`                     | Lista de todo lo que se publica. Cada entrada es `legacy` (se copia tal cual) o `vite` (se compila). Lo que no aparece no llega a `dist/`.                                                 |
| `<Proyecto>/index.html` + `<Proyecto>/src/` | Página migrada: entrada de Vite y su código TS/Vue.                                                                                                                                        |
| `src/home/`                                 | Página principal (Vue + p5 en modo instancia), con la sección **Projects** que enlaza las páginas de proyecto (`src/home/projectPages.ts`).                                                |
| `src/shared/`                               | Componentes y estilos compartidos (alias `@shared/*`; config de Tailwind 4 en `src/shared/styles/tailwind.css`).                                                                           |
| `src/sketches/`                             | Sketches de p5 en TypeScript compartidos por varias páginas.                                                                                                                               |
| `Deutsch_lernen/`                           | MemoDeutsch: la app Vue (código en `Deutsch_lernen/src/app/`, publicada en `/Deutsch_lernen/app/`) sustituye las páginas antiguas vista a vista; sus URL viejas quedan como redirecciones. |
| `legacy/`                                   | Páginas archivadas; las carpetas originales solo conservan redirecciones hacia aquí.                                                                                                       |
| `public/`                                   | Archivos que se cargan en tiempo de ejecución y se copian sin procesar.                                                                                                                    |
| `CV/`, `favicon/`, `assets/`                | Recursos estáticos publicados tal cual.                                                                                                                                                    |
| `server/`                                   | Código que GitHub Pages no puede ejecutar: proxies Cloudflare Worker (`gemini-proxy/`, `weather-proxy/`) y código archivado. Ver [`server/README.md`](server/README.md).                   |
| `tooling/`                                  | Scripts de build y comprobaciones (`site-pages.ts`, lista de URL públicas, scripts legacy).                                                                                                |
| `tools/memodeutsch/`                        | Scripts offline (Node/Python) de MemoDeutsch; no se publican.                                                                                                                              |
| `Haptic_Controller_3D_modelling/`           | Add-in de Fusion 360 (Python); fuera del build.                                                                                                                                            |

Las carpetas `legacy` se publican byte a byte y solo con archivos versionados en git.

### Migrar una página

1. Crear `<Proyecto>/index.html` con `<script type="module" src="./src/main.ts">` y el código en `<Proyecto>/src/`.
2. En `tooling/site-pages.ts`, cambiar `{ kind: 'legacy', path: '<Proyecto>' }` por `{ kind: 'vite', dir: '<Proyecto>' }`. La URL no cambia.
3. Estilos: `<Proyecto>/src/style.css` con `@import '../../src/shared/styles/tailwind.css';` y `@source '..';`.
4. Tests junto al código (`<Proyecto>/src/**/*.test.ts`) y pasar `lint`, `typecheck`, `test`, `build` y `check:urls`.

## Versiones

El sitio usa [versionado semántico](https://semver.org/lang/es/) automatizado con [release-please](https://github.com/googleapis/release-please):

- Los commits `fix:` suben la versión de parche y los `feat:` la versión menor; un `!` o `BREAKING CHANGE:` marca un cambio mayor. Otros tipos (`chore:`, `docs:`, …) no generan versión.
- Con cada push a `master`, release-please abre o actualiza un PR de release con la nueva versión y el `CHANGELOG.md`.
- Al fusionar ese PR se crea la etiqueta `vX.Y.Z` y una GitHub Release con el sitio compilado adjunto (`juanolaya-site-vX.Y.Z.zip`).

## Contribuir

- Una rama y un PR por issue, con commits en formato [Conventional Commits](https://www.conventionalcommits.org/).
- No subir claves ni secretos: las APIs que necesitan clave se llaman a través de un proxy serverless (`server/`).
- Cualquier cambio en este README va también a `README.de.md` y `README.en.md`.
