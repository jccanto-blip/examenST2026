/* ============================================================
   DATOS — Examen final (Prueba objetiva oficial)
   15 preguntas · 20 puntos · Nota mínima: 14
   I. Verdadero/Falso (5 × 1 pto) · II. Selección múltiple (5 × 2 ptos)
   III. Relacionar (5 × 1 pto)
   ============================================================ */

var FINAL_EXAM = {
  title: "Examen final — Mantenimiento de rutina y salvaguarda de información",
  minutes: 20,
  questions: [
    /* ---------- I. VERDADERO / FALSO (1 pto c/u) ---------- */
    {
      type: "tf", time: 30, pts: 1,
      q: "El mantenimiento preventivo busca evitar fallas antes de que ocurran.",
      a: true,
      fb: "El preventivo actúa ANTES: limpieza, revisión y actualización programadas para evitar fallas."
    },
    {
      type: "tf", time: 30, pts: 1,
      q: "El formateo de un disco duro borra toda la información almacenada.",
      a: true,
      fb: "El formateo elimina los datos existentes: por eso el respaldo previo es obligatorio."
    },
    {
      type: "tf", time: 30, pts: 1,
      q: "La BIOS/CMOS no permite configurar el orden de arranque del equipo.",
      a: false,
      fb: "Sí lo permite: en el menú Boot se configura desde qué dispositivo arranca el equipo."
    },
    {
      type: "tf", time: 30, pts: 1,
      q: "Las imágenes de seguridad permiten restaurar el sistema ante una falla.",
      a: true,
      fb: "La imagen es una copia exacta del sistema: se restaura y el equipo vuelve a operar en minutos."
    },
    {
      type: "tf", time: 30, pts: 1,
      q: "La interconexión inalámbrica requiere necesariamente cables de red.",
      a: false,
      fb: "La interconexión inalámbrica (Wi-Fi, IEEE 802.11) funciona sin cables; la cableada usa UTP con RJ45."
    },
    /* ---------- II. SELECCIÓN MÚLTIPLE (2 ptos c/u) ---------- */
    {
      type: "mc", time: 50, pts: 2,
      q: "¿Cuál es el primer paso para elaborar un plan de mantenimiento?",
      opts: ["Formatear los discos", "Definir los objetivos", "Instalar el sistema operativo", "Crear imágenes"],
      a: 1,
      fb: "Primero se definen los objetivos: qué se quiere lograr; el resto del plan se ordena a partir de ahí."
    },
    {
      type: "mc", time: 50, pts: 2,
      q: "¿Qué herramienta permite dividir un disco duro en varias unidades?",
      opts: ["Formateo", "Particionamiento", "Desfragmentación", "Antivirus"],
      a: 1,
      fb: "El particionamiento divide el disco en secciones lógicas (C:, D:); el formateo prepara cada partición."
    },
    {
      type: "mc", time: 50, pts: 2,
      q: "¿Qué componente se limpia con aire comprimido y se le renueva la pasta térmica?",
      opts: ["Disco duro", "Procesador (CPU)", "Teclado", "Monitor"],
      a: 1,
      fb: "El procesador se limpia con aire comprimido y su pasta térmica se renueva entre el CPU y el disipador."
    },
    {
      type: "mc", time: 50, pts: 2,
      q: "¿Qué sistema de archivos es común en Windows?",
      opts: ["NTFS", "ext4", "HFS+", "APFS"],
      a: 0,
      fb: "NTFS es el sistema de archivos estándar de los discos internos de Windows."
    },
    {
      type: "mc", time: 50, pts: 2,
      q: "¿Qué herramienta crea una copia exacta del sistema para restaurarlo?",
      opts: ["CCleaner", "Imagen de seguridad", "Defragmentador", "Administrador de tareas"],
      a: 1,
      fb: "La imagen de seguridad (Clonezilla, Acronis, Windows Backup) copia el sistema completo para restaurarlo."
    },
    /* ---------- III. RELACIONAR (5 pares × 1 pto = 5 ptos) ---------- */
    {
      type: "match", time: 120, pts: 5,
      q: "Une cada término con su función:",
      pairs: [
        ["Mantenimiento preventivo", "Evitar fallas futuras"],
        ["Mantenimiento correctivo", "Reparar una falla ya ocurrida"],
        ["Inventario", "Registro de los equipos existentes"],
        ["Interconexión", "Comunicación entre computadoras"],
        ["Salvaguarda", "Protección y resguardo de la información"]
      ],
      fb: "Preventivo = evitar · Correctivo = reparar · Inventario = registrar · Interconexión = comunicar · Salvaguarda = proteger."
    }
  ]
};
