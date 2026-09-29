/* ============================================================
   DATOS — Sesión 1 (piloto con contenidos profundos e ilustrados)
   Mantenimiento de rutina y salvaguarda de información
   Las sesiones 2 a 16 se agregan en este mismo formato.
   ============================================================ */

var SESSIONS = [
  {
    id: 1,
    num: "01",
    title: "Plan de mantenimiento: objetivos y prioridades",
    emoji: "📋",
    module: "A",
    moduleName: "Planificación",
    color: "#2563eb",
    date: "01/09/2026",
    goal: "Identificas los pasos para elaborar el plan de mantenimiento preventivo y correctivo de rutina del centro de cómputo, definiendo sus objetivos y prioridades.",
    product: "Esquema de los pasos y objetivos del plan de mantenimiento",
    review: [
      {
        icon: "📄",
        t: "¿Qué es un plan de mantenimiento?",
        d: "Es el documento que organiza TODAS las acciones necesarias para conservar los equipos del centro de cómputo en buen estado.",
        points: [
          "Define qué se hace, cuándo se hace y quién lo hace.",
          "Cubre dos tipos de mantenimiento: preventivo y correctivo.",
          "Es la base de las buenas prácticas de operación del CPD (Centro de Procesamiento de Datos)."
        ],
        img: '<svg viewBox="0 0 360 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Documento del plan de mantenimiento"><rect x="120" y="8" width="150" height="134" rx="10" fill="#f8fafc" stroke="#64748b" stroke-width="2.5"/><rect x="120" y="8" width="150" height="36" rx="10" fill="#2563eb"/><text x="195" y="31" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">PLAN DE</text><text x="195" y="47" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold">MANTENIMIENTO</text><rect x="134" y="58" width="122" height="7" rx="3.5" fill="#cbd5e1"/><rect x="134" y="72" width="122" height="7" rx="3.5" fill="#cbd5e1"/><rect x="134" y="86" width="92" height="7" rx="3.5" fill="#cbd5e1"/><rect x="134" y="100" width="122" height="7" rx="3.5" fill="#cbd5e1"/><rect x="134" y="114" width="60" height="7" rx="3.5" fill="#cbd5e1"/><text x="60" y="95" font-size="40" text-anchor="middle">📋</text></svg>'
      },
      {
        icon: "⚙️",
        t: "Preventivo vs. correctivo",
        d: "Los dos tipos de mantenimiento se complementan: uno actúa ANTES de la falla y el otro DESPUÉS.",
        points: [
          "PREVENTIVO: evita que las fallas ocurran (limpieza, revisión, actualización programada).",
          "CORRECTIVO: repara las fallas que YA ocurrieron (reemplazo de componentes, configuración).",
          "Un buen plan reduce el mantenimiento correctivo gracias al preventivo."
        ],
        img: '<svg viewBox="0 0 460 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Preventivo antes de la falla y correctivo después"><line x1="40" y1="110" x2="420" y2="110" stroke="#94a3b8" stroke-width="3" marker-end="url(#f1)"/><defs><marker id="f1" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/></marker></defs><rect x="30" y="20" width="130" height="52" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/><text x="95" y="42" font-size="22" text-anchor="middle">🛡️</text><text x="95" y="62" font-size="12" text-anchor="middle" fill="#14532d" font-weight="bold">PREVENTIVO</text><text x="95" y="136" font-size="11" text-anchor="middle" fill="#475569">ANTES de la falla</text><rect x="300" y="20" width="130" height="52" rx="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/><text x="365" y="42" font-size="22" text-anchor="middle">🔧</text><text x="365" y="62" font-size="12" text-anchor="middle" fill="#7f1d1d" font-weight="bold">CORRECTIVO</text><text x="365" y="136" font-size="11" text-anchor="middle" fill="#475569">DESPUÉS de la falla</text><text x="230" y="100" font-size="18" text-anchor="middle">💥</text></svg>'
      },
      {
        icon: "🔢",
        t: "Los 5 pasos para elaborar el plan",
        d: "El plan se construye en un orden lógico: del objetivo general a la medición de resultados.",
        points: [
          "1) Definir objetivos: qué se quiere lograr.",
          "2) Establecer prioridades: qué equipos o servicios son más críticos.",
          "3) Levantar el inventario: qué equipos existen y en qué estado.",
          "4) Definir la periodicidad: cada cuánto se interviene.",
          "5) Evaluar el plan: medir con indicadores (disponibilidad, fallas evitadas)."
        ],
        img: '<svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Los cinco pasos del plan"><g font-size="12.5" font-weight="bold"><rect x="55" y="8" width="190" height="40" rx="10" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="80" y="33" fill="#1e40af">1 · Definir objetivos</text><line x1="150" y1="48" x2="150" y2="60" stroke="#94a3b8" stroke-width="2.5"/><polygon points="145,60 155,60 150,68" fill="#94a3b8"/><rect x="55" y="68" width="190" height="40" rx="10" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="80" y="93" fill="#1e40af">2 · Prioridades</text><line x1="150" y1="108" x2="150" y2="120" stroke="#94a3b8" stroke-width="2.5"/><polygon points="145,120 155,120 150,128" fill="#94a3b8"/><rect x="55" y="128" width="190" height="40" rx="10" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="80" y="153" fill="#1e40af">3 · Inventario</text><line x1="150" y1="168" x2="150" y2="180" stroke="#94a3b8" stroke-width="2.5"/><polygon points="145,180 155,180 150,188" fill="#94a3b8"/><rect x="55" y="188" width="190" height="40" rx="10" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="80" y="213" fill="#1e40af">4 · Periodicidad</text><line x1="150" y1="228" x2="150" y2="240" stroke="#94a3b8" stroke-width="2.5"/><polygon points="145,240 155,240 150,248" fill="#94a3b8"/><rect x="55" y="248" width="190" height="40" rx="10" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="80" y="273" fill="#1e40af">5 · Evaluación</text></g></svg>'
      },
      {
        icon: "🎯",
        t: "Objetivos del plan",
        d: "Todo plan de mantenimiento persigue tres objetivos centrales para el centro de cómputo.",
        points: [
          "Garantizar la CONTINUIDAD y CALIDAD del servicio a los usuarios.",
          "ALARGAR LA VIDA ÚTIL de los equipos (menos reemplazos, menos costos).",
          "PROTEGER LA INFORMACIÓN del negocio (salvaguarda de datos)."
        ],
        img: '<svg viewBox="0 0 460 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tres objetivos del plan"><rect x="12" y="14" width="138" height="82" rx="12" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="81" y="48" font-size="26" text-anchor="middle">🎯</text><text x="81" y="76" font-size="10.5" text-anchor="middle" fill="#1e40af" font-weight="bold">CONTINUIDAD</text><rect x="161" y="14" width="138" height="82" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><text x="230" y="48" font-size="26" text-anchor="middle">⏳</text><text x="230" y="76" font-size="10.5" text-anchor="middle" fill="#14532d" font-weight="bold">VIDA ÚTIL</text><rect x="310" y="14" width="138" height="82" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><text x="379" y="48" font-size="26" text-anchor="middle">🔐</text><text x="379" y="76" font-size="10.5" text-anchor="middle" fill="#78350f" font-weight="bold">INFORMACIÓN</text></svg>'
      },
      {
        icon: "🏫",
        t: "Ejemplo aplicado al CPD",
        d: "Un centro de cómputo con 12 PCs, 1 servidor y 1 impresora de red elabora su plan así:",
        points: [
          "Objetivo: mantener el servicio disponible en los 3 turnos (mañana, tarde y noche).",
          "Prioridades: el servidor y el switch son críticos; las PCs de aula, secundarias.",
          "Inventario: se registran marca, modelo, estado y fecha de última revisión de los 14 equipos.",
          "Periodicidad: limpieza preventiva mensual; correctivo cuando ocurra una falla.",
          "Evaluación: se miden horas de disponibilidad y cantidad de fallas evitadas por trimestre."
        ]
      },
      {
        icon: "⚠️",
        t: "Errores comunes al planificar",
        d: "Evita estos errores al elaborar un plan de mantenimiento:",
        points: [
          "Planificar sin definir objetivos: se hacen acciones sin rumbo.",
          "Ignorar las prioridades: se atiende lo menos crítico primero.",
          "No levantar inventario: se planifica sin saber qué equipos existen.",
          "No medir resultados: nunca se sabe si el plan funcionó."
        ]
      }
    ],
    tip: "Regla de oro: sin objetivos claros no hay plan. Primero define QUÉ quieres lograr y QUÉ es más crítico; el resto (inventario, periodicidad, evaluación) se ordena solo.",
    questions: [
      {
        type: "mc",
        time: 45,
        q: "¿Qué es un plan de mantenimiento?",
        opts: [
          "Un documento que organiza las acciones para conservar los equipos en buen estado",
          "Un programa para limpiar archivos temporales",
          "Una lista de repuestos del taller",
          "El manual de usuario de cada equipo"
        ],
        a: 0,
        fb: "El plan es el documento base del mantenimiento: organiza qué se hace, cuándo y quién lo hace para conservar los equipos del centro de cómputo."
      },
      {
        type: "mc",
        time: 45,
        q: "¿Cuál es el primer paso para elaborar el plan de mantenimiento?",
        opts: [
          "Formatear los discos",
          "Definir los objetivos",
          "Instalar el sistema operativo",
          "Crear imágenes de seguridad"
        ],
        a: 1,
        fb: "Sin objetivos claros no se puede planificar nada: primero se define qué se quiere lograr con el mantenimiento."
      },
      {
        type: "mc",
        time: 45,
        q: "¿Cuál de los siguientes es un OBJETIVO del plan de mantenimiento?",
        opts: [
          "Garantizar la continuidad y calidad del servicio",
          "Formatear los discos cada semana",
          "Instalar más memoria RAM a todos los equipos",
          "Comprar computadoras nuevas"
        ],
        a: 0,
        fb: "Los tres objetivos del plan son: continuidad y calidad del servicio, alargar la vida útil de los equipos y proteger la información."
      },
      {
        type: "tf",
        time: 30,
        q: "Establecer prioridades significa identificar qué equipos o servicios son más críticos.",
        a: true,
        fb: "Correcto: las prioridades indican qué atender primero cuando los recursos son limitados. Por ejemplo, un servidor es más crítico que una PC de aula."
      },
      {
        type: "tf",
        time: 30,
        q: "El mantenimiento preventivo repara las fallas que ya ocurrieron.",
        a: false,
        fb: "¡Cuidado! Reparar fallas ya ocurridas es el mantenimiento CORRECTIVO. El PREVENTIVO evita que las fallas ocurran."
      },
      {
        type: "mc",
        time: 45,
        img: '<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dos computadoras: una con escudo y otra con llave"><rect x="10" y="25" width="180" height="110" rx="12" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/><rect x="26" y="42" width="148" height="62" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/><path d="M85 104 h30 v22 h-30 z" fill="#64748b"/><rect x="70" y="140" width="60" height="8" rx="4" fill="#94a3b8"/><text x="100" y="76" font-size="34" text-anchor="middle">🛡️</text><text x="100" y="160" font-size="13" text-anchor="middle" fill="#334155" font-weight="bold">EQUIPO A</text><rect x="270" y="25" width="180" height="110" rx="12" fill="#e2e8f0" stroke="#64748b" stroke-width="3"/><rect x="286" y="42" width="148" height="62" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/><path d="M345 104 h30 v22 h-30 z" fill="#64748b"/><rect x="330" y="140" width="60" height="8" rx="4" fill="#94a3b8"/><text x="360" y="76" font-size="34" text-anchor="middle">🔧</text><text x="360" y="160" font-size="13" text-anchor="middle" fill="#334155" font-weight="bold">EQUIPO B</text></svg>',
        q: "Observa la imagen. El EQUIPO B (con la llave) está recibiendo mantenimiento…",
        opts: [
          "Preventivo, porque se adelanta a las fallas",
          "Correctivo, porque repara una falla ya ocurrida",
          "Ninguno, solo se está limpiando",
          "Ambos tipos al mismo tiempo"
        ],
        a: 1,
        fb: "La llave representa la REPARACIÓN: el mantenimiento correctivo interviene cuando la falla ya ocurrió. El preventivo se adelanta para evitarla."
      },
      {
        type: "order",
        time: 90,
        q: "Ordena los pasos para elaborar el plan de mantenimiento:",
        items: [
          "Definir objetivos",
          "Establecer prioridades",
          "Levantar el inventario",
          "Definir la periodicidad",
          "Evaluar el plan"
        ],
        fb: "El orden lógico: primero qué se quiere lograr, luego qué es más crítico, después qué equipos existen, cada cuánto intervenir y finalmente cómo medir los resultados."
      },
      {
        type: "match",
        time: 90,
        q: "Relaciona cada concepto con su definición:",
        pairs: [
          ["Mantenimiento preventivo", "Evita fallas antes de que ocurran"],
          ["Mantenimiento correctivo", "Repara fallas ya ocurridas"],
          ["Prioridades", "Equipos o servicios más críticos"],
          ["Inventario", "Registro de todos los equipos"]
        ],
        fb: "Clave: preventivo = EVITAR, correctivo = REPARAR, prioridades = lo crítico, inventario = registro."
      },
      {
        type: "fill",
        time: 40,
        q: "El plan debe establecer ______ para saber qué equipos o servicios son más críticos.",
        answers: ["prioridades", "prioridad"],
        fb: "Las prioridades indican qué atender primero cuando los recursos (tiempo, repuestos, personal) son limitados."
      }
    ]
  }
];
