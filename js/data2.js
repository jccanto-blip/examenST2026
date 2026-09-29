/* ============================================================
   DATOS — Sesiones 2 a 8
   Mantenimiento de rutina y salvaguarda de información
   ============================================================ */

var SESSIONS2 = [
  {
    id: 2,
    num: "02",
    title: "Inventario, periodicidad y evaluación del plan",
    emoji: "📝",
    module: "A",
    moduleName: "Planificación",
    color: "#2563eb",
    date: "02/09/2026",
    goal: "Elaboras el inventario de equipos del centro de cómputo y defines la periodicidad y evaluación del plan de mantenimiento.",
    product: "Inventario de equipos del centro de cómputo",
    review: [
      {
        icon: "📝", t: "¿Qué es el inventario?",
        d: "Es el registro de TODOS los equipos del centro de cómputo con sus características. Es la base para planificar el mantenimiento: sin inventario no hay plan.",
        points: [
          "Código, tipo de equipo, marca y modelo.",
          "Componentes principales: CPU, RAM, disco, tarjeta.",
          "Estado actual y fecha de la última revisión."
        ],
        img: '<svg viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ficha de inventario"><rect x="10" y="10" width="400" height="130" rx="10" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><rect x="10" y="10" width="400" height="30" rx="10" fill="#2563eb"/><text x="210" y="30" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold">INVENTARIO DE EQUIPOS</text><text x="40" y="58" font-size="11" fill="#1e40af" font-weight="bold">Código</text><text x="130" y="58" font-size="11" fill="#1e40af" font-weight="bold">Equipo</text><text x="220" y="58" font-size="11" fill="#1e40af" font-weight="bold">Marca / modelo</text><text x="340" y="58" font-size="11" fill="#1e40af" font-weight="bold">Estado</text><line x1="15" y1="65" x2="405" y2="65" stroke="#cbd5e1" stroke-width="1.5"/><text x="40" y="82" font-size="11" fill="#475569">PC-01</text><text x="130" y="82" font-size="11" fill="#475569">Computadora</text><text x="220" y="82" font-size="11" fill="#475569">HP ProDesk</text><text x="340" y="82" font-size="11" fill="#16a34a">Operativo</text><text x="40" y="102" font-size="11" fill="#475569">SRV-01</text><text x="130" y="102" font-size="11" fill="#475569">Servidor</text><text x="220" y="102" font-size="11" fill="#475569">Dell PowerEdge</text><text x="340" y="102" font-size="11" fill="#16a34a">Operativo</text><text x="40" y="122" font-size="11" fill="#475569">PC-07</text><text x="130" y="122" font-size="11" fill="#475569">Computadora</text><text x="220" y="122" font-size="11" fill="#475569">Lenovo</text><text x="340" y="122" font-size="11" fill="#dc2626">Por revisar</text></svg>'
      },
      {
        icon: "⏰", t: "Periodicidad del mantenimiento",
        d: "Cada tipo de mantenimiento tiene su propio ritmo:",
        points: [
          "PREVENTIVO: limpieza y revisión programadas (mensual o según el plan).",
          "CORRECTIVO: se realiza cuando ocurre una falla, no se programa."
        ]
      },
      {
        icon: "📈", t: "Evaluación del plan",
        d: "El plan se mide con indicadores que muestran si está funcionando:",
        points: [
          "Disponibilidad: tiempo en que los equipos están operativos.",
          "Fallas evitadas: fallas que el preventivo impidió.",
          "Tiempo de respuesta: rapidez con que se atiende un problema."
        ]
      },
      {
        icon: "🏫", t: "Ejemplo aplicado al CPD",
        d: "El aula taller levanta su inventario así:",
        points: [
          "12 computadoras de escritorio con código PC-01 a PC-12, marca, modelo y estado.",
          "1 switch y 1 access point registrados como equipos de red.",
          "Cada equipo lleva fecha de última revisión y responsable.",
          "Preventivo mensual: limpieza de 6 PCs la primera semana y 6 la segunda."
        ]
      },
      {
        icon: "⚠️", t: "Errores comunes",
        points: [
          "Inventario desactualizado: llegan equipos nuevos y no se registran.",
          "No anotar el estado ni la fecha de revisión.",
          "Definir periodicidad sin consultar la carga de uso de los equipos.",
          "Nunca medir indicadores: no se sabe si el plan funciona."
        ]
      },
      {
        icon: "🔗", t: "Relación con el plan",
        d: "El inventario es el paso 3 del plan de mantenimiento: después de definir objetivos y prioridades, se registra QUÉ equipos existen. Sin inventario no se puede calcular la periodicidad ni evaluar resultados."
      }
    ],
    tip: "Un plan sin inventario es como comprar repuestos sin saber qué equipos tienes: primero registra, después planifica.",
    questions: [
      { type: "mc", q: "¿Qué es el inventario de equipos?", opts: ["El registro de todos los equipos del centro de cómputo con sus características", "La lista de compras del taller", "El manual del sistema operativo", "El registro de contraseñas de los usuarios"], a: 0, fb: "El inventario registra cada equipo con sus características: código, tipo, marca, modelo, componentes y estado. Es la base del plan." },
      { type: "mc", q: "¿Qué dato NO corresponde registrar en el inventario?", opts: ["La contraseña de acceso de cada usuario", "El código y tipo de equipo", "La marca y el modelo", "El estado actual y la fecha de última revisión"], a: 0, fb: "Las contraseñas son información confidencial del usuario, no del inventario de equipos." },
      { type: "tf", q: "El mantenimiento preventivo se programa mensualmente o según el plan, mientras que el correctivo se realiza cuando ocurre una falla.", a: true, fb: "Correcto: el preventivo tiene periodicidad programada y el correctivo responde a las fallas cuando aparecen." },
      { type: "mc", img: '<svg viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ficha de inventario con una celda vacía"><rect x="10" y="10" width="400" height="130" rx="10" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><rect x="10" y="10" width="400" height="30" rx="10" fill="#2563eb"/><text x="210" y="30" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold">INVENTARIO DE EQUIPOS</text><text x="40" y="58" font-size="11" fill="#1e40af" font-weight="bold">Código</text><text x="130" y="58" font-size="11" fill="#1e40af" font-weight="bold">Equipo</text><text x="220" y="58" font-size="11" fill="#1e40af" font-weight="bold">Marca / modelo</text><text x="340" y="58" font-size="11" fill="#1e40af" font-weight="bold">¿?</text><line x1="15" y1="65" x2="405" y2="65" stroke="#cbd5e1" stroke-width="1.5"/><text x="40" y="82" font-size="11" fill="#475569">PC-03</text><text x="130" y="82" font-size="11" fill="#475569">Computadora</text><text x="220" y="82" font-size="11" fill="#475569">Lenovo V15</text><rect x="330" y="72" width="66" height="14" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/><text x="363" y="83" font-size="11" fill="#b45309" text-anchor="middle">?</text><text x="40" y="102" font-size="11" fill="#475569">SRV-01</text><text x="130" y="102" font-size="11" fill="#475569">Servidor</text><text x="220" y="102" font-size="11" fill="#475569">Dell PowerEdge</text><rect x="330" y="92" width="66" height="14" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/><text x="363" y="103" font-size="11" fill="#b45309" text-anchor="middle">?</text></svg>', q: "En esta ficha de inventario, la columna marcada con «?» está vacía. ¿Qué dato debe registrarse ahí?", opts: ["El estado actual del equipo y la fecha de revisión", "La contraseña del usuario", "El color de la pared del aula", "El nombre del vendedor"], a: 0, fb: "El estado actual y la fecha de última revisión son datos obligatorios del inventario: permiten priorizar los mantenimientos." },
      { type: "match", q: "Relaciona cada indicador con lo que mide:", pairs: [["Disponibilidad", "Tiempo en que los equipos están operativos"], ["Fallas evitadas", "Eficacia del mantenimiento preventivo"], ["Tiempo de respuesta", "Rapidez con que se atiende un problema"]], fb: "Los tres indicadores miden si el plan de mantenimiento está cumpliendo sus objetivos." },
      { type: "order", q: "Ordena el proceso de trabajo con el inventario:", items: ["Levantar el inventario de equipos", "Verificar el estado de cada equipo", "Definir la periodicidad del mantenimiento", "Ejecutar el mantenimiento programado", "Evaluar con indicadores"], fb: "Primero registras, luego revisas, programas, ejecutas y al final mides con indicadores." },
      { type: "fill", q: "El inventario registra el estado actual y la fecha de la última ______ de cada equipo.", answers: ["revisión", "revision"], fb: "La fecha de la última revisión permite saber qué equipos llevan más tiempo sin mantenimiento." }
    ]
  },
  {
    id: 3,
    num: "03",
    title: "Puesta en marcha del plan de mantenimiento",
    emoji: "🚀",
    module: "A",
    moduleName: "Planificación",
    color: "#2563eb",
    date: "03/09/2026",
    goal: "Elaboras el plan de mantenimiento preventivo y correctivo de rutina, definiendo cronograma y responsables para su puesta en marcha.",
    product: "Plan de mantenimiento preventivo y correctivo de rutina",
    review: [
      { icon: "🚀", t: "¿Qué es la puesta en marcha?", d: "Es la fase en que el plan de mantenimiento se traduce en actividades concretas con responsables, recursos y fechas. Un plan en papel no sirve: hay que ejecutarlo." },
      { icon: "🗓️", t: "Cronograma de actividades", d: "Define las FECHAS de ejecución de cada actividad del mantenimiento.", points: ["Ejemplo: «Lunes 07: limpieza de 6 PCs del turno mañana».", "Distribuye la carga de trabajo en el tiempo disponible."] },
      { icon: "👥", t: "Asignación de responsables", d: "Cada actividad debe tener una persona o equipo a cargo.", points: ["Ejemplo: «Equipo 1: Ana y Luis — limpieza de PCs 1 a 6».", "Sin responsables, nadie responde por el cumplimiento."] },
      { icon: "🧰", t: "Recursos necesarios", d: "Todo lo que se necesita para ejecutar el plan:", points: ["Herramientas: aire comprimido, destornilladores, pulsera antiestática.", "Repuestos: pasta térmica, pilas CMOS, cables.", "Software: utilitarios de limpieza y diagnóstico."] },
      { icon: "📊", t: "Indicadores de cumplimiento", d: "Permiten verificar que el plan se está ejecutando: actividades completadas a tiempo, equipos atendidos por semana, fallas corregidas en el plazo." },
      { icon: "⚠️", t: "Errores comunes", points: ["Cronograma sin fechas concretas.", "Actividades sin responsable asignado.", "No reunir los recursos antes de empezar.", "No verificar el cumplimiento del cronograma."] }
    ],
    tip: "Un plan sin responsables ni fechas es solo una buena intención: cronograma + responsable + recursos = plan ejecutable.",
    questions: [
      { type: "mc", q: "¿Qué es la puesta en marcha del plan de mantenimiento?", opts: ["La fase en que el plan se traduce en actividades concretas con responsables, recursos y fechas", "El formateo de los discos", "La compra de equipos nuevos", "La instalación del sistema operativo"], a: 0, fb: "Poner en marcha el plan significa convertirlo en acciones reales: quién hace qué, con qué recursos y cuándo." },
      { type: "mc", q: "¿Qué elemento del plan define las fechas de ejecución de las actividades?", opts: ["El cronograma", "El inventario", "El antivirus", "La pasta térmica"], a: 0, fb: "El cronograma asigna fechas concretas a cada actividad del mantenimiento." },
      { type: "tf", q: "Un plan de mantenimiento sin responsables asignados se puede ejecutar sin problemas.", a: false, fb: "Sin responsables nadie responde por el cumplimiento: cada actividad debe tener una persona o equipo a cargo." },
      { type: "match", q: "Relaciona cada elemento con su ejemplo:", pairs: [["Cronograma", "«Lunes 07: limpieza de 6 PCs»"], ["Responsables", "«Equipo 1: Ana y Luis»"], ["Recursos", "«Aire comprimido y pasta térmica»"], ["Indicador", "«Fallas evitadas por mes»"]], fb: "Los cuatro elementos juntos hacen que el plan sea ejecutable y medible." },
      { type: "order", q: "Ordena los pasos para poner en marcha el plan:", items: ["Elaborar el cronograma de actividades", "Asignar responsables a cada actividad", "Reunir los recursos necesarios", "Ejecutar las actividades programadas", "Verificar los indicadores de cumplimiento"], fb: "Primero fechas, luego personas, luego recursos; se ejecuta y al final se verifica el cumplimiento." },
      { type: "mc", img: '<svg viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cronograma de actividades"><rect x="10" y="10" width="400" height="130" rx="10" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><rect x="10" y="10" width="400" height="30" rx="10" fill="#2563eb"/><text x="210" y="30" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold">CRONOGRAMA DE MANTENIMIENTO</text><text x="45" y="56" font-size="11" fill="#1e40af" font-weight="bold">Lunes</text><text x="160" y="56" font-size="11" fill="#1e40af" font-weight="bold">Martes</text><text x="275" y="56" font-size="11" fill="#1e40af" font-weight="bold">Miércoles</text><text x="45" y="74" font-size="10.5" fill="#475569">Limpieza PCs 1-6</text><text x="160" y="74" font-size="10.5" fill="#475569">Limpieza PCs 7-12</text><text x="275" y="74" font-size="10.5" fill="#475569">Revisión del switch</text><text x="45" y="92" font-size="10.5" fill="#475569">Equipo 1</text><text x="160" y="92" font-size="10.5" fill="#475569">Equipo 2</text><text x="275" y="92" font-size="10.5" fill="#475569">Equipo 1</text><text x="45" y="118" font-size="10.5" fill="#16a34a">9:00 - 11:00</text><text x="160" y="118" font-size="10.5" fill="#16a34a">9:00 - 11:00</text><text x="275" y="118" font-size="10.5" fill="#16a34a">15:00 - 16:00</text></svg>', q: "Según el cronograma de la imagen, ¿qué información adicional es imprescindible para ejecutarlo?", opts: ["La asignación de responsables a cada actividad", "El color de las computadoras", "La marca de los monitores", "El nombre del proveedor de internet"], a: 0, fb: "El cronograma ya tiene fechas y horas, pero sin responsables asignados nadie responde por las tareas." },
      { type: "fill", q: "La puesta en marcha traduce el plan en actividades ______ con responsables, recursos y fechas.", answers: ["concretas", "concreta"], fb: "Pasar del papel a la acción: actividades concretas, no ideas generales." }
    ]
  },
  {
    id: 4,
    num: "04",
    title: "Mantenimiento preventivo de unidades de almacenamiento",
    emoji: "💽",
    module: "B",
    moduleName: "Mantenimiento preventivo",
    color: "#16a34a",
    date: "04/09/2026",
    goal: "Aplicas las técnicas de mantenimiento preventivo a las unidades de almacenamiento (HDD/SSD) para conservar su rendimiento y prevenir la pérdida de datos.",
    product: "Ficha de mantenimiento preventivo de unidades de almacenamiento",
    review: [
      {
        icon: "💽", t: "HDD vs. SSD",
        d: "Los dos tipos de disco requieren mantenimiento, pero NO las mismas técnicas:",
        points: [
          "HDD: disco mecánico con partes móviles; se desfragmenta.",
          "SSD: sin partes móviles, más rápido; NUNCA se desfragmenta."
        ],
        img: '<svg viewBox="0 0 460 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HDD mecánico versus SSD"><rect x="10" y="14" width="200" height="110" rx="12" fill="#e2e8f0" stroke="#64748b" stroke-width="2.5"/><circle cx="110" cy="70" r="34" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><circle cx="110" cy="70" r="10" fill="#f8fafc"/><line x1="110" y1="70" x2="138" y2="58" stroke="#f8fafc" stroke-width="2.5"/><text x="110" y="126" text-anchor="middle" font-size="12" fill="#334155" font-weight="bold">HDD (mecánico)</text><rect x="250" y="14" width="200" height="110" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/><rect x="282" y="46" width="136" height="30" rx="4" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/><rect x="282" y="84" width="136" height="12" rx="3" fill="#bbf7d0" stroke="#16a34a" stroke-width="1"/><text x="350" y="66" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold">CHIP SSD</text><text x="350" y="126" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">SSD (sin partes móviles)</text></svg>'
      },
      { icon: "🧹", t: "Limpieza de archivos", d: "Eliminar archivos temporales e innecesarios libera espacio y mejora el rendimiento.", points: ["Limpieza de disco de Windows o CCleaner.", "Vaciado de la papelera y de descargas antiguas."] },
      { icon: "🩺", t: "Revisión SMART", d: "La tecnología SMART anticipa fallas del disco leyendo sus indicadores internos (temperatura, sectores reasignados, horas de uso).", points: ["Herramientas: CrystalDiskInfo, HD Tune.", "Si el estado es «Precaución»: respaldar y planificar el reemplazo."] },
      { icon: "🧩", t: "Desfragmentación (SOLO HDD)", d: "Reordena los archivos fragmentados para acelerar el acceso.", points: ["Aplicar solo en discos HDD.", "En SSD es innecesaria y DESGASTA el disco."] },
      { icon: "🔍", t: "Verificación de errores (chkdsk)", d: "chkdsk revisa y corrige errores del sistema de archivos.", points: ["Se ejecuta desde el Símbolo del sistema o las propiedades del disco.", "Detecta sectores defectuosos y referencias rotas."] },
      { icon: "⚠️", t: "Errores comunes", points: ["Desfragmentar un SSD: reduce su vida útil.", "Ignorar una alerta SMART de «Precaución».", "Llenar el disco al 100%: el sistema se vuelve lento."] }
    ],
    tip: "Regla de oro: el HDD se desfragmenta, el SSD jamás. Ante una alerta SMART, respalda y planifica el reemplazo.",
    questions: [
      { type: "mc", img: '<svg viewBox="0 0 460 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HDD mecánico versus SSD"><rect x="10" y="14" width="200" height="110" rx="12" fill="#e2e8f0" stroke="#64748b" stroke-width="2.5"/><circle cx="110" cy="70" r="34" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/><circle cx="110" cy="70" r="10" fill="#f8fafc"/><text x="110" y="126" text-anchor="middle" font-size="12" fill="#334155" font-weight="bold">HDD (mecánico)</text><rect x="250" y="14" width="200" height="110" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/><rect x="282" y="46" width="136" height="30" rx="4" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/><text x="350" y="66" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold">CHIP SSD</text><text x="350" y="126" text-anchor="middle" font-size="12" fill="#14532d" font-weight="700">SSD</text></svg>', q: "Observa la imagen. ¿Cuál de los dos discos NO debe desfragmentarse?", opts: ["El HDD (izquierda)", "El SSD (derecha)", "Ambos", "Ninguno"], a: 1, fb: "El SSD no tiene partes móviles: la desfragmentación es innecesaria y desgasta sus celdas de memoria." },
      { type: "mc", q: "¿Qué técnica anticipa las fallas de un disco duro?", opts: ["La revisión del estado SMART", "La desfragmentación", "El vaciado de la papelera", "El cambio de pasta térmica"], a: 0, fb: "SMART lee los indicadores internos del disco (sectores reasignados, temperatura, horas de uso) y anticipa fallas." },
      { type: "tf", q: "La desfragmentación alarga la vida útil del SSD.", a: false, fb: "Al contrario: desfragmentar un SSD es innecesario y DESGASTA sus celdas. Solo se desfragmentan los HDD." },
      { type: "match", q: "Relaciona cada técnica con su propósito:", pairs: [["Limpieza de temporales", "Liberar espacio en el disco"], ["Revisión SMART", "Anticipar fallas del disco"], ["Desfragmentación", "Ordenar datos en un HDD"], ["chkdsk", "Verificar errores del sistema de archivos"]], fb: "Cada técnica tiene su propósito: liberar, anticipar, ordenar y verificar." },
      { type: "order", q: "Ordena la rutina de mantenimiento preventivo del almacenamiento:", items: ["Liberar espacio con limpieza de temporales", "Revisar el estado SMART", "Desfragmentar (solo si es HDD)", "Verificar errores con chkdsk", "Registrar los resultados en la ficha"], fb: "Primero espacio, luego salud del disco, orden (solo HDD), verificación y registro en la ficha." },
      { type: "mc", q: "CrystalDiskInfo muestra el disco en estado «Precaución». ¿Qué debes hacer?", opts: ["Respaldar la información y planificar el reemplazo del disco", "Desfragmentar el disco", "Ignorar la alerta y continuar", "Formatear el disco"], a: 0, fb: "Una alerta SMART es seria: respalda de inmediato y planifica el reemplazo antes de que la falla cause pérdida de datos." },
      { type: "fill", q: "chkdsk verifica y corrige errores del sistema de ______ del disco.", answers: ["archivos", "ficheros"], fb: "chkdsk revisa el sistema de archivos: referencias rotas y sectores defectuosos." },
      { type: "tf", q: "Un disco lleno al 100% hace que el sistema se vuelva lento.", a: true, fb: "Sin espacio libre el sistema no puede trabajar con comodidad: mantener al menos 15% libre es una buena práctica." }
    ]
  },
  {
    id: 5,
    num: "05",
    title: "Mantenimiento preventivo de procesamiento, memorias y placa madre",
    emoji: "🧠",
    module: "B",
    moduleName: "Mantenimiento preventivo",
    color: "#16a34a",
    date: "07/09/2026",
    goal: "Ejecutas el mantenimiento preventivo del procesador, las memorias y la placa madre (limpieza y revisión).",
    product: "Ficha de mantenimiento preventivo de procesamiento, memorias y placa madre",
    review: [
      { icon: "🌡️", t: "¿Por qué es clave?", d: "El procesador, las memorias y la placa madre acumulan polvo que obstruye la ventilación y provoca SOBRECALENTAMIENTO.", points: ["El sobrecalentamiento reduce el rendimiento y acorta la vida útil.", "El polvo es el enemigo número uno de los componentes internos."] },
      { icon: "💨", t: "Aire comprimido", d: "La herramienta principal de limpieza interna:", points: ["Se usa en CPU, placa madre, ventiladores y fuente.", "Soplar en ráfagas cortas, sin tocar los componentes."] },
      { icon: "🧴", t: "Alcohol isopropílico", d: "Se usa para limpiar los contactos dorados de la memoria RAM.", points: ["NUNCA usar alcohol común ni agua.", "Secar bien antes de reinstalar los módulos."] },
      {
        icon: "🎯", t: "Pasta térmica",
        d: "Se aplica entre el procesador y el disipador para transferir el calor.",
        points: [
          "Se renueva cuando está seca o endurecida, o al retirar el disipador.",
          "Se aplica una cantidad pequeña (un grano de arroz), no en exceso."
        ],
        img: '<svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Procesador y disipador con pasta térmica"><rect x="130" y="20" width="160" height="34" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="2"/><text x="210" y="42" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">DISIPADOR</text><rect x="145" y="54" width="130" height="10" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><text x="210" y="62" text-anchor="middle" font-size="7.5" fill="#78350f" font-weight="bold">PASTA TÉRMICA</text><rect x="150" y="64" width="120" height="30" rx="4" fill="#334155" stroke="#0f172a" stroke-width="2"/><text x="210" y="84" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">PROCESADOR (CPU)</text><rect x="120" y="94" width="180" height="46" rx="6" fill="#166534" stroke="#14532d" stroke-width="2"/><text x="210" y="121" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">PLACA MADRE</text><text x="60" y="152" font-size="10" fill="#475569">El orden correcto: disipador → pasta → CPU</text></svg>'
      },
      { icon: "👀", t: "Revisión visual", d: "Inspeccionar la placa madre en busca de:", points: ["Capacitores inflados o con fugas.", "Conectores flojos o con óxido.", "Ventiladores que no giran."] },
      { icon: "⚠️", t: "Errores comunes", points: ["Soplar el polvo con la boca (la humedad daña los circuitos).", "Usar alcohol común en los contactos.", "Aplicar exceso de pasta térmica.", "Manipular componentes con el equipo conectado a la corriente."] }
    ],
    tip: "Antes de tocar cualquier componente: desconecta la energía y descarga la estática de tu cuerpo tocando el chasis metálico.",
    questions: [
      { type: "mc", img: '<svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Procesador y disipador con pasta térmica"><rect x="130" y="20" width="160" height="34" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="2"/><text x="210" y="42" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">DISIPADOR</text><rect x="145" y="54" width="130" height="10" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/><text x="210" y="62" text-anchor="middle" font-size="7.5" fill="#78350f" font-weight="bold">PASTA TÉRMICA</text><rect x="150" y="64" width="120" height="30" rx="4" fill="#334155" stroke="#0f172a" stroke-width="2"/><text x="210" y="84" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">PROCESADOR (CPU)</text><rect x="120" y="94" width="180" height="46" rx="6" fill="#166534" stroke="#14532d" stroke-width="2"/><text x="210" y="121" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">PLACA MADRE</text></svg>', q: "Según la imagen, ¿dónde se aplica la pasta térmica?", opts: ["Entre el procesador y el disipador", "Sobre la placa madre", "Dentro del disco duro", "En los conectores de la fuente"], a: 0, fb: "La pasta térmica va entre el CPU y el disipador: mejora la transferencia de calor entre ambos." },
      { type: "mc", q: "¿Qué se usa para limpiar los contactos dorados de la memoria RAM?", opts: ["Alcohol isopropílico", "Agua con jabón", "Alcohol común", "Limpiador de vidrios"], a: 0, fb: "El alcohol isopropílico limpia sin dejar residuos ni humedad. El alcohol común y el agua dañan los contactos." },
      { type: "tf", q: "El polvo acumulado en los componentes puede provocar sobrecalentamiento.", a: true, fb: "El polvo obstruye la ventilación y actúa como aislante térmico: el calor no sale y el equipo se sobrecalienta." },
      { type: "match", q: "Relaciona cada componente con su acción de mantenimiento:", pairs: [["Procesador (CPU)", "Renovar la pasta térmica"], ["Memoria RAM", "Limpiar contactos con alcohol isopropílico"], ["Placa madre", "Limpiar con aire comprimido"], ["Capacitores", "Revisión visual (inflados o con fugas)"]], fb: "Cada componente tiene su técnica: pasta para el CPU, alcohol para la RAM, aire para la placa y vista para los capacitores." },
      { type: "order", q: "Ordena el procedimiento de mantenimiento interno:", items: ["Desconectar la energía del equipo", "Abrir el gabinete", "Limpiar el polvo con aire comprimido", "Renovar la pasta térmica del CPU", "Cerrar el gabinete y probar el equipo"], fb: "Primero seguridad (energía y estática), luego limpieza, pasta térmica y al final la prueba." },
      { type: "mc", q: "¿Cuándo se debe renovar la pasta térmica del procesador?", opts: ["Cuando está seca o endurecida, o al retirar el disipador", "Cada vez que se enciende el equipo", "Nunca", "Solo cuando se cambia el monitor"], a: 0, fb: "La pasta se seca con el tiempo y pierde eficiencia: se renueva al retirar el disipador o cuando se nota seca." },
      { type: "tf", q: "Se puede soplar el polvo del interior del equipo con la boca.", a: false, fb: "La humedad de la boca puede dañar los circuitos: usa siempre aire comprimido en ráfagas cortas." },
      { type: "fill", q: "La pasta térmica se aplica entre el procesador y el ______.", answers: ["disipador", "disipador de calor", "ventilador del cpu"], fb: "El disipador (con su ventilador) recibe el calor del CPU a través de la pasta térmica." }
    ]
  },
  {
    id: 6,
    num: "06",
    title: "Mantenimiento preventivo de tarjetas gráficas, SO y aplicaciones",
    emoji: "🎮",
    module: "B",
    moduleName: "Mantenimiento preventivo",
    color: "#16a34a",
    date: "08/09/2026",
    goal: "Realizas el mantenimiento preventivo de la tarjeta gráfica, del sistema operativo y de las aplicaciones.",
    product: "Ficha de mantenimiento preventivo de tarjetas gráficas y software",
    review: [
      { icon: "🎮", t: "Tarjeta gráfica (GPU)", d: "Igual que el CPU, la GPU se calienta y acumula polvo:", points: ["Limpieza del ventilador y del disipador con aire comprimido.", "Revisar que el ventilador gire sin ruidos extraños."] },
      { icon: "🔌", t: "Drivers", d: "Los drivers (controladores) son programas que permiten al sistema operativo comunicarse con el hardware.", points: ["Actualizarlos corrige errores y mejora el rendimiento.", "Se descargan del sitio del fabricante (NVIDIA, AMD, Intel)."] },
      { icon: "🪟", t: "Actualizaciones del SO", d: "Actualizar el sistema operativo NO es opcional:", points: ["Corrige fallas de seguridad (vulnerabilidades).", "Añade mejoras de rendimiento y compatibilidad."] },
      { icon: "📦", t: "Aplicaciones", d: "Mantener el parque de aplicaciones en orden:", points: ["Actualizar las aplicaciones instaladas.", "Desinstalar las que no se usan (liberan espacio y recursos)."] },
      { icon: "🏫", t: "Ejemplo aplicado al CPD", d: "En un aula con 12 PCs, el mantenimiento de software se organiza así:", points: ["Primera semana del mes: actualizar el SO de todas las PCs.", "Actualizar drivers de video solo si hay fallas gráficas.", "Desinstalar juegos o programas ajenos a la clase."] },
      { icon: "⚠️", t: "Errores comunes", points: ["No actualizar por «miedo a que algo se dañe».", "Instalar drivers genéricos en lugar de los del fabricante.", "Acumular programas que nadie usa."] }
    ],
    tip: "Un software desactualizado es una puerta abierta a fallas y virus: actualizar es mantenimiento preventivo, no un capricho.",
    questions: [
      { type: "mc", q: "¿Por qué es importante actualizar el sistema operativo?", opts: ["Corrige fallas de seguridad y mejora el rendimiento", "Cambia el color de la pantalla", "Aumenta el tamaño del disco", "Borra los archivos del usuario"], a: 0, fb: "Las actualizaciones cierran vulnerabilidades de seguridad y traen mejoras de rendimiento y compatibilidad." },
      { type: "mc", q: "¿Qué parte de la tarjeta gráfica acumula más polvo y debe limpiarse?", opts: ["El ventilador y el disipador", "Los contactos dorados", "El conector HDMI", "La memoria de video"], a: 0, fb: "El ventilador aspira aire con polvo que se deposita en las aspas y en el disipador, reduciendo el enfriamiento." },
      { type: "tf", q: "Un software desactualizado puede causar fallas y riesgos de seguridad.", a: true, fb: "Correcto: sin actualizaciones quedan vulnerabilidades abiertas y fallas sin corregir." },
      { type: "match", q: "Relaciona cada tarea con el componente que le corresponde:", pairs: [["Actualizar drivers", "Tarjeta gráfica (GPU)"], ["Instalar actualizaciones de seguridad", "Sistema operativo"], ["Limpiar el ventilador", "Tarjeta gráfica"], ["Desinstalar programas sin uso", "Aplicaciones"]], fb: "Drivers para la GPU, actualizaciones para el SO, aire para el ventilador y desinstalación para las aplicaciones." },
      { type: "order", q: "Ordena la rutina de mantenimiento de tarjeta y software:", items: ["Limpiar el ventilador de la GPU", "Actualizar los drivers de video", "Actualizar el sistema operativo", "Actualizar las aplicaciones", "Desinstalar lo innecesario"], fb: "Primero lo físico (GPU), luego lo lógico: drivers, SO, aplicaciones y limpieza final." },
      { type: "mc", q: "¿Qué son los drivers?", opts: ["Programas que permiten al SO comunicarse con el hardware", "Virus disfrazados de utilidades", "Actualizaciones del antivirus", "Cables de conexión del monitor"], a: 0, fb: "Los drivers (controladores) traducen las órdenes del sistema operativo al hardware específico." },
      { type: "fill", q: "Los ______ son programas que permiten al sistema operativo comunicarse con el hardware.", answers: ["drivers", "controladores", "driver"], fb: "Driver = controlador: sin ellos, el SO no puede usar la tarjeta gráfica, la impresora u otros dispositivos." }
    ]
  },
  {
    id: 7,
    num: "07",
    title: "Utilitarios para mantenimiento preventivo y correctivo",
    emoji: "🧰",
    module: "B",
    moduleName: "Mantenimiento preventivo",
    color: "#16a34a",
    date: "09/09/2026",
    goal: "Utilizas utilitarios de mantenimiento preventivo y correctivo: limpieza, desfragmentación, antivirus y diagnóstico.",
    product: "Informe de uso de utilitarios de mantenimiento",
    review: [
      { icon: "🧰", t: "¿Qué son los utilitarios?", d: "Son programas que facilitan las tareas de mantenimiento del equipo. Se agrupan en cuatro categorías: limpieza, desfragmentación, seguridad y diagnóstico." },
      { icon: "🧹", t: "Utilitarios de limpieza", d: "Eliminan archivos temporales e innecesarios.", points: ["CCleaner, Liberador de espacio en disco de Windows.", "Liberan espacio y agilizan el sistema."] },
      { icon: "🧩", t: "Utilitarios de desfragmentación", d: "Reordenan los datos en discos HDD.", points: ["Defraggler, Desfragmentador de Windows.", "Recordar: NUNCA en SSD."] },
      { icon: "🛡️", t: "Utilitarios de seguridad", d: "Protegen contra software malicioso:", points: ["Antivirus (protección en tiempo real).", "Antimalware (escaneos profundos contra adware, spyware)."] },
      { icon: "🩺", t: "Utilitarios de diagnóstico", d: "Monitorean el estado del hardware:", points: ["CrystalDiskInfo: salud de discos (SMART).", "HWMonitor: temperaturas y voltajes."] },
      { icon: "⚠️", t: "Errores comunes", points: ["Descargar utilitarios de sitios no oficiales (pueden traer virus).", "Instalar dos antivirus a la vez: entran en conflicto.", "«Limpiar» el registro sin saber qué se borra."] }
    ],
    tip: "Descarga utilitarios SOLO de sitios oficiales: un «limpiador» falso puede ser un virus disfrazado.",
    questions: [
      { type: "match", q: "Relaciona cada utilitario con su categoría:", pairs: [["CCleaner", "Limpieza"], ["Defraggler", "Desfragmentación"], ["Antivirus", "Seguridad"], ["CrystalDiskInfo", "Diagnóstico"]], fb: "CCleaner limpia, Defraggler desfragmenta, el antivirus protege y CrystalDiskInfo diagnostica discos." },
      { type: "mc", q: "¿Para qué sirve HWMonitor?", opts: ["Monitorear temperaturas y voltajes del hardware", "Eliminar virus", "Desfragmentar el disco", "Editar documentos"], a: 0, fb: "HWMonitor es un utilitario de diagnóstico: muestra en tiempo real las temperaturas y voltajes de los componentes." },
      { type: "tf", q: "Todos los utilitarios descargados de internet son seguros de usar.", a: false, fb: "Falso: solo son confiables los descargados de sitios oficiales. Muchos «limpiadores» son malware disfrazado." },
      { type: "mc", q: "¿Qué hace el Liberador de espacio en disco de Windows?", opts: ["Elimina archivos temporales e innecesarios", "Instala el sistema operativo", "Actualiza los drivers", "Crea particiones"], a: 0, fb: "El Liberador de espacio elimina temporales, papelera y archivos del sistema que ya no se necesitan." },
      { type: "mc", q: "CrystalDiskInfo muestra la salud de los discos usando…", opts: ["Los datos SMART del disco", "El antivirus", "El registro de Windows", "La tarjeta gráfica"], a: 0, fb: "CrystalDiskInfo lee los indicadores SMART del disco para anticipar fallas." },
      { type: "order", q: "Ordena la rutina con utilitarios:", items: ["Analizar el estado del equipo", "Limpiar archivos temporales", "Desfragmentar (solo si es HDD)", "Escanear con antivirus y antimalware", "Diagnosticar discos y temperaturas"], fb: "Primero analizar, luego limpiar, desfragmentar (HDD), proteger y al final diagnosticar el hardware." },
      { type: "tf", q: "Instalar dos antivirus a la vez protege el doble.", a: false, fb: "Dos antivirus entran en conflicto y vuelven lento el sistema: usa uno solo y mantenlo actualizado." },
      { type: "fill", q: "CCleaner es un utilitario de ______ del sistema.", answers: ["limpieza", "limpieza de archivos"], fb: "CCleaner limpia temporales y archivos innecesarios para liberar espacio." }
    ]
  },
  {
    id: 8,
    num: "08",
    title: "Mantenimiento correctivo de BIOS y CMOS",
    emoji: "🔧",
    module: "C",
    moduleName: "Mantenimiento correctivo",
    color: "#d97706",
    date: "10/09/2026",
    goal: "Ingresas a la BIOS/CMOS y configuras el arranque del equipo como parte del mantenimiento correctivo.",
    product: "Ficha de configuración de BIOS/CMOS",
    review: [
      { icon: "🔧", t: "¿Qué es la BIOS?", d: "La BIOS (o UEFI) es el firmware que inicializa el hardware y arranca el sistema operativo.", points: ["Se ejecuta antes que el sistema operativo.", "UEFI es la versión moderna de la BIOS."] },
      { icon: "🔋", t: "¿Qué es el CMOS?", d: "El CMOS es la memoria que guarda la configuración de la BIOS con ayuda de una pila.", points: ["Si se pierden la fecha y la hora al apagar: la pila está agotada.", "Reemplazar la pila restablece la retención de la configuración."] },
      { icon: "⌨️", t: "Cómo ingresar", d: "Durante el encendido se presiona la tecla de acceso, que varía según el fabricante:", points: ["F2, Supr, F10 o Esc son las más comunes.", "La tecla aparece indicada en la primera pantalla del arranque."] },
      { icon: "🥾", t: "Orden de arranque (boot)", d: "Define desde qué dispositivo arranca el equipo (disco, USB, DVD).", points: ["Útil cuando el equipo no arranca desde el disco correcto.", "Se configura en el menú Boot de la BIOS."] },
      { icon: "♻️", t: "Restablecer configuración de fábrica", d: "Si la configuración quedó corrupta, se restaura los valores por defecto:", points: ["Opción «Load Setup Defaults» o «Restore Defaults».", "Luego se guarda con F10 (Save & Exit)."] },
      { icon: "⚠️", t: "Errores comunes", points: ["Cambiar opciones sin saber para qué sirven.", "Olvidar guardar los cambios (F10).", "Tocar la pila del CMOS sin necesidad."] }
    ],
    tip: "Síntoma clave: si el equipo pierde la fecha y la hora cada vez que se apaga, la pila del CMOS está agotada: reemplázala.",
    questions: [
      { type: "mc", q: "¿Qué es la BIOS?", opts: ["El firmware que inicializa el hardware y arranca el sistema operativo", "Un programa de ofimática", "El disco duro del equipo", "El antivirus del sistema"], a: 0, fb: "La BIOS/UEFI es el primer programa que se ejecuta: inicializa el hardware y entrega el control al sistema operativo." },
      { type: "mc", q: "¿Con qué teclas se suele ingresar a la BIOS?", opts: ["F2, Supr, F10 o Esc según el equipo", "Ctrl + Alt + Supr", "Windows + R", "F1 + F12 juntas"], a: 0, fb: "La tecla varía según el fabricante (F2, Supr, F10, Esc) y se indica en la primera pantalla del arranque." },
      { type: "tf", q: "El CMOS guarda la configuración de la BIOS con ayuda de una pila.", a: true, fb: "Correcto: la pila del CMOS mantiene la configuración cuando el equipo está apagado." },
      { type: "mc", img: '<svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pantalla de la BIOS"><rect x="10" y="10" width="440" height="150" rx="8" fill="#0f172a"/><text x="230" y="38" text-anchor="middle" font-size="14" fill="#60a5fa" font-weight="bold">BIOS SETUP UTILITY</text><line x1="20" y1="46" x2="440" y2="46" stroke="#334155" stroke-width="2"/><text x="30" y="70" font-size="12" fill="#94a3b8">Main    Advanced    Boot    Exit</text><line x1="20" y1="78" x2="440" y2="78" stroke="#334155" stroke-width="1.5"/><rect x="30" y="88" width="90" height="20" rx="3" fill="#fef08a"/><text x="75" y="102" text-anchor="middle" font-size="11" fill="#713f12" font-weight="bold">Boot</text><text x="140" y="102" font-size="11.5" fill="#e2e8f0">Boot Device Priority</text><text x="30" y="126" font-size="11" fill="#e2e8f0">1st: HDD · 2nd: USB · 3rd: DVD</text><text x="30" y="148" font-size="10" fill="#64748b">F10: Save &amp; Exit</text></svg>', q: "En la pantalla de la BIOS de la imagen, ¿en qué menú se configura el orden de arranque?", opts: ["Boot", "Main", "Advanced", "Exit"], a: 0, fb: "El menú Boot (arranque) define el orden de los dispositivos: HDD, USB, DVD." },
      { type: "match", q: "Relaciona cada problema con su solución:", pairs: [["El equipo no arranca desde el disco correcto", "Configurar el orden de arranque (Boot)"], ["La configuración quedó corrupta", "Restablecer la configuración de fábrica"], ["Se pierde la fecha y hora al apagar", "Reemplazar la pila del CMOS"]], fb: "Arranque → Boot; configuración corrupta → defaults; fecha y hora → pila del CMOS." },
      { type: "order", q: "Ordena el procedimiento para configurar el arranque:", items: ["Apagar el equipo", "Encender y presionar la tecla de acceso", "Ingresar al menú Boot", "Configurar el orden de arranque", "Guardar y salir (F10)"], fb: "Apagar, encender con la tecla, entrar a Boot, configurar el orden y guardar con F10." },
      { type: "fill", q: "Si el equipo pierde la fecha y la hora al apagarse, se debe reemplazar la pila del ______.", answers: ["cmos", "CMOS"], fb: "La pila del CMOS mantiene la configuración con el equipo apagado; agotada, todo se pierde." },
      { type: "tf", q: "Se debe cambiar cualquier opción de la BIOS aunque no se sepa para qué sirve.", a: false, fb: "Cambiar opciones sin conocimiento puede impedir que el equipo arranque: solo toca lo que entiendas." }
    ]
  }
];
