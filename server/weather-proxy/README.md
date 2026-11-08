# weather-proxy

Cloudflare Worker que sirve el tiempo de las cámaras de Balconity sin exponer la clave de OpenWeather.
Mismo patrón que `server/gemini-proxy/` (PR #25).

## Por qué un proxy y no `VITE_WEATHER_API_KEY`

Todo lo que empieza por `VITE_` se incrusta en el JavaScript publicado: la clave seguiría siendo pública,
igual que cuando estaba escrita en `Balconity/scripts/script.js`. El Worker guarda la clave como secreto y el
navegador solo conoce la URL del Worker, que es pública por naturaleza.

## API

`GET /weather?city=<slug>` con `Origin: https://juanolaya.github.io`.

- Ciudades permitidas: `brasov`, `sao-paulo`, `taoyuan`, `taipei`, `odessa`, `tokyo`, `verbier`, `venice`,
  `amsterdam` (coordenadas fijas en `src/validate.ts`; no acepta lat/lon arbitrarios).
- Respuesta 200: `{ "main": { "temp": 17.6 }, "weather": [{ "icon": "04d", "description": "..." }] }`
  con `Cache-Control: public, max-age=600`.
- Errores: 403 origen, 404 ruta o ciudad, 405 método, 503 sin clave, 502 error de OpenWeather (sin reenviar su cuerpo).
- Usa el endpoint *Current Weather* (`/data/2.5/weather`, plan gratuito). El antiguo `onecall` 2.5 de Balconity ya no está disponible.

## Despliegue (dueño del repo)

```bash
cd server/weather-proxy
npx wrangler@4 login
npx wrangler@4 secret put OPENWEATHER_API_KEY   # pega la clave NUEVA (rotada)
npx wrangler@4 deploy                           # imprime la URL, p. ej. https://juanolaya-weather-proxy.<cuenta>.workers.dev
```

Después:

1. `Balconity/` (Vue): definir `VITE_WEATHER_PROXY_URL=<url del Worker>` en el entorno de build
   (variable del workflow de despliegue de #9, o `.env.production.local` en local; no es un secreto).
2. `EurekaWall/balconity/index.html`: poner la URL en `<meta name="weather-proxy-url" content="...">`.

Sin URL configurada ambas páginas funcionan igual (cámaras, relojes, navegación) y no muestran temperatura.

Para probar en local: `.dev.vars` con `OPENWEATHER_API_KEY=...` y `ALLOWED_ORIGINS=http://localhost:4173`
(`.dev.vars` no se versiona), luego `npx wrangler@4 dev`.

## Rotar la clave antigua

La clave anterior estuvo publicada en `Balconity/scripts/script.js`, `EurekaWall/Scripts/Balconity.js` y
`EurekaWall/balconity/script.js` y sigue en el historial de git: hay que **regenerarla** en
<https://home.openweathermap.org/api_keys>, borrar la antigua y guardar solo la nueva con `wrangler secret put`.

## Tests

```bash
cd server/weather-proxy && npm test   # node --test, sin dependencias
```
