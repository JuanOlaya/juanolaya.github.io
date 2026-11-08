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

Ningún archivo versionado contiene una clave de Gemini.

## gemini-proxy

Qué valida (ver `src/validate.ts`):

- Solo `POST` (y el preflight `OPTIONS`) desde `https://juanolaya.github.io`.
- Solo los cuatro pares `modelo:método` que usa `UX/index.html`.
- Cuerpo JSON (objeto) de 4 MiB como máximo.
- La clave viaja en la cabecera `x-goog-api-key`, nunca en la URL.

La cabecera `Origin` la puede falsificar un cliente que no sea un navegador. Para limitar abusos, configura además una
regla de *rate limiting* de Cloudflare para la ruta del Worker y una cuota diaria en Google AI Studio.

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

La página `MuseFlow/` funciona como juego estático: `dataEndpointBase` vale `null` en `MuseFlow/scripts/main.js`
(y en la copia `EurekaWall/Scripts/museFlow/main.js`), así que no se envían datos ni se reintenta nada.

Para volver a recoger datos:

1. **Antes de exponerlo**, cambia las consultas por sentencias preparadas: hoy concatenan los valores del JSON en el
   SQL (inyección SQL) y, si fallan, devuelven el SQL y el error de MySQL al cliente.
2. Sube `platforms-db.php` y `thoughtProbes-db.php` a un servidor con PHP ≥ 7 y MySQL.
3. Copia `config.example.php` a `config.php` en ese servidor y rellénalo con credenciales **nuevas**.
4. Ajusta `Access-Control-Allow-Origin` en los PHP al origen real del juego (hoy `https://www.soscisurvey.de`).
5. Pon la URL de la carpeta en `dataEndpointBase` (sin barra final), p. ej. `'https://servidor.example/museflow'`.
   No uses `cors-anywhere`: el proxy público ya no admite uso general.
6. `MuseFlow/index.html` espera que el servidor de la encuesta sustituya `%caseNumber%` y `%urn%`; en Pages se quedan
   tal cual.

## sockets (archivado)

Era un ejemplo de tutorial sin uso en el portafolio y Pages no puede alojar Node. `/Sockets/` muestra una nota de
archivo. Para probarlo en local:

```bash
cd server/sockets
npm ci
npm start   # http://localhost:3000
```
