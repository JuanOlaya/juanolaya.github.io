# Guía para Añadir o Modificar Grupos de Verbos

Esta guía explica cómo añadir nuevos grupos de verbos o reorganizar los existentes en cualquiera de los niveles de la aplicación (**A1.1**, **A1.2**, **A2.1**, **A2.2**, **B1.1**, **B2.1**) asegurándote de que no se pierda ningún grupo en la interfaz.

---

## 📋 Resumen: Lo que se debe actualizar

Cuando creas, mueves o eliminas un grupo, debes actualizar/ejecutar **4 cosas** en el proyecto:

1. **Archivo JSON de grupo**: Crear o renombrar el archivo en `json/groups/`.
2. **Configuración en `script/script.js`**: Actualizar `physicalLevelMap` para el nivel afectado.
3. **Scripts de sincronización y validación**: Ejecutar los scripts de Node.js en la terminal.
4. **Historial**: Registrar los cambios en `CHANGELOG.md` / `CHANGES_LOG.md`.

---

## 🚶‍♂️ Instrucciones Paso a Paso

### Paso 1: Crear o Modificar el Archivo JSON de Grupo
Los archivos de grupo se dividen por carpetas según su nivel en `json/groups/{LEVEL}/`. 

#### ⚠️ Regla de Oro en Nombramientos (Consecutivos):
Los archivos **deben ser estrictamente consecutivos en su numeración física**. No dejes saltos de números en la carpeta.
* *Ejemplo:* Si en `A2_2` el último archivo físico es `A2_2_group_29.json`, el nuevo grupo **debe** llamarse obligatoriamente `A2_2_group_30.json`.

**Plantilla del archivo JSON (`json/groups/{LEVEL}/{LEVEL}_group_{N}.json`):**
```json
{
  "level": "A2.2",
  "theme": "NombreDelTema",
  "verbs": [
    "verb1",
    "verb2",
    "verb3"
  ],
  "germanName": "Nombre en Alemán",
  "spanishName": "Nombre en Español",
  "englishName": "Nombre en Inglés"
}
```

---

### Paso 2: Actualizar `physicalLevelMap` en `script.js`
Abre [script.js](file:///c:/Users/juan/Documents/GitHub/juanolaya.github.io/Deutsch_lernen/verben/A1_A2_B1/script/script.js) y localiza la constante `physicalLevelMap` al inicio del archivo (línea ~18).

Debes incrementar el `"count"` y añadir el número consecutivo en el array de `"fileNumbers"` para el subnivel modificado.

*Ejemplo (si añadimos el grupo 30 a `A2_2`):*
```javascript
'A2': [
    { key: 'A2_1', count: 12, fileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { key: 'A2_2', count: 18, fileNumbers: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] } // ← Modificado 'count' a 18 y añadido el '30'
]
```

---

### Paso 3: Sincronizar Base de Datos y Fichas de Verbo
La aplicación lee el archivo compilado `json/verbs_index.json` y las fichas individuales de los verbos en `json/cards/`. Para sincronizar tus cambios físicos en las carpetas de grupos con estos archivos, abre una terminal en la carpeta `Deutsch_lernen/verben/A1_A2_B1/` y corre:

1. **`node update_index.js`**
   * *¿Qué hace?* Recopila todos los grupos físicos, calcula su orden real y genera el índice general de la app (`verbs_index.json`).
2. **`node sync_card_groups.js`**
   * *¿Qué hace?* Actualiza automáticamente el número de grupo dentro de cada ficha individual de verbo en `json/cards/` para que coincida exactamente con el índice compilado.

---

### Paso 4: Validar que no haya pérdidas
Para tener la certeza absoluta de que no se ha roto ninguna ruta ni se ha quedado ningún grupo en el aire sin mostrarse, ejecuta:

```bash
node verify_inventory.js
```

* **Si el script devuelve:** `Inventory is UP TO DATE.`, todo está perfecto y puedes probar/desplegar de forma segura.
* **Si el script devuelve algún error/desajuste:** Revisa el listado de discrepancias en la terminal. Significa que hay algún desajuste de archivos, verbos duplicados o números de grupo no alineados.

---

## 🔀 Reorganizar: Insertar un Grupo en Medio de un Nivel
Si necesitas insertar un grupo entre otros existentes (por ejemplo, crear un grupo en la posición 6 de `A1.1` desplazando los siguientes):

1. **Renombrar archivos existentes en orden inverso** (desde el último hacia atrás) para liberar el número:
   * `A1_1_group_14.json` ➔ `A1_1_group_15.json`
   * `A1_1_group_13.json` ➔ `A1_1_group_14.json`
   * ...
   * `A1_1_group_6.json` ➔ `A1_1_group_7.json`
2. **Crear el nuevo grupo** como `A1_1_group_6.json`.
3. **Modificar `physicalLevelMap` en `script.js`** aumentando el count y agregando el número consecutivo al final de `fileNumbers` (ej. agregar `15`).
4. **Correr los comandos de sincronización**:
   ```bash
   node update_index.js
   node sync_card_groups.js
   node verify_inventory.js
   ```

---

## 🛠️ Solución de Problemas Comunes

### 🔴 Error: "Ein Fehler ist beim Laden der Verben aufgetreten" en la app
* **Causa:** La aplicación está intentando descargar un archivo `.json` de grupo que no existe físicamente en el disco.
* **Solución:** Revisa la consola del navegador (F12) para ver qué archivo está arrojando un error 404 (ej. `A2_2_group_18.json` no encontrado). Asegúrate de que los archivos en disco sean consecutivos y que `physicalLevelMap` en `script.js` coincida exactamente con el número de archivos reales.

### 🟡 El grupo nuevo no se muestra en el menú
* **Causa:** Cache del navegador persistida o falta actualizar el índice.
* **Solución:** Corre `node update_index.js`, refresca el navegador haciendo una limpieza de cache fuerte (`Ctrl + F5` o `Cmd + Shift + R`).
