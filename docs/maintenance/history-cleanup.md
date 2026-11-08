# Limpieza del historial git (issue #6)

Runbook para que **el dueño del repositorio** reduzca el tamaño de `.git`.
Reescribir el historial cambia todos los hashes de commit, así que nadie más
puede hacerlo y hay que coordinar un re-clonado.

> Ningún comando de esta guía se ha ejecutado contra GitHub. Las cifras salen
> de un ensayo (dry run) sobre un clon espejo desechable que nunca se subió.

## 1. Cifras medidas (2026-11-08, `master` = `32201ad0`)

Clon espejo completo (`git clone --mirror`), 1688 commits, 44 228 objetos.

| Escenario | Qué se elimina del historial | Pack `.git` | Ahorro |
|---|---|---|---|
| Actual | nada | **148,30 MiB** | — |
| A — basura | `tmp*`, perfiles de Chrome/Edge, `Sockets/node_modules/`, `.vs/` | **110,15 MiB** | −38,2 MiB (−26 %) |
| B — recomendado | A + `Deutsch_lernen/output/angela_video/` + `bamf_official_2025.pdf` | **77,13 MiB** | −71,2 MiB (−48 %) |
| C — A + Git LFS | A y además `*.mp4`, `*.wav` y el PDF del BAMF migrados a LFS | 90,76 MiB + 24 MB en LFS | −57,5 MiB en git |

Árbol de trabajo de `master`: 11 263 archivos / 376 MB hoy → 8 492 / 182 MB (A)
→ 8 430 / 121 MB (B).

### Blobs más pesados del historial (tamaño comprimido en el pack)

| Ruta | Real | En el pack |
|---|---|---|
| `Deutsch_lernen/tmp/video_deps/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe` | 83,6 MB | 29,8 MB |
| `Deutsch_lernen/Einbürgerungstest/fragen_antwort_test/bamf_official_2025.pdf` (y 2 copias más) | 8,6 MB | 8,4 MB |
| `Deutsch_lernen/output/angela_video/angela_presentacion.mp4` | 7,5 MB | 6,7 MB |
| `Haptic_Cards/img/*.png` (5 imágenes del sitio, se conservan) | 2–4 MB c/u | 14,9 MB |

### Por categoría (todas las versiones)

| Categoría | Blobs | Real | En el pack |
|---|---|---|---|
| ffmpeg / `tmp/video_deps` | 19 | 83,7 MB | 29,8 MB |
| `output/angela_video` (mp4, wav, frames, clips) | 58 | 42,3 MB | 24,7 MB |
| PDFs | 70 | 41,6 MB | 16,5 MB |
| Perfiles de Chrome/Edge headless | 567 | 77,7 MB | 3,8 MB |
| Otros `tmp*` | 360 | 5,7 MB | 1,9 MB |
| `Sockets/node_modules` | 1 094 | 8,2 MB | 1,8 MB |
| `.vs/` | 5 | 2,0 MB | 0,6 MB |
| Imágenes (se conservan) | 251 | 55,7 MB | 53,6 MB |

## 2. Por qué no se activa Git LFS

El sitio se publica con GitHub Pages en modo *legacy* desde `master` (`/`).
**Pages no sirve contenido LFS**: entregaría el puntero de texto de 130 bytes
en lugar del vídeo o del PDF. Hoy estas URL responden `200`:

- `https://juanolaya.github.io/Deutsch_lernen/output/angela_video/angela_presentacion.mp4` (7,9 MB)
- `https://juanolaya.github.io/CV/JuanOlaya.pdf` (161 KB, enlazado desde `index.html`)

Por eso `.gitattributes` solo marca los medios como `binary` y deja las reglas
LFS comentadas. Recomendación:

- **Vídeo `angela_presentacion.mp4`** → subirlo a un **GitHub Release** y
  enlazarlo desde allí (ningún HTML del sitio lo enlaza hoy).
- **`bamf_official_2025.pdf`** → es un documento público del BAMF; enlazar la
  fuente oficial o adjuntarlo al mismo Release.
- **`CV/JuanOlaya.pdf`** → se queda en git (pequeño y enlazado desde el sitio).
- Activar LFS solo si el despliegue pasa a un workflow de Actions con
  `actions/checkout` y `lfs: true` (escenario C).

## 3. Lista de rutas a eliminar

Guardar como `paths-to-remove.txt` (escenario B; para el A, quitar las tres
últimas líneas):

```text
Deutsch_lernen/tmp/
Deutsch_lernen/tmp_lid_pdf/
Deutsch_lernen/tmp_edge_profile/
Sockets/node_modules/
.vs/
glob:**/.chrome-headless-profile*/**
glob:**/.edge-headless-profile*/**
glob:**/chrome-profile/**
Deutsch_lernen/output/angela_video/
glob:**/bamf_official_2025.pdf
```

## 4. Procedimiento

### 4.1 Antes de empezar

1. Fusionar o cerrar los PR abiertos (los hashes cambian y los PR quedarán
   desfasados). Avisar a cualquiera que tenga un fork o clon.
2. Fusionar el PR del issue #5 (`.gitignore` y archivos destrackeados) para que
   la basura no vuelva a entrar.
3. Instalar la herramienta: `pip install git-filter-repo`.

### 4.2 Guardar los binarios que se conservan

```bash
mkdir -p ~/keep
curl -L -o ~/keep/angela_presentacion.mp4 \
  https://juanolaya.github.io/Deutsch_lernen/output/angela_video/angela_presentacion.mp4
gh release create media-2026 ~/keep/angela_presentacion.mp4 \
  -R JuanOlaya/juanolaya.github.io --title "Medios del sitio" \
  --notes "Binarios grandes retirados del historial (issue #6)."
```

### 4.3 Copia de seguridad

```bash
git clone --mirror https://github.com/JuanOlaya/juanolaya.github.io.git backup.git
tar czf juanolaya-backup-$(date +%F).tgz backup.git
```

### 4.4 Reescritura

```bash
git clone --mirror https://github.com/JuanOlaya/juanolaya.github.io.git work.git
cd work.git
git filter-repo --invert-paths --paths-from-file ../paths-to-remove.txt
git count-objects -vH   # esperado: size-pack ≈ 77 MiB (B) o ≈ 110 MiB (A)
```

`git filter-repo` elimina el remoto `origin` a propósito. Revisar antes de subir:

```bash
git log --oneline -5 master
git ls-tree -r --name-only master | grep -E 'tmp/|headless-profile|node_modules/' || echo limpio
```

### 4.5 Subida (solo el dueño)

```bash
git remote add origin https://github.com/JuanOlaya/juanolaya.github.io.git
git push origin --force 'refs/heads/*' 'refs/tags/*'
```

No usar `git push --mirror`: GitHub rechaza `refs/pull/*`. Esas referencias de
PR antiguas siguen apuntando a los objetos viejos; para purgarlos del servidor
hay que pedirlo al soporte de GitHub (formulario *Remove data from a repository*).

Después, comprobar que Pages vuelve a publicar y que
`https://juanolaya.github.io/` y `https://juanolaya.github.io/CV/JuanOlaya.pdf`
responden `200`.

### 4.6 Alternativa con LFS (escenario C, solo con despliegue por Actions)

```bash
git filter-repo --invert-paths --paths-from-file ../paths-a.txt
git lfs migrate import --everything \
  --include="*.mp4,*.wav,Deutsch_lernen/**/bamf_official_2025.pdf"
git reflog expire --expire=now --all && git gc --prune=now
```

Y descomentar las reglas LFS de `.gitattributes`.

## 5. Coordinación del re-clonado

Tras la subida, **todos** los clones y forks tienen un historial incompatible:

```bash
# En cada máquina: guardar el trabajo no subido como parche y volver a clonar
git format-patch origin/master --stdout > mi-trabajo.patch
cd .. && rm -r juanolaya.github.io
git clone https://github.com/JuanOlaya/juanolaya.github.io.git
```

No hacer `git pull` ni `git merge` desde un clon antiguo: reintroduciría todos
los objetos eliminados. Los forks deben sincronizarse con *Discard commits* o
volver a crearse.

## 6. Cómo se midió

```bash
git clone --mirror https://github.com/JuanOlaya/juanolaya.github.io.git full.git
git -C full.git count-objects -vH
git -C full.git rev-list --objects --all \
  | git -C full.git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(objectsize:disk) %(rest)' \
  | awk '$1=="blob"' | sort -k3 -nr | head -40
git clone --mirror --no-local full.git m-b.git && git -C m-b.git remote remove origin
(cd m-b.git && git filter-repo --invert-paths --paths-from-file ../paths-b.txt --force)
git -C m-b.git count-objects -vH
```
