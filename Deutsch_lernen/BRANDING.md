# Branding y Naming de la App (`BRANDING.md`)

Decisiones de marca, nombre en tiendas, historial de nombres descartados y estrategia de publicación.

---

## 1. Nombre seleccionado (temporal)

* **Título en Google Play:** `German in Cards: A1–B1` *(22 / 30 caracteres)*
* **Nombre corto bajo el icono (`app_name`):** `German in Cards`
* **Actualización futura planificada:** `German in Cards: A1–B2` *(22 / 30 caracteres)*
* **Descripción corta sugerida (≤ 80 car.):** `Master German verbs, adjectives & nouns by level with flashcards.` *(65 car.)*

### Por qué se elige temporalmente
* Entra con holgura dentro del límite de **30 caracteres** de Google Play.
* Al ser descriptivo, **no choca** con marcas comerciales ni academias existentes.
* Permite actualizar el rango (`A1–B1` → `A1–B2`) directamente en Google Play Console sin cambiar el nombre bajo el icono ni perder descargas o reseñas.

---

## 2. Nombres descartados y motivos

| Nombre evaluado | Motivo del descarte |
| :--- | :--- |
| **`German by cards: verbs, adjectives and nouns`** | Supera el límite de 30 caracteres de Google Play (44 car.). Además, `"by cards"` suena poco natural en inglés frente a `"with cards"` o `"in Cards"`. |
| **`MemoDeutsch`** | Descartado por decisión de marca. |
| **`German Cards`** | Ya existe una app con ese nombre exacto en Google Play; competir con el mismo título perjudica el posicionamiento. |
| **`German Flashcards`** | Ya existe `German Flashcards!` (*atmarc*) y varias apps similares muy posicionadas en Google Play. |
| **`German Deck` / `GermanDeck`** | Ya existe en Google Play bajo el título `GermanDeck - Learn German` (`com.germandeck.app`, desarrollador *German Deck*). |
| **`German Planet`** | Aunque no hay una app activa con ese nombre en Google Play o App Store, sí existen negocios/webs activos en el mismo sector de enseñanza de alemán: **`germanplanet.de`** (academia/plataforma online de cursos de alemán) y **`germanplanet.in`**. Riesgo de confusión de búsqueda y conflicto de marca fuera de la tienda. |
| **`German Atlas`** | La palabra *Atlas* evoca una app de geografía o mapas en lugar de aprendizaje de idiomas. |

---

## 3. Candidatos alternativos de reserva (≤ 30 caracteres)

Por si más adelante se quisiera adoptar un nombre más de marca en lugar del descriptivo (pendientes de verificación en tiendas):

* `German Spark: A1–B1 Cards` *(25 car.)*
* `German Orbit: A1–B1 Cards` *(25 car.)*
* `German Vault: A1–B1 Cards` *(25 car.)*

---

## 4. Reglas de tienda y publicación en Windows

* **Google Play Store:** límite estricto de **30 caracteres** en el título y **80 caracteres** en la descripción corta.
* **Windows:** el botón *"Install on Windows"* de Google Play corresponde a **Google Play Games on PC** (exclusivo para juegos, no aplica a apps educativas). Con el stack actual (**HTML, CSS y JavaScript** + `manifest.json` PWA), las opciones válidas para Windows son **PWA / PWABuilder (Microsoft Store)**, **Tauri** (`.exe`/`.msi` ligero) o **Electron**.
