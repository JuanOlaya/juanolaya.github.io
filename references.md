# References

## VPS y entornos en la nube

### Gratuitos (con límites o verificación de tarjeta)
* **Google Cloud Shell** — Entorno Linux temporal en la nube (2 vCPU, 8 GB RAM, 5 GB persistentes en `$HOME`, 50 h/semana, sin tarjeta). Útil para desarrollo bajo demanda; no funciona 24/7 porque se apaga por inactividad.
* **Oracle Cloud Free Tier** — Instancias ARM permanentes gratis (hasta 4 OCPU y 24 GB RAM). Requiere tarjeta para verificación y depende de disponibilidad por región.
* **Google Cloud Compute Engine (`e2-micro`)** — 1 VPS pequeña gratis permanente (1 GB RAM, 30 GB disco, regiones específicas de EE. UU.). Requiere tarjeta para verificación.

### VPS económicos (24/7, IP fija y acceso root)
* **Hetzner** — Excelente relación rendimiento/precio en Europa y EE. UU. (desde ~4 €/mes).
* **Netcup** — Servidores VPS muy económicos con buenos recursos en Europa.
* **OVH (OVHcloud)** — Proveedor europeo consolidado con VPS accesibles, tráfico ilimitado y centros de datos en Europa y Norteamérica.
* **Hostinger** — VPS gestionables con panel sencillo, planes KVM económicos y plantillas listas para Docker/Linux.

### Alternativas PaaS / Serverless (sin administrar Linux)
* **GitHub Actions** — Levanta máquinas virtuales temporales bajo demanda por evento (ej. al crear o etiquetar un issue) para correr scripts o agentes y abrir PRs.
* **Railway / Render / Fly.io** — Despliegue sencillo de apps, APIs y bots.
* **Cloudflare Workers** — Ejecución serverless en el edge para proxies, APIs ligeras y webhooks.
