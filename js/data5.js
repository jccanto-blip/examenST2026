/* ============================================================
   DATOS — Casos prácticos (casuísticas de consolidación)
   Se desbloquean al rendir las 16 sesiones.
   Requieren razonamiento lógico y comprensión de contenido.
   4 casos × 5 preguntas = 20 puntos (nota 0-20, mínimo 14).
   ============================================================ */

var CASOS_DATA = [
  {
    id: 1,
    num: "C1",
    title: "El centro de cómputo sin plan",
    emoji: "🏫",
    module: "Planificación",
    goal: "Aplicas los pasos del plan de mantenimiento a una situación real de trabajo.",
    scenario: [
      "La dirección del instituto te asigna la administración del centro de cómputo, que funciona en tres turnos (mañana, tarde y noche) con 20 computadoras, 1 servidor de archivos y 2 impresoras de red.",
      "Al revisar el lugar encuentras que: no existe ningún documento de mantenimiento, los equipos se limpian «cuando alguien se acuerda», el servidor está cubierto de polvo junto a una ventana, y dos PCs llevan un mes apagadas porque «se reinician solas». Nadie sabe cuándo fue la última revisión de cada equipo.",
      "El director te pide: «Organiza el mantenimiento, pero sin gastar de más: el presupuesto es limitado». Tienes una semana para presentar una propuesta."
    ],
    questions: [
      { type: "mc", time: 60, q: "Según el caso, ¿cuál es la PRIMERA acción que debes realizar para elaborar el plan?", opts: ["Definir los objetivos del mantenimiento", "Formatear las dos PCs que se reinician", "Comprar una computadora nueva", "Instalar un antivirus en el servidor"], a: 0, fb: "El primer paso del plan es definir los objetivos: qué se quiere lograr (continuidad del servicio en los 3 turnos, cuidar el presupuesto)." },
      { type: "mc", time: 60, q: "El servidor «cubierto de polvo junto a una ventana» es una señal de que…", opts: ["No existen prioridades claras: el equipo más crítico está descuidado", "El servidor no necesita mantenimiento", "La ventana no afecta a los equipos", "El presupuesto es suficiente para todo"], a: 0, fb: "El servidor es el equipo más CRÍTICO (todos dependen de él) y está en malas condiciones: al establecer prioridades debe atenderse primero." },
      { type: "tf", time: 45, q: "Antes de proponer la periodicidad del mantenimiento, es necesario levantar el inventario de los 23 equipos.", a: true, fb: "Sin inventario no se puede planificar: hay que registrar los 20 PCs + servidor + 2 impresoras con su estado y última revisión." },
      { type: "order", time: 90, q: "Ordena las acciones de tu propuesta según los pasos del plan:", items: ["Definir los objetivos del mantenimiento", "Establecer prioridades (servidor primero)", "Levantar el inventario de los 23 equipos", "Definir la periodicidad según los turnos", "Evaluar con indicadores (fallas evitadas, disponibilidad)"], fb: "El orden del plan: objetivos → prioridades → inventario → periodicidad → evaluación. La propuesta debe seguir ese orden." },
      { type: "fill", time: 45, q: "Las dos PCs que «se reinician solas» requieren mantenimiento ______ (no programado).", answers: ["correctivo", "correctivo urgente"], fb: "Las fallas ya ocurrieron: corresponde mantenimiento correctivo, priorizado después de los equipos críticos." }
    ]
  },
  {
    id: 2,
    num: "C2",
    title: "La PC lenta y el disco con alerta",
    emoji: "💽",
    module: "Mantenimiento preventivo",
    goal: "Aplicas las técnicas de mantenimiento preventivo de almacenamiento y componentes a un diagnóstico real.",
    scenario: [
      "Una docente del turno noche reporta: «Mi PC está lentísima y hace un ruido raro al encender». Al revisar el equipo observas: el disco está al 98% de su capacidad, el ventilador del procesador gira con dificultad por el polvo acumulado, y CrystalDiskInfo muestra el disco HDD en estado «Precaución» con sectores reasignados.",
      "Además, un compañero te dice: «Ya desfragmenté mi disco SSD con el desfragmentador de Windows para que vaya más rápido, pero sigue igual». La docente necesita su información para las clases de mañana."
    ],
    questions: [
      { type: "mc", time: 60, q: "El disco HDD en estado «Precaución» con sectores reasignados significa que…", opts: ["El disco está anticipando una falla: respaldar y planificar su reemplazo", "El disco está nuevo y sano", "Solo falta desfragmentarlo", "Hay que cambiar la pasta térmica"], a: 0, fb: "SMART avisa: los sectores reasignados indican desgaste físico. Lo correcto es respaldar de inmediato y planificar el reemplazo." },
      { type: "mc", time: 60, q: "¿Qué debes hacer PRIMERO con la información de la docente antes de cualquier intervención?", opts: ["Respaldarla en otro medio (disco externo o red)", "Formatear el disco", "Desfragmentar el disco", "Borrar los archivos temporales"], a: 0, fb: "Con un disco en «Precaución», el respaldo es lo primero: la información vale más que el equipo." },
      { type: "tf", time: 45, q: "Tu compañero hizo bien en desfragmentar su SSD para mejorar el rendimiento.", a: false, fb: "Error: los SSD NO se desfragmentan. La desfragmentación es innecesaria en SSD y desgasta sus celdas. Solo se aplica a discos HDD." },
      { type: "match", time: 90, q: "Relaciona cada hallazgo del caso con la técnica correcta:", pairs: [["Disco al 98% de capacidad", "Limpiar temporales y archivos innecesarios"], ["Disco HDD en estado Precaución", "Respaldar y planificar el reemplazo"], ["Ventilador con polvo", "Limpiar con aire comprimido"], ["SSD desfragmentado por error", "Verificar que no se repita en SSD"]], fb: "Cada síntoma tiene su técnica: espacio, salud del disco, limpieza física y uso correcto de herramientas." },
      { type: "fill", time: 45, q: "El ruido al encender y la lentitud pueden deberse al polvo que obstruye la ______ del equipo.", answers: ["ventilación", "ventilacion", "refrigeración", "refrigeracion"], fb: "El polvo obstruye la ventilación y provoca sobrecalentamiento, ruido y bajo rendimiento." }
    ]
  },
  {
    id: 3,
    num: "C3",
    title: "El equipo que no arranca",
    emoji: "🔧",
    module: "Mantenimiento correctivo",
    goal: "Aplicas el procedimiento de diagnóstico y corrección de fallas de hardware y software.",
    scenario: [
      "En el taller te traen una PC del aula de cómputo con este reporte: «No enciende bien: a veces emite pitidos largos y la pantalla queda negra; la última vez que funcionó mostró la fecha de 2018 y pedía presionar F1». Otro equipo del mismo lote tampoco arranca y muestra el mensaje «No se encontró un sistema operativo» después de que un estudiante intentó «liberar espacio».",
      "Tienes herramientas básicas, módulos de RAM de repuesto, un USB con la imagen del sistema operativo y una pila nueva de reloj. Debes dejar ambos equipos operativos antes del fin del turno."
    ],
    questions: [
      { type: "mc", time: 60, q: "Los pitidos largos al encender con pantalla negra sugieren, en primer lugar, una falla en…", opts: ["La memoria RAM", "El disco duro", "El mouse", "La impresora"], a: 0, fb: "Los códigos de pitidos del POST suelen indicar falla de memoria RAM: se limpian los contactos o se reemplaza el módulo." },
      { type: "mc", time: 60, q: "La fecha de 2018 y el mensaje de presionar F1 indican que…", opts: ["La pila del CMOS está agotada y debe reemplazarse", "El monitor está dañado", "El sistema operativo se borró", "El disco está lleno"], a: 0, fb: "Cuando se pierden la fecha y la hora, la pila del CMOS está agotada: se reemplaza y se configura la BIOS." },
      { type: "mc", time: 60, q: "El segundo equipo muestra «No se encontró un sistema operativo». Lo más probable es que…", opts: ["El estudiante dañó el arranque o borró archivos del sistema al liberar espacio", "La pantalla está desconectada", "El cable de red se soltó", "La impresora no tiene papel"], a: 0, fb: "«Liberar espacio» sin criterio puede borrar archivos del sistema: el arranque quedó dañado y corresponde reinstalar o reparar el SO." },
      { type: "order", time: 90, q: "Ordena el procedimiento para el equipo sin sistema operativo:", items: ["Respaldar la información que aún se pueda recuperar", "Arrancar desde el USB con la imagen del SO", "Particionar y formatear el disco", "Instalar el sistema operativo", "Verificar arranque y registrar el equipo"], fb: "Seguridad primero (respaldo), luego arranque desde el USB, particionado, instalación y verificación." },
      { type: "tf", time: 45, q: "Para el equipo de los pitidos, conviene probar los módulos de RAM de a uno para aislar el defectuoso.", a: true, fb: "El aislamiento prueba un componente a la vez: así se identifica exactamente qué módulo falla antes de reemplazar." }
    ]
  },
  {
    id: 4,
    num: "C4",
    title: "La información que casi se pierde",
    emoji: "🔐",
    module: "Salvaguarda de la información",
    goal: "Aplicas políticas de seguridad, respaldos e imágenes de seguridad a un incidente real.",
    scenario: [
      "Una empresa pequeña sufrió un incidente: un disco del servidor de facturación falló y se perdió una semana de registros porque «el encargado respaldaba cuando se acordaba». Además, se descubrió que cualquier persona podía entrar a la sala de equipos (la puerta no tenía llave) y que varios usuarios compartían la misma contraseña.",
      "La gerencia te pide un plan para que esto no vuelva a ocurrir: quieren que la información crítica se proteja, que los equipos se puedan restaurar rápido tras una falla, y que solo el personal autorizado acceda a la información."
    ],
    questions: [
      { type: "mc", time: 60, q: "¿Qué política corrige directamente la pérdida de una semana de registros?", opts: ["Respaldo periódico programado (backup)", "Cambiar los monitores", "Instalar más RAM", "Pintar la sala de equipos"], a: 0, fb: "El respaldo programado (diario, en otro medio) evita perder días de información ante una falla del disco." },
      { type: "mc", time: 60, q: "Para restaurar RÁPIDO el servidor tras una falla de disco, lo más efectivo es…", opts: ["Tener una imagen de seguridad del sistema", "Esperar al proveedor", "Reinstalar todo desde cero manualmente", "Apagar los otros equipos"], a: 0, fb: "La imagen de seguridad restaura el sistema completo (SO + programas + configuración) en minutos." },
      { type: "tf", time: 45, q: "La puerta sin llave de la sala de equipos es un problema de control de acceso FÍSICO.", a: true, fb: "Correcto: puertas, llaves y candados son controles físicos; las contraseñas son controles lógicos. Ambos son necesarios." },
      { type: "match", time: 90, q: "Relaciona cada problema del caso con su solución:", pairs: [["Respaldo «cuando se acordaba»", "Programar respaldos diarios automáticos"], ["Puerta de la sala sin llave", "Control de acceso físico"], ["Varios usuarios con la misma contraseña", "Contraseñas personales y permisos"], ["Servidor fuera de servicio tras falla", "Imagen de seguridad para restaurar"]], fb: "Cada debilidad de seguridad tiene una política que la corrige: respaldo, control físico, contraseñas e imágenes." },
      { type: "fill", time: 45, q: "La regla 3-2-1 recomienda tener 3 copias, en 2 medios distintos y 1 fuera del ______.", answers: ["local", "local del trabajo", "sitio"], fb: "Una copia fuera del local protege incluso ante incendios, robos o desastres." }
    ]
  }
];
