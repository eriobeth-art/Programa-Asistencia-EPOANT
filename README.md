# Pase de Asistencia EPOANT · GitHub Pages

Este paquete usa GitHub Pages únicamente como dominio/contenedor visual y ejecuta la aplicación funcional dentro de Google Apps Script.

## Por qué
La interfaz original usa `google.script.run`, una API que solo funciona correctamente dentro de HtmlService de Google Apps Script. El intento de replicarla mediante `postMessage` desde GitHub Pages puede quedar aislado por el sandbox interno de Apps Script.

## Instalación
1. Sustituye `Code.gs` en Apps Script con `Code_Asistencia_EPOANT_V3_16_EmbedFix.gs`.
2. Crea una nueva versión de la implementación web conservando la misma URL `/exec`.
3. En GitHub, sustituye `index.html` y `CNAME` por los de este paquete.
4. El dominio debe ser `asistenciaepoant.edupsic.com`.
5. Abre el dominio en una ventana privada y prueba inicio de sesión y guardado.
