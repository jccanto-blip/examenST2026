# 🖥️ CPD · Evaluación Interactiva

Plataforma web responsive, dinámica y gamificada para la evaluación gradual de la Unidad Didáctica **«Mantenimiento de rutina y salvaguarda de información en el Centro de Cómputo»** (Módulo: Monitoreo y acciones de mantenimiento de centros de cómputo · II Semestre 2026).

## ✨ Características

- **16 sesiones de aprendizaje** en 4 módulos (Planificación · Preventivo · Correctivo · Salvaguarda) con repaso ilustrado (tarjetas + diagramas SVG) y reto cronometrado de ~137 preguntas de 5 tipos, con feedback formativo.
- **Identidad y privacidad**: cada estudiante ingresa con **nombre completo + DNI (8 dígitos)** como contraseña y ve SOLO su propio progreso. El docente ingresa con código.
- **Formalidad de la evaluación**: máx. **3 intentos** por reto/examen/casos; **copiar/pegar y menú contextual deshabilitados** durante las evaluaciones; los estudiantes no pueden exportar/importar/reiniciar su progreso.
- **Notas 00–20** (mín. 14) con medallas 🥉🥈🥇 y XP/niveles.
- **🧩 Casos prácticos (casuísticas)**: 4 situaciones reales de trabajo con razonamiento lógico y comprensión lectora; se desbloquean al rendir las 16 sesiones y su nota **promedia con las sesiones** para el **promedio final**.
- **🎓 Examen final** (Prueba objetiva oficial): 11 preguntas / 20 puntos / 20 minutos.
- **📊 Mi panel**: dashboard personal del estudiante (promedio final, notas por sesión en barras con colores de estado).
- **👩‍🏫 Dashboard docente** (código `*******`): métricas generales, **cuadro estadístico con números y porcentajes** (aprobados, desaprobados, pendientes, terminados, hombres, mujeres), promedio del curso por sesión, tabla completa (DNI, sexo, 16 sesiones, casos, promedio final, examen, estado), **exportación a PDF y a Excel (.xlsx real)**, respaldo/importación de base JSON y eliminación de estudiantes.
- **Exportación a PDF** (diálogo de impresión del navegador, sin internet) y **XLSX** (zip generado sin dependencias).
- **🎓 Evidencias para Classroom**: cada estudiante descarga un **PDF por evaluación** (16 sesiones + casos + examen) y su **Excel de notas**; el docente **importa esos Excel** y genera el consolidado con **orden de mérito** (🥇🥈🥉), promedios y estadísticas.
- **Guías separadas**: `guia.html` (estudiante) y `guia-docente.html` (docente, contiene el código de acceso). Versiones imprimibles: `GUIA_ESTUDIANTE.docx` y `GUIA_DOCENTE.docx`.
- **Persistencia local** (localStorage) con respaldos administrados únicamente por el docente.
- **☁️ Sincronización opcional en la nube** (Google Sheets + Apps Script): cada resultado terminado se envía automáticamente a la hoja del docente, quien consolida su dashboard con «🔄 Sincronizar nube» (instrucciones en `APPS_SCRIPT_GOOGLE.txt`).

## 🚀 Publicar en GitHub Pages

1. Crea un repositorio (ej.: `cpd-evaluacion`) y sube esta carpeta tal cual.
2. **Settings → Pages → Deploy from a branch → `main` → carpeta `/ (root)` → Save**.
3. La app estará en `https://TU-USUARIO.github.io/cpd-evaluacion/`.

> Sin build ni dependencias: HTML + CSS + JavaScript puro.

## 🔐 Accesos

| Rol | Credenciales |
|---|---|
| Estudiante | Nombre completo + **DNI (8 dígitos)** como contraseña; el sexo se registra la primera vez |
| Docente | Código **configurado por el docente** (no se publica en este README; se cambia en `js/app.js`, función `newDB`, campo `teacherCode`). Acceso: pestaña Docente + botón sostenido 3 s · URL `#/consolidado` · atajo **Ctrl + Shift + D** |

## 📁 Estructura

```
WEB_EVALUACION/
├── index.html          → SPA + banner de diagnóstico
├── css/styles.css      → estilos responsive, tema claro/oscuro, impresión
├── js/data1.js         → Sesión 1
├── js/data2.js         → Sesiones 2 a 8
├── js/data3.js         → Sesiones 9 a 16
├── js/data4.js         → Examen final (Prueba objetiva)
├── js/data5.js         → Casos prácticos (casuísticas)
├── js/xlsx.js          → generador de Excel (.xlsx) sin dependencias
├── js/app.js           → motor: login DNI, quiz, cronómetros, notas, dashboards, PDF, XLSX
├── guia.html           → Guía del estudiante (web)
├── guia-docente.html   → Guía del docente (web, con código de acceso)
├── GUIA_ESTUDIANTE.docx / GUIA_DOCENTE.docx → guías imprimibles
└── README.md
```

## ➕ Agregar preguntas o casos

Cada sesión es un objeto en `js/data*.js`; los casos en `js/data5.js` con el campo `scenario` (párrafos de texto) + `questions`. Formato de pregunta:

```js
{ type: "mc",    time: 45, q: "…", opts: ["…"], a: 0, fb: "…" }
{ type: "tf",    time: 30, q: "…", a: true, fb: "…" }
{ type: "order", time: 90, q: "…", items: ["…"], fb: "…" }
{ type: "match", time: 90, q: "…", pairs: [["término","definición"]], fb: "…" }
{ type: "fill",  time: 40, q: "…", answers: ["r1","r2"], fb: "…" }
```

## ⚠️ Notas

- Los datos viven en el navegador de cada equipo (localStorage). El docente unifica equipos con «Exportar/Importar base» del dashboard.
- Al recargar, siempre se pide acceso nuevamente (por seguridad); los datos no se pierden.

---
Docente: Prof. Juan Carlos Ccanto Camacho · CORCOVADO · II Semestre 2026
