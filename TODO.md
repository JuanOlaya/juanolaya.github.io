# Proyectos Pendientes de Mejora y Publicación

Este documento recopila los proyectos retirados temporalmente de la sección de proyectos de la página de inicio ([`https://juanolaya.github.io/`](https://juanolaya.github.io/)) para ser mejorados, pulidos y republicados posteriormente, así como notas de enfoque pedagógico y mejoras de los proyectos activos.

---

## 1. MemoDeutsch
* **Ruta en el repositorio:** `Deutsch_lernen/`
* **URL:** `/Deutsch_lernen/`
* **Descripción:** Plataforma de aprendizaje de alemán: gramática, conjugación de verbos, vocabulario y simulador del examen de nacionalidad (*Einbürgerungstest*).
* **Mejoras pendientes antes de republicar:**
  - [x] Completar la modularización y partición de `script.js` (en curso). (#101)
  - [x] Validar y optimizar la experiencia PWA (Service Worker y almacenamiento en caché). (#101)
  - [x] Mejorar la interfaz responsiva en dispositivos móviles. (#101)
  - [x] Limpiar dependencias y asegurar hidratación automática de datos en `localStorage`. (#101)

---

## 2. UX Infographic
* **Ruta en el repositorio:** `UX/`
* **URL:** `/UX/`
* **Descripción:** Infografía interactiva sobre Experiencia de Usuario (UX) y co-pilotos de Inteligencia Artificial (en español).
* **Mejoras pendientes antes de republicar:**
  - [x] Conectar de forma segura con el proxy de Cloudflare para las consultas a Gemini (o implementar un modo offline elegante). (#100)
  - [x] Pulir el diseño visual y las animaciones interactivas. (#100)
  - [x] Optimizar la navegación táctil y en pantallas de diferentes tamaños. (#100)

---

## 3. Project Management
* **Ruta en el repositorio:** `Project_Management/`
* **URL:** `/Project_Management/`
* **Descripción:** Guía interactiva de gestión de proyectos basada en el estándar PMBOK 7 (en español).
* **Mejoras pendientes antes de republicar:**
  - [x] Revisión de contenido pedagógico y diagramas de flujo. (#99)
  - [x] Modernización de la interfaz gráfica y estilos. (#99)
  - [x] Añadir interactividad y casos prácticos de gestión ágil. (#99)

---

## 4. HCI BHT
* **Ruta en el repositorio:** `HCI_BHT_Website/`
* **URL:** `/HCI_BHT_Website/`
* **Descripción:** Landing page con animación generativa de círculos en p5.js para el área de Human-Computer Interaction en la Berliner Hochschule für Technik (BHT Berlin).
* **Mejoras pendientes antes de republicar:**
  - [ ] Actualizar la información académica, enlaces de docencia y proyectos de investigación. *(omitido por decisión del dueño; solo se mejoró la parte visual, #97)*
  - [x] Optimizar el rendimiento del sketch de p5.js en móviles y pantallas retina. (#97)
  - [x] Adaptar la jerarquía visual del contenido. (#97)

---

## 5. ShapyPresence
* **Ruta en el repositorio:** `EurekaWall/pixelGrid/`
* **URL:** `/EurekaWall/pixelGrid/`
* **Descripción:** Experimento de presencia social remota compartiendo mensajes visuales a través de una cuadrícula de figuras en EurekaWall.
* **Mejoras pendientes antes de republicar:**
  - [x] Refactorizar la interacción táctil y el canvas de dibujo de patrones. (#98)
  - [x] Mejorar la integración visual dentro de la suite de EurekaWall. (#98)
  - [x] Probar la fluidez de interacción y respuesta en diferentes navegadores. (#98)

---

## 6. Platform Game (Enfoque Pedagógico: OOP, Simulación Física y DDD)
* **Ruta en el repositorio:** `PlatformGame/`
* **URL:** `/PlatformGame/`
* **Propósito real:** Proyecto didáctico diseñado para enseñar **Programación Orientada a Objetos (OOP)** y **simulación física** (*physics simulation*):
  - Detección y respuesta de colisiones (*colisiones*).
  - Cinemática de salto y gravedad (*jumping / gravity*).
  - Arquitectura orientada a dominio: estructurado probablemente aplicando **DDD (Domain-Driven Design / Development)** para separar limpiamente la lógica de dominio (física, entidades, reglas del juego) del renderizado y la capa visual.
* **Mejoras pendientes:**
  - [x] Reestructurar el código aplicando principios de **DDD** (entidades de dominio como `Player`, `Platform`, `World`, value objects para vectores/posiciones y servicios de colisión desacoplados de p5/canvas). (#102)
  - [x] Actualizar la descripción pública del proyecto en la portada para reflejar su objetivo formativo (OOP, física y DDD) en lugar de un simple prototipo genérico. (#102)
  - [x] Añadir paneles explicativos o documentación visual interactiva que demuestre los conceptos físicos y de arquitectura en tiempo real. (#102)

---

## 7. Pendientes detectados tras la ronda de mejoras (#97–#102)

* **ShapyPresence**
  - [x] Probar a mano en Firefox y Safari (iOS incluido); hasta ahora solo se verificó en Chrome. (#116, Firefox y WebKit con Playwright; iOS físico sin probar)
* **Estilos compartidos**
  - [x] Consolidar los tokens del contrato visual (incluido `--text-caption` de UX) en una hoja común `src/shared/styles/` para no repetirlos en cada proyecto. (#114)
