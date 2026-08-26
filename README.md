# Pase de Asistencia EPOANT · GitHub Pages V3.16

Frontend preparado para publicarse en GitHub Pages y utilizar el backend existente de Google Apps Script.

## Archivos que sí van al repositorio de GitHub

- `index.html` — interfaz completa del sistema.
- `config.js` — URL del backend Apps Script y dominio personalizado.
- `apps-script-bridge.js` — puente de comunicación entre GitHub Pages y Apps Script.
- `CNAME` — dominio personalizado `asistenciaepoant.edupsic.com`.
- `.nojekyll` — evita procesamiento innecesario de Jekyll.

## Backend asociado

El frontend está configurado para esta implementación de Apps Script:

`https://script.google.com/macros/s/AKfycbwhSxb01ovGGSy86Z_rA3lZZH0yqljZrWZeiRvHXkb8zldU2wKviJbBOk7bPc0sy-A/exec`

Para que el puente funcione, el proyecto de Apps Script debe actualizarse con el archivo separado `Code_Asistencia_EPOANT_V3_16_GitHubBridge.gs` y publicarse como Aplicación web.

## DNS recomendado

En Squarespace Domains:

- Tipo: `CNAME`
- Nombre: `asistencia`
- Datos del alias: `eriobeth-art.github.io`
- TTL: `1 hora`

## GitHub Pages

1. Sube estos archivos a la raíz del repositorio.
2. Ve a **Settings → Pages**.
3. Publica desde la rama `main`, carpeta `/ (root)`.
4. En **Custom domain** usa `asistenciaepoant.edupsic.com`.
5. Cuando GitHub valide el DNS, activa **Enforce HTTPS**.

## Seguridad

El backend conserva el inicio de sesión y los tokens del sistema. El puente del Apps Script acepta llamadas únicamente desde `https://asistenciaepoant.edupsic.com` y `https://eriobeth-art.github.io`.
