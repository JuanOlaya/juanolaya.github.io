# Especificaciones y Decisiones de Naming / Tienda (`specs-decs.md`)

Registro de decisiones, restricciones de publicación y verificación de nombres para la app de tarjetas de alemán.

---

## 1. Restricciones de Google Play Store

* **Título de la app:** máximo **30 caracteres**.
* **Descripción corta:** máximo **80 caracteres**.
* **Nombre bajo el icono (Android `app_name`):** conviene mantenerlo corto (sin rango de niveles ni subtítulo) para que no se corte en la pantalla del usuario y no cambie al actualizar niveles.
* **Actualización progresiva de niveles:** es válido publicar como `A1–B1` y actualizar el título de la ficha en Google Play Console a `A1–B2` cuando se agregue ese nivel, sin perder paquete, descargas ni reseñas.

---

## 2. Nombres descartados y verificación de mercado

| Nombre evaluado | Motivo del descarte / Hallazgo |
| :--- | :--- |
| `German by cards: verbs, adjectives and nouns` | 44 caracteres (supera el límite de 30 de Google Play); `"by cards"` suena poco natural en inglés. |
| `MemoDeutsch` | Descartado por decisión de marca. |
| `German Cards` | Ya existe una app con ese nombre en Google Play. |
| `German Flashcards` | Ya existe `German Flashcards!` (atmarc) y varias similares en Google Play. |
| `German Deck` / `GermanDeck` | Ya existe `GermanDeck - Learn German` (`com.germandeck.app`, desarrollador *German Deck*) en Google Play. |
| `German Planet` | Libre en Google Play/App Store como app activa, pero ya existen negocios/webs activos en el mismo sector: `germanplanet.de` (academia online de alemán) y `germanplanet.in`. |
| `German Atlas` | Evoca una app de geografía/mapas en lugar de idiomas. |

---

## 3. Candidatos viables (≤ 30 caracteres)

### Opción descriptiva (sin riesgo de choque de marca)
* **`German in Cards: A1–B1`** *(22 car.)*
  * Nombre corto bajo el icono: `German in Cards`
  * Futuro upgrade: `German in Cards: A1–B2` *(22 car.)*
* **`German in Cards: Verbs & more`** *(29 car.)*
* **`German in Cards: Verbs & Nouns`** *(30 car.)*

### Opciones con toque de marca (pendientes de verificar en tiendas)
* **`German Spark: A1–B1 Cards`** *(25 car.)*
* **`German Orbit: A1–B1 Cards`** *(25 car.)*
* **`German Vault: A1–B1 Cards`** *(25 car.)*

---

## 4. Publicación en Windows

* El botón **"Install on Windows"** de Google Play pertenece a **Google Play Games on PC** y aplica únicamente a **juegos**, no a apps educativas.
* Dado que el proyecto actual está construido con **HTML, CSS y JavaScript** (con `manifest.json` y soporte PWA), las vías válidas para Windows son:
  1. **PWA / PWABuilder (Microsoft Store):** empaquetar la PWA actual para Microsoft Store o instalarla desde Edge/Chrome.
  2. **Tauri:** envolver el frontend web en un instalador nativo `.exe` / `.msi` ligero usando WebView2.
  3. **Electron:** alternativa de escritorio (instalador más pesado por incluir Chromium).
