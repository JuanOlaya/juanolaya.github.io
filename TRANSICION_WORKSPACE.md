# Reporte de Transición: Workspace `juanolaya.github.io`

Este documento recopila todas las decisiones técnicas, cambios implementados, justificaciones arquitectónicas y el estado actual del repositorio para retomar el trabajo directamente desde el espacio de trabajo raíz **`juanolaya.github.io`** en Antigravity.

---

## 1. Justificación Arquitectónica: ¿Por qué Vue 3 + TypeScript + Vite?

La decisión de migrar el repositorio a **Vue 3 + TypeScript + Vite** fue ejecutada de manera conjunta por **Luis** (`@Ludocius`) y **Claude Opus 5.5** durante las refactorizaciones mayores del repositorio (PRs #10 a #49 y #85 a #105). Las razones técnicas fundamentales son:

### A. Repositorio Multi-Página (MPA - Multi-Page Application)
- El repositorio no es una sola SPA monolítica; es una colección de múltiples aplicaciones y proyectos independientes (`/`, `/Haptic_Cards/`, `/UX/`, `/Balconity/`, `/Tropical/`, `/Project_Management/`, `/Deutsch_lernen/`, etc.).
- **Vite** ofrece soporte nativo de primer nivel para configuraciones multi-página (`rollupOptions.input`), permitiendo compilar cada proyecto a su propia ruta estática sin generar un bundle gigante compartido.

### B. Coexistencia limpia con p5.js (Modo Instancia)
- Proyectos centrales como `PixelGrid`, `PlatformGame`, `ParticleCanvas` e `InspirationalWall` dependen fuertemente de **p5.js** para gráficos en canvas y simulaciones físicas.
- En frameworks con reconciliación reactiva pesada o Virtual DOM invasivo (como React), sincronizar un `<canvas>` con el ciclo de vida suele causar parpadeos, pérdidas de contexto de dibujo o re-renderizados innecesarios.
- **Vue 3** permite montar p5.js en *modo instancia* (`new p5(sketch, container)`) dentro de `onMounted` de manera totalmente aislada: Vue gobierna la UI (barras de herramientas, controles, modales, diseño responsivo con Tailwind) y p5 gobierna el lienzo de píxeles sin interferencias.

### C. Componentes de Archivo Único (SFC) y Reactividad Progresiva
- El código heredado consistía en scripts vanilla desordenados con variables globales (`script.js` con miles de líneas) y manipulación manual de `innerHTML`.
- Vue 3 permitió encapsular cada pieza de interfaz en componentes limpios (`.vue`), con tipado estricto gracias a TypeScript y sincronización reactiva de filtros y parámetros URL sin necesidad de stores globales sobredimensionadas como Redux.

### D. Rendimiento en CI/CD con GitHub Actions
- La suite **Vite + Vue 3 + Vitest + vue-tsc** se ejecuta sobre **Node 24** en el pipeline de GitHub Actions (`.github/workflows/deploy.yml`).
- Permite ejecutar más de 670 pruebas unitarias y verificar tipos en menos de 20 segundos antes de generar la distribución estática final (`dist/`) servida en GitHub Pages.

---

## 2. Resumen de lo Realizado en esta Conversación

### A. Mejoras en PixelGrid (`EurekaWall/pixelGrid/`)
1. **Paleta de Colores y Persistencia:**
   - La paleta inicial activa es **Classic**.
   - Los puntos iniciales generados en la cuadrícula usan únicamente colores de dicha paleta.
   - Cada celda pintada conserva su color original de forma independiente aunque el usuario alterne entre paletas.
   - Botón de cambio de paleta estilizado como icono de paleta de artista monocromática (`🎨`).
2. **Desacople de Fondo y Paleta:**
   - Alternar la paleta de colores ya **no** altera el fondo del lienzo.
   - El botón `Background` fue reubicado a la derecha en la barra de herramientas inferior.
   - Se añadió un botón para alternar **Pantalla Completa** (`⛶ Fullscreen`).
3. **Fondos Curados y Alineación con el Screenshot:**
   - Se eliminaron los fondos estridentes `#FF6600` y `#E1CFA3`.
   - Se integró el fondo **color hueso** `#F5F2EB`.
   - Se configuró como fondo predeterminado el `#282828`.
   - Color de dibujo inicial: Morado (`#484B78`). Forma inicial: Círculo (índice 1).
   - Encabezado superior colapsado por defecto (`[Show H]`).

### B. Exclusión Permanente de 5 Proyectos de la Portada
Se identificó que 5 proyectos habían vuelto a ser listados en la página de inicio. Por instrucción expresa del usuario, fueron removidos y blindados permanentemente:
- ❌ **MemoDeutsch** (`/Deutsch_lernen/`) — Congelado; migrado a Flutter/Dart en repositorio independiente.
- ❌ **UX Infographics** (`/UX/`)
- ❌ **Project Management** (`/Project_Management/`)
- ❌ **ShapyPresence** (`/EurekaWall/pixelGrid/`)
- ❌ **HCI BHT** (`/HCI_BHT_Website/`)

**Mecanismos de protección implementados:**
1. Eliminados de `src/home/projectPages.ts`.
2. Pruebas automatizadas en `src/home/projectPages.test.ts` que garantizan que nunca vuelvan a ser añadidos.
3. Regla permanente documentada en `.agents/AGENTS.md` y `Deutsch_lernen/.agents/AGENTS.md`.

### C. Plan Maestro y Arquitectura Multi-Agente (`PLAN.md`)
- Se definió el flujo de trabajo orquestado con agentes especializados: `lead-orchestrator`, `sdd-architect`, `oop-domain-engineer`, `modern-web-specialist`, `system-architect` y `qa-gatekeeper`.
- Se generó y guardó el diagrama de flujo (`orchestrator-flow.png`) junto a `PLAN.md` en la raíz del repositorio.
- Se incorporaron las directrices de **Google Chrome Modern Web Guidance** y el requerimiento de **Light Mode** para `Haptic_Cards`.
- Se eliminó del plan el exportador SVG/PNG para PixelGrid.

---

## 3. Estado de Git y Despliegue

- **Rama activa:** `master`
- **Sincronización:** `Your branch is up to date with 'origin/master'`
- **Últimos commits integrados:**
  - `8f1692f0`: *fix(home): remove MemoDeutsch, UX, PM, ShapyPresence and HCI BHT from home page and add permanent exclusion rule*
  - `7163909f`: *feat(pixelGrid): remove #FF6600 and #E1CFA3, add #F5F2EB bone-white background, and set #282828 default*
  - `a021d3c0`: *feat(pixelGrid): decouple palette toggle from background, add #282828 to background button, move background to bottom toolbar and add fullscreen button*
- **Monitor de CI/CD:** https://github.com/JuanOlaya/juanolaya.github.io/actions/

---

## 4. Prompt de Relevo (Handoff Prompt) para el Nuevo Workspace

Al abrir la carpeta raíz **`juanolaya.github.io`** en Antigravity, puedes iniciar el nuevo chat pegando el siguiente texto:

```text
Hola. Vengo de la sesión previa en la subcarpeta Deutsch_lernen y ahora estoy trabajando directamente en la raíz de juanolaya.github.io.

Lee el archivo PLAN.md en la raíz del repositorio y ten en cuenta las siguientes decisiones ya consolidadas y desplegadas en master:
1. Las mejoras en PixelGrid (paletas, desacople de fondo, fondo hueso #F5F2EB, default #282828, fullscreen) ya están completadas y testeadas.
2. Los 5 proyectos (MemoDeutsch, UX Infographics, Project Management, ShapyPresence y HCI BHT) están permanentemente excluidos de la home page según la regla en .agents/AGENTS.md y blindados por tests en src/home/projectPages.test.ts.
3. MemoDeutsch está congelado en este repositorio porque fue migrado a Flutter/Dart.
4. El stack del monorepo es Vue 3 + TypeScript + Vite MPA.

Por favor indícame los siguientes pasos según el PLAN.md para avanzar con las tareas prioritarias (como el Light Mode y modernizaciones de Haptic Cards).
```
