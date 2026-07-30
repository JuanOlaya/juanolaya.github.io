# Haptic Cards

Una base de datos interactiva en formato de tarjetas visuales para la ideación y clasificación de dispositivos hápticos manuales (handheld haptic input devices & VR controllers).

---

## 📸 Reglas y Criterios para la Inclusión de Imágenes y Medios

Para garantizar la máxima autenticidad, rigurosidad académica y utilidad visual en cada tarjeta de prototipo, se deben seguir estrictamente las siguientes reglas:

### ⚠️ Reglas Principales

1. **Visualización de la interacción (Hands-on view):**
   La imagen principal del carrusel **debe mostrar explícitamente a un usuario sosteniendo, tomando y usando el prototipo en tiempo real**.

2. **Autenticidad de la Fuente (PROHIBIDO el uso de Inteligencia Artificial):**
   **NO se permite generar imágenes mediante Inteligencia Artificial (IA)**. Las imágenes deben ser 100% auténticas y provenir directamente de fuentes académicas o demostraciones en vivo.

---

## 🔬 Metodología de Obtención de Imágenes

Para cada prototipo de la base de datos se aplica la siguiente metodología paso a paso:

```
[1. Verificar si existe Video de YouTube] 
       ├── SI ──> Extraer miniatura HD: https://img.youtube.com/vi/<VIDEO_ID>/hqdefault.jpg
       └── NO ──> [2. Buscar Publicación en Repositorios Abiertos]
                       ├── Consultar OpenAlex, HAL Archive (hal.science), arXiv, MDPI, Frontiers, etc.
                       ├── Descargar PDF oficial de la publicación
                       ├── Extraer la figura del prototipo en uso (Figure 1 / Teaser)
                       └── Guardar en la carpeta local img/<nombre_dispositivo>.<ext>
```

### Detalle de los Métodos:

1. **Método 1: Miniaturas y Frames de Videos Oficiales de YouTube**
   - Para proyectos con video demostrativo registrado (`https://www.youtube.com/embed/<VIDEO_ID>`), la imagen del prototipo en uso se obtiene mediante la URL directa de la miniatura de alta resolución:
     ```
     https://img.youtube.com/vi/<VIDEO_ID>/hqdefault.jpg
     ```

2. **Método 2: Extracción Programática de Artículos Científicos (PDF Open Access)**
   - Se consulta la API de OpenAlex o repositorios abiertos (HAL, arXiv, MDPI, Frontiers, IEEE, Stanford BDML, Inria, etc.) utilizando el DOI o título del artículo.
   - Se descarga el PDF del artículo científico a un entorno controlado.
   - Mediante scripts de extracción de PDF (`pypdf`), se extrae la figura principal (*Figure 1 / Teaser*) que muestra al usuario sosteniendo y manipulando el dispositivo.
   - Se guarda el archivo de imagen extraído en el directorio local [`img/`](./img/) para evitar enlaces rotos o caídas de servidores externos en el futuro.

3. **Método 3: Inserción de Videos Nuevos Encontrados**
   - Si durante el proceso de investigación académica se descubre un video oficial de YouTube del proyecto que no figuraba en la base de datos, se agrega la URL embebida al objeto `media` de la tarjeta en `index.html` y se utiliza su miniatura.

---

## 🛠️ Estructura del Proyecto

- [`index.html`](./index.html): Aplicación web con la interfaz, carrusel y taxonomía de dispositivos hápticos.
- [`img/`](./img/): Repositorio local de imágenes y activos multimedia para las tarjetas.
- [`README.md`](./README.md): Documentación, reglas y metodología oficial del proyecto.
