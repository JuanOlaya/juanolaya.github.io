# server/ — código que GitHub Pages no puede ejecutar

GitHub Pages solo sirve archivos estáticos. Todo lo que necesita un servidor vive aquí y **no se publica como página**.

| Carpeta | Qué es | Estado |
|---|---|---|
| `gemini-proxy/` | Cloudflare Worker (TypeScript) que reenvía las peticiones del AI Hub de `UX/` a Gemini guardando la clave como secreto | Listo para desplegar |
| `museflow-php/` | Endpoints PHP + MySQL que guardaban los datos del estudio MuseFlow | Archivado (desactivado) |
| `sockets/` | Ejemplo de tutorial p5.js + Express + socket.io | Archivado |

## Credenciales

Los archivos PHP tenían credenciales de MySQL escritas en el código (en `upstream/master`:
`MuseFlow/php/platforms-db.php:27-30` y `MuseFlow/php/thoughtProbes-db.php:26-29`). Ahora se leen de
`museflow-php/config.php`, que está en `.gitignore`. **Los valores antiguos siguen en el historial de git: hay que
rotar esa contraseña en el servidor MySQL** (y, si el usuario se reutiliza en otro sitio, también allí).

### Claves a rotar

| Credencial | Dónde estaba / está | Acción |
|---|---|---|
| Contraseña de MySQL de MuseFlow | `MuseFlow/php/platforms-db.php:27-30`, `MuseFlow/php/thoughtProbes-db.php:26-29` | Rotar (sigue en el historial) |
| Clave de API de Gemini (Google AI Studio) | `Deutsch_lernen/futur/futur.html:459`, **todavía versionada** | Rotar ya y sacarla del archivo; esa página puede usar este proxy añadiendo su modelo a la lista blanca |

`UX/index.html` no contiene ninguna clave. `EurekaWall/index.html:300` publica la configuración web de Firebase, que es
pública por diseño: su protección son las reglas de seguridad de Firebase y la restricción de la clave por referrer.

## gemini-proxy

Qué valida (ver `src/validate.ts`):

- Solo `POST` (y el preflight `OPTIONS`) desde `https://juanolaya.github.io`.
- Solo los cuatro pares `modelo:método` que usa `UX/index.html`.
- Cuerpo JSON (objeto) de 4 MiB como máximo: se rechaza antes de leerlo si `Content-Length` lo supera y, si la cabecera
  falta o miente, la lectura se corta en cuanto se pasa del límite.
- Método, origen, ruta y tipo de contenido se comprueban antes de leer el cuerpo.
- Límite por IP (`CF-Connecting-IP`): 20 peticiones cada 60 s con el binding de
  [Rate Limiting de Workers](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
  declarado en `wrangler.toml`. Respuesta `429` sin llamar a Google. Sin el binding, el Worker responde `503`.
- La clave viaja en la cabecera `x-goog-api-key`, nunca en la URL.

**`Origin` solo frena a navegadores.** Un script con `curl` puede enviar `Origin: https://juanolaya.github.io` y pasar ese
filtro; lo que acota el gasto de la clave es el límite por IP. Ese límite es por ubicación de Cloudflare y aproximado
(no es un contador global exacto), así que pon también una cuota diaria a la clave en Google Cloud / AI Studio.

Pruebas (sin red ni dependencias, Node ≥ 22.18):

```bash
cd server/gemini-proxy
npm test
```

Despliegue (lo hace el dueño de la cuenta de Cloudflare):

```bash
cd server/gemini-proxy
npx wrangler@4 login
npx wrangler@4 secret put GEMINI_API_KEY   # pega la clave de Google AI Studio
npm run deploy                             # imprime la URL, p. ej. https://juanolaya-gemini-proxy.<cuenta>.workers.dev
```

Después pon esa URL en `UX/index.html`:

```html
<meta name="gemini-proxy-url" content="https://juanolaya-gemini-proxy.<cuenta>.workers.dev">
```

Con el `content` vacío el AI Hub muestra un aviso y no hace llamadas. Desarrollo local: copia `.dev.vars.example` a
`.dev.vars` (ignorado) y ejecuta `npm run dev`.

## museflow-php (reactivar el estudio)

La página `MuseFlow/` es ahora una versión en TypeScript (`MuseFlow/src/`) que no envía datos: las respuestas a las
sondas de pensamiento solo se muestran al final de la partida. El cliente original del estudio sigue en el historial de
git (`MuseFlow/scripts/main.js` antes de la migración) y en la copia `EurekaWall/Scripts/museFlow/main.js`, ambos con
`dataEndpointBase` a `null`.

Para volver a recoger datos (con el cliente original):

1. **Antes de exponerlo**, cambia las consultas por sentencias preparadas: hoy concatenan los valores del JSON en el
   SQL (inyección SQL) y, si fallan, devuelven el SQL y el error de MySQL al cliente.
2. Sube `platforms-db.php` y `thoughtProbes-db.php` a un servidor con PHP ≥ 7 y MySQL.
3. Copia `config.example.php` a `config.php` en ese servidor y rellénalo con credenciales **nuevas**.
4. Ajusta `Access-Control-Allow-Origin` en los PHP al origen real del juego (hoy `https://www.soscisurvey.de`).
5. Pon la URL de la carpeta en `dataEndpointBase` (sin barra final), p. ej. `'https://servidor.example/museflow'`.
   No uses `cors-anywhere`: el proxy público ya no admite uso general.
6. El `index.html` original esperaba que el servidor de la encuesta sustituyera `%caseNumber%` y `%urn%`.

## sockets (archivado)

Era un ejemplo de tutorial sin uso en el portafolio y Pages no puede alojar Node. `/Sockets/` muestra una nota de
archivo. Para probarlo en local:

```bash
cd server/sockets
npm ci
npm start   # http://localhost:3000
```
