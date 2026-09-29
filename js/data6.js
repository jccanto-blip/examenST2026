/* ============================================================
   DATOS — Contenidos por nivel de evaluación
   intermedio y avanzado (el básico vive en data1-3).
   Cada nivel añade tarjetas de repaso + preguntas más exigentes.
   ============================================================ */

var LEVELS_DATA = {
  "1": {
    intermedio: {
      review: [
        { icon: "🧮", t: "Matriz de criticidad", d: "Para establecer prioridades de forma objetiva se cruzan dos factores:", points: ["Probabilidad de falla del equipo (baja, media, alta).", "Impacto en el servicio si falla (leve, moderado, grave).", "Crítico = alta probabilidad × grave impacto: se atiende primero."] },
        { icon: "🔁", t: "RCM (Mantenimiento Centrado en Confiabilidad)", d: "Metodología que define QUÉ mantenimiento aplicar a cada equipo según su función y criticidad, en lugar de aplicar lo mismo a todos." },
        { icon: "📐", t: "KPIs del plan", d: "Indicadores profesionales del mantenimiento:", points: ["MTBF: tiempo medio entre fallas (mientras más alto, mejor).", "MTTR: tiempo medio de reparación (mientras más bajo, mejor).", "Disponibilidad = MTBF ÷ (MTBF + MTTR)."] }
      ],
      questions: [
        { type: "mc", time: 50, q: "Un equipo con ALTA probabilidad de falla y GRAVE impacto en el servicio se clasifica como…", opts: ["Crítico: máxima prioridad de mantenimiento", "Secundario: se atiende al final", "Sin mantenimiento", "Solo mantenimiento correctivo"], a: 0, fb: "La matriz de criticidad cruza probabilidad × impacto: alta + grave = crítico, máxima prioridad." },
        { type: "tf", time: 35, q: "MTBF es el tiempo medio entre fallas: mientras más alto, más confiable es el equipo.", a: true, fb: "Correcto: MTBF alto significa que el equipo falla con poca frecuencia." }
      ]
    },
    avanzado: {
      review: [
        { icon: "📜", t: "ISO 55000 — Gestión de activos", d: "Norma internacional que establece buenas prácticas para gestionar el ciclo de vida de los equipos, alineando el mantenimiento con los objetivos del negocio." },
        { icon: "🗺️", t: "Plan maestro vs. plan de rutina", d: "En organizaciones grandes se separan dos niveles de planificación:", points: ["Plan maestro: visión anual (objetivos, presupuesto, grandes paradas).", "Plan de rutina: actividades semanales/mensuales que ejecutan al plan maestro."] },
        { icon: "🔎", t: "Auditoría del plan", d: "Revisión periódica con lista de verificación:", points: ["¿Se cumplió el cronograma? ¿Se usaron los recursos previstos?", "¿Los indicadores (MTBF, disponibilidad) mejoraron?", "Resultado: ajustes al plan para el siguiente ciclo."] }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué norma internacional orienta la gestión del ciclo de vida de los activos (equipos)?", opts: ["ISO 55000", "ISO 9001", "IEEE 802.11", "ANSI/TIA-568"], a: 0, fb: "ISO 55000 es la norma de gestión de activos; ISO 9001 es calidad y TIA-568 es cableado estructurado." },
        { type: "fill", time: 40, q: "La auditoría del plan verifica el cumplimiento del cronograma y la mejora de los ______.", answers: ["indicadores", "kpis", "indicadores de mantenimiento"], fb: "La auditoría mide resultados con indicadores (MTBF, disponibilidad, fallas evitadas) y ajusta el plan." }
      ]
    }
  },
  "2": {
    intermedio: {
      review: [
        { icon: "🏷️", t: "Categorización ABC de activos", d: "Clasifica los equipos del inventario por su valor e importancia:", points: ["A: pocos equipos, alto valor/criticidad (servidores) — control estricto.", "B: valor medio (PCs de trabajo).", "C: muchos equipos, bajo valor (periféricos) — control simple."] },
        { icon: "🔁", t: "Ciclo de vida del activo", d: "Cada equipo pasa por etapas que el inventario debe reflejar:", points: ["Adquisición → operación → mantenimiento → retiro.", "El inventario registra en qué etapa está cada activo."] },
        { icon: "🗄️", t: "CMDB", d: "Base de Datos de Gestión de Configuración: inventario dinámico con relaciones entre activos (qué equipo depende de cuál), usado en organizaciones formales." }
      ],
      questions: [
        { type: "mc", time: 50, q: "En la categorización ABC, los servidores del centro de cómputo se clasifican como…", opts: ["Categoría A: control estricto", "Categoría C: control simple", "Sin categoría", "Categoría B"], a: 0, fb: "Los servidores son pocos, de alto valor y criticidad: categoría A, con control estricto." },
        { type: "tf", time: 35, q: "Una CMDB registra los activos y las relaciones entre ellos (dependencias).", a: true, fb: "La CMDB va más allá del inventario simple: modela dependencias entre equipos y servicios." }
      ]
    },
    avanzado: {
      review: [
        { icon: "📱", t: "Etiquetado patrimonial y QR", d: "Cada activo lleva código de barras/QR vinculado al inventario digital:", points: ["Escaneo rápido para consultar historial y estado.", "Reduce errores de registro manual."] },
        { icon: "🔎", t: "Auditoría física periódica", d: "Conteo físico contra el inventario cada trimestre/semestre para detectar equipos faltantes, movidos o sin registro." },
        { icon: "📊", t: "Exactitud del inventario", d: "Indicador: (activos encontrados ÷ activos registrados) × 100. Un inventario profesional mantiene ≥ 98% de exactitud." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Para qué sirve la auditoría física del inventario?", opts: ["Verificar que los equipos físicos coinciden con el registro", "Instalar antivirus", "Aumentar la velocidad del disco", "Cambiar las contraseñas"], a: 0, fb: "La auditoría física contrasta lo registrado con lo real: detecta faltantes y registros desactualizados." },
        { type: "fill", time: 40, q: "Un inventario profesional mantiene una exactitud de al menos ______ por ciento.", answers: ["98", "98%", "noventa y ocho"], fb: "La meta usual es ≥ 98% de exactitud entre el conteo físico y el registro." }
      ]
    }
  },
  "3": {
    intermedio: {
      review: [
        { icon: "📊", t: "Diagrama de Gantt", d: "Representación gráfica del cronograma: barras por actividad con fechas de inicio y fin, que permiten ver solapamientos y avances de un vistazo." },
        { icon: "🛤️", t: "Ruta crítica", d: "La cadena de actividades que determina la duración total del plan: si una de ellas se retrasa, TODO el plan se retrasa. Es donde se concentra la supervisión." },
        { icon: "🎲", t: "Gestión de riesgos en la ejecución", d: "Identificar qué puede salir mal (falta de repuestos, personal ausente) y prever respuestas antes de que ocurra." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué herramienta gráfica representa las actividades del plan con barras y fechas?", opts: ["Diagrama de Gantt", "Organigrama", "Mapa mental", "Diagrama de flujo de datos"], a: 0, fb: "El diagrama de Gantt muestra cada actividad como una barra con su inicio y fin." },
        { type: "tf", time: 35, q: "Si una actividad de la ruta crítica se retrasa, todo el plan se retrasa.", a: true, fb: "La ruta crítica define la duración total: cualquier retraso en ella retrasa el proyecto." }
      ]
    },
    avanzado: {
      review: [
        { icon: "📋", t: "POE (Procedimiento Operativo Estándar)", d: "Documento con los pasos exactos de cada tarea de mantenimiento:", points: ["Quién, con qué herramienta y cuánto tiempo.", "Garantiza que todos ejecuten la tarea de la misma forma."] },
        { icon: "📦", t: "Órdenes de trabajo", d: "Sistema formal de trabajo: cada mantenimiento genera una orden (asignada, ejecutada, cerrada), dejando evidencia y permitiendo el control del docente/jefe." },
        { icon: "🔄", t: "Mejora continua (ciclo PDCA)", d: "Planificar → Hacer (ejecutar) → Verificar (medir) → Actuar (ajustar). El plan de mantenimiento se revisa cada ciclo con los resultados obtenidos." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué documento define los pasos exactos de una tarea de mantenimiento para que todos la ejecuten igual?", opts: ["POE (Procedimiento Operativo Estándar)", "La factura de compra", "El manual del mouse", "La hoja de vida del usuario"], a: 0, fb: "El POE estandariza la tarea: pasos, herramientas, responsables y tiempos." },
        { type: "mc", time: 50, q: "El ciclo de mejora continua PDCA significa…", opts: ["Planificar, Hacer, Verificar y Actuar", "Probar, Desconectar, Conectar y Apagar", "Prevenir, Detectar, Corregir y Avisar", "Programar, Descargar, Copiar y Archivar"], a: 0, fb: "PDCA: planificar, ejecutar, medir y ajustar — el plan mejora en cada ciclo." }
      ]
    }
  },
  "4": {
    intermedio: {
      review: [
        { icon: "⌛", t: "TBW (ciclos de escritura)", d: "Los SSD tienen una cantidad finita de escrituras (TBW: terabytes escritos). El monitoreo del TBW consumido anticipa el fin de la vida útil del disco." },
        { icon: "🧩", t: "Over-provisioning", d: "Espacio reservado del SSD no visible para el usuario, que el disco usa para repartir el desgaste y mantener el rendimiento con el disco lleno." },
        { icon: "🩺", t: "Atributos SMART avanzados", d: "Más allá del estado general, interesa vigilar atributos específicos:", points: ["05: sectores reasignados (aumento = desgaste).", "C5: sectores pendientes de reasignación.", "Temperatura por encima del rango del fabricante."] }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué indica el TBW consumido de un SSD?", opts: ["El desgaste acumulado de sus celdas de escritura", "La velocidad del procesador", "El espacio libre del disco", "El número de programas instalados"], a: 0, fb: "TBW mide los terabytes escritos: acercarse al límite del fabricante indica fin de vida útil." },
        { type: "tf", time: 35, q: "El over-provisioning reserva espacio oculto del SSD para repartir el desgaste y mantener el rendimiento.", a: true, fb: "Correcto: esa reserva ayuda a la durabilidad y al rendimiento sostenido del SSD." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🛡️", t: "RAID para redundancia", d: "Combinación de discos para proteger la información:", points: ["RAID 1 (espejo): duplica los datos en dos discos.", "RAID 5: reparte datos y paridad entre 3+ discos; tolera la falla de uno."] },
        { icon: "📈", t: "Monitoreo predictivo", d: "Revisión periódica de tendencias SMART (sectores reasignados en aumento, temperatura) para reemplazar el disco ANTES de que falle." },
        { icon: "📅", t: "Plan de reemplazo por vida útil", d: "Los discos se reemplazan por política (ej.: cada 4-5 años o al 80% del TBW), evitando trabajar con discos al límite." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué configuración RAID duplica los datos en dos discos?", opts: ["RAID 1", "RAID 0", "JBOD", "RAID 6"], a: 0, fb: "RAID 1 es el espejo: los datos se duplican y se tolera la falla de un disco." },
        { type: "tf", time: 35, q: "El monitoreo predictivo busca reemplazar el disco ANTES de que falle, observando tendencias de los atributos SMART.", a: true, fb: "Esa es la idea: anticiparse a la falla con las tendencias de los atributos." }
      ]
    }
  },
  "5": {
    intermedio: {
      review: [
        { icon: "🌡️", t: "TjMax y temperaturas", d: "TjMax es la temperatura máxima del procesador antes de bajar su velocidad para protegerse. En mantenimiento se verifica que la temperatura en carga quede 15-20 °C por debajo del TjMax." },
        { icon: "💨", t: "Flujo de aire del gabinete", d: "Diseño térmico básico:", points: ["Presión positiva: más ventiladores de entrada que de salida (menos polvo).", "Los ventiladores frontales ingresan aire; los traseros/superiores lo expulsan."] },
        { icon: "🔋", t: "Undervolting", d: "Técnica intermedia: reducir el voltaje del CPU manteniendo la frecuencia, para bajar temperatura y consumo. Requiere pruebas de estabilidad después de cada ajuste." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué es el TjMax del procesador?", opts: ["La temperatura máxima antes de que el CPU se proteja bajando su velocidad", "La velocidad máxima del ventilador", "El voltaje máximo de la fuente", "La cantidad máxima de polvo permitida"], a: 0, fb: "TjMax es el límite térmico del CPU; la temperatura en carga debe quedar muy por debajo." },
        { type: "tf", time: 35, q: "La presión positiva del gabinete (más aire de entrada que de salida) ayuda a reducir el polvo interno.", a: true, fb: "Con presión positiva el aire sale por las rendijas, evitando que entre polvo por ellas." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🧤", t: "Estación antiestática (ESD)", d: "Entorno profesional de trabajo con hardware:", points: ["Pulsera antiestática conectada a tierra, tapete ESD.", "Herramientas aisladas y mesa con conexión a tierra."] },
        { icon: "⚡", t: "Mantenimiento de VRM", d: "Los módulos reguladores de voltaje (VRM) de la placa también requieren revisión: limpieza de sus disipadores y verificación de que no haya señales de quemadura." },
        { icon: "🔬", t: "Delid (nivel experto)", d: "Retirar el IHS (tapa metálica) del CPU para cambiar la pasta interna. SOLO para técnicos avanzados: un error daña el procesador de forma permanente." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué elementos componen una estación antiestática profesional?", opts: ["Pulsera conectada a tierra y tapete ESD", "Guantes de lana y mesa de madera", "Un ventilador grande", "Solo una linterna"], a: 0, fb: "La protección ESD profesional incluye pulsera a tierra, tapete y herramientas antiestáticas." },
        { type: "tf", time: 35, q: "El delid (retirar la tapa metálica del CPU) es una técnica que cualquier usuario puede intentar.", a: false, fb: "Falso: el delid es de nivel experto; un error destruye el procesador de forma permanente." }
      ]
    }
  },
  "6": {
    intermedio: {
      review: [
        { icon: "🌡️", t: "Thermal throttling de la GPU", d: "Cuando la tarjeta gráfica se sobrecalienta, reduce automáticamente su velocidad (throttling): bajones de FPS o lentitud en tareas gráficas son síntomas de mala refrigeración." },
        { icon: "🧹", t: "DDU (Display Driver Uninstaller)", d: "Herramienta que elimina COMPLETAMENTE los drivers de video (restos de versiones anteriores causan conflictos). Se usa antes de instalar drivers nuevos." },
        { icon: "📆", t: "Línea de tiempo de parches", d: "Política intermedia de actualización:", points: ["Parches de seguridad: aplicar de inmediato.", "Actualizaciones de funciones: esperar y probar antes de masificar."] }
      ],
      questions: [
        { type: "mc", time: 50, q: "La tarjeta gráfica baja su rendimiento de repente en tareas exigentes. El síntoma más probable es…", opts: ["Thermal throttling por sobrecalentamiento", "Poco espacio en disco", "El mouse está fallando", "Falta de papel en la impresora"], a: 0, fb: "El throttling reduce la velocidad de la GPU para protegerse del calor: toca limpiar y revisar ventilación." },
        { type: "tf", time: 35, q: "DDU se usa para eliminar por completo los drivers de video anteriores antes de instalar los nuevos.", a: true, fb: "Correcto: DDU limpia restos de drivers que causan conflictos de video." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🏭", t: "WSUS — actualizaciones centralizadas", d: "Servicio que centraliza las actualizaciones de Windows en una organización: se aprueban en el servidor y se despliegan a todos los equipos de forma controlada." },
        { icon: "🧪", t: "Staging (pruebas antes de producción)", d: "Ninguna actualización se masifica sin probarla: primero en un equipo piloto, se valida, y recién se aplica al resto del parque." },
        { icon: "🏷️", t: "Control de versiones de drivers", d: "Registro de qué versión de driver usa cada equipo y por qué, para retroceder (rollback) rápidamente si una versión causa fallas." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué herramienta permite centralizar y aprobar las actualizaciones de Windows en una organización?", opts: ["WSUS", "CCleaner", "Defraggler", "CrystalDiskInfo"], a: 0, fb: "WSUS centraliza las actualizaciones: el administrador las aprueba y controla su despliegue." },
        { type: "tf", time: 35, q: "El staging consiste en probar una actualización en un equipo piloto antes de aplicarla a todo el parque.", a: true, fb: "Exacto: primero se valida en piloto y luego se masifica, reduciendo el riesgo." }
      ]
    }
  },
  "7": {
    intermedio: {
      review: [
        { icon: "🛠️", t: "Sysinternals", d: "Suite profesional de Microsoft para diagnóstico avanzado:", points: ["Autoruns: qué se ejecuta al inicio (más completo que el Administrador de tareas).", "Process Explorer: detalle de procesos y qué recurso consume cada uno."] },
        { icon: "⌨️", t: "Comandos de reparación de Windows", d: "Herramientas de línea de comandos del mantenimiento correctivo:", points: ["sfc /scannow: verifica y repara archivos del sistema.", "DISM /Online /Cleanup-Image /RestoreHealth: repara la imagen del sistema."] },
        { icon: "📈", t: "HWiNFO", d: "Utilitario de monitoreo profundo: sensores de temperatura, voltajes y velocidades de todos los componentes, con registro de máximos." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué comando verifica y repara los archivos del sistema de Windows?", opts: ["sfc /scannow", "ipconfig /all", "tracert 8.8.8.8", "format C:"], a: 0, fb: "sfc /scannow revisa la integridad de los archivos del sistema y los repara." },
        { type: "tf", time: 35, q: "DISM puede reparar la imagen del sistema de Windows desde la línea de comandos.", a: true, fb: "DISM /RestoreHealth repara la imagen del sistema cuando sfc no es suficiente." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🤖", t: "Automatización con scripts", d: "Las tareas repetitivas de mantenimiento se automatizan:", points: ["PowerShell: limpiar temporales, revisar discos y generar informes con un solo script.", "Programar los scripts con el Programador de tareas."] },
        { icon: "📏", t: "Políticas de uso de utilitarios", d: "En un parque profesional se define QUÉ utilitarios están permitidos y quién puede usarlos, evitando herramientas no confiables en los equipos." },
        { icon: "📄", t: "Informe de salud mensual", d: "Cada mes se genera un informe del estado del parque: discos con alertas, temperaturas altas, actualizaciones pendientes — insumo para el plan de mantenimiento." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Con qué herramienta se pueden automatizar tareas repetitivas de mantenimiento en Windows?", opts: ["Scripts de PowerShell", "El bloc de notas", "El protector de pantalla", "La calculadora"], a: 0, fb: "PowerShell permite automatizar limpiezas, revisiones e informes de mantenimiento." },
        { type: "tf", time: 35, q: "El informe de salud mensual resume alertas de discos, temperaturas y actualizaciones pendientes del parque.", a: true, fb: "El informe mensual alimenta la toma de decisiones del plan de mantenimiento." }
      ]
    }
  },
  "8": {
    intermedio: {
      review: [
        { icon: "🔐", t: "Secure Boot", d: "Función de UEFI que solo permite arrancar sistemas firmados digitalmente, bloqueando malware que intente cargarse antes del sistema operativo." },
        { icon: "🔑", t: "TPM", d: "Chip de seguridad del equipo que guarda claves criptográficas; lo usan BitLocker y Windows 11. En mantenimiento se verifica su versión y activación." },
        { icon: "🧭", t: "UEFI vs BIOS legado", d: "UEFI es el reemplazo moderno del BIOS clásico:", points: ["Soporta discos GPT y arranque más rápido.", "El modo legado (CSM) existe solo por compatibilidad con sistemas viejos."] }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué función de UEFI impide que arranque software no firmado?", opts: ["Secure Boot", "Quick Boot", "CSM", "Overclocking"], a: 0, fb: "Secure Boot solo permite arrancar sistemas con firma digital válida." },
        { type: "tf", time: 35, q: "El TPM es un chip que guarda claves de seguridad y lo usan BitLocker y Windows 11.", a: true, fb: "Correcto: el TPM almacena claves criptográficas para cifrado y seguridad del sistema." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🔧", t: "Actualización de firmware (flash de BIOS)", d: "El firmware también se actualiza para corregir errores y vulnerabilidades:", points: ["Se descarga la versión exacta del fabricante para el modelo.", "Nunca apagar el equipo durante el proceso (riesgo de BIOS corrupta)."] },
        { icon: "💾", t: "Dual BIOS / recuperación", d: "Placas profesionales traen doble chip de BIOS: si la actualización falla, se restaura la copia de respaldo. En placas simples se usa el USB de recuperación del fabricante." },
        { icon: "👤", t: "Perfiles de configuración", d: "La BIOS permite guardar perfiles (ej.: perfil de aula con arranque seguro y contraseña de administrador) y aplicarlos a varios equipos iguales." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué riesgo principal tiene actualizar el firmware (flash de BIOS)?", opts: ["Dejar la BIOS corrupta si se apaga el equipo a mitad del proceso", "Borrar los archivos del usuario", "Dañar el monitor", "Perder la licencia de Windows"], a: 0, fb: "Si el equipo se apaga durante el flash, la BIOS puede quedar corrupta; por eso el dual BIOS y los USB de recuperación." },
        { type: "tf", time: 35, q: "La BIOS permite guardar perfiles de configuración para aplicarlos a varios equipos iguales.", a: true, fb: "Correcto: los perfiles agilizan la configuración de lotes de equipos idénticos." }
      ]
    }
  },
  "9": {
    intermedio: {
      review: [
        { icon: "🗂️", t: "GPT vs MBR", d: "Dos esquemas de tabla de particiones:", points: ["MBR: antiguo; máximo 2 TB y 4 particiones primarias.", "GPT: moderno; discos grandes y particiones ilimitadas; requiere UEFI."] },
        { icon: "🪟", t: "Particiones de sistema (EFI/MSR)", d: "En discos GPT de Windows aparecen particiones ocultas imprescindibles: EFI (arranque) y MSR (reservada del sistema). NO deben eliminarse." },
        { icon: "📏", t: "Alineación 4K", d: "Las particiones deben alinearse a bloques de 4K para máximo rendimiento; las herramientas modernas lo hacen automáticamente, pero es clave al particionar manual." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué tabla de particiones soporta discos mayores de 2 TB?", opts: ["GPT", "MBR", "FAT32", "NTFS"], a: 0, fb: "GPT supera el límite de 2 TB del MBR y admite particiones prácticamente ilimitadas." },
        { type: "tf", time: 35, q: "En un disco GPT de Windows, la partición EFI es prescindible y puede eliminarse para ganar espacio.", a: false, fb: "Falso: la partición EFI contiene el arranque del sistema; eliminarla deja el equipo sin arrancar." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🔐", t: "Cifrado de particiones (BitLocker)", d: "BitLocker cifra la partición completa: si el disco es robado, los datos son ilegibles sin la clave. En mantenimiento se suspende el cifrado antes de operar sobre el disco." },
        { icon: "🧩", t: "Storage Spaces", d: "Tecnología de Windows que combina varios discos en un espacio lógico con redundancia (similar a RAID por software), administrable desde el sistema." },
        { icon: "✂️", t: "Redimensionar sin pérdida", d: "Con herramientas como el Administrador de discos o GParted se puede ampliar o reducir una partición SIN perder datos (siempre con respaldo previo por seguridad)." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué herramienta de Windows cifra una partición completa para proteger los datos ante robo del disco?", opts: ["BitLocker", "Paint", "Desfragmentador", "Cortana"], a: 0, fb: "BitLocker cifra la partición: sin la clave, el disco robado es ilegible." },
        { type: "tf", time: 35, q: "Storage Spaces permite combinar varios discos con redundancia administrada por software.", a: true, fb: "Storage Spaces crea espacios de almacenamiento redundantes con varios discos, como un RAID por software." }
      ]
    }
  },
  "10": {
    intermedio: {
      review: [
        { icon: "🧽", t: "Borrado seguro (DoD 5220.22-M)", d: "Estándar de sobrescritura múltiple (3 pasadas) para que los datos no puedan recuperarse. Se usa al desechar o transferir discos con información sensible." },
        { icon: "⚙️", t: "Formateo de bajo nivel", d: "Procedimiento que reescribe la estructura física del disco a nivel de fábrica. Hoy se usa solo como último recurso en discos con problemas graves, con utilidades del fabricante." },
        { icon: "🔀", t: "exFAT vs NTFS en externos", d: "Criterio de elección:", points: ["NTFS: permisos y compresión, ideal en Windows.", "exFAT: compatibilidad con TV, macOS y archivos grandes (para USB/externos)."] }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué estándar de borrado seguro sobrescribe los datos en múltiples pasadas?", opts: ["DoD 5220.22-M", "IEEE 802.11", "ANSI/TIA-568", "ISO 9001"], a: 0, fb: "DoD 5220.22-M define sobrescritura múltiple para impedir la recuperación de datos." },
        { type: "tf", time: 35, q: "El formateo de bajo nivel es el procedimiento habitual para preparar cualquier USB nueva.", a: false, fb: "Falso: es un procedimiento extremo del fabricante para discos con problemas graves; lo habitual es el formateo estándar." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🧹", t: "TRIM y borrado seguro en SSD", d: "En SSD, el borrado seguro usa el comando TRIM/Secure Erase del firmware, que restablece las celdas sin sobrescribirlas (la sobrescritura clásica no es fiable en SSD)." },
        { icon: "🔐", t: "Cifrado previo al desecho", d: "Antes de retirar un disco, se cifra y luego se destruye la clave (cripto-borrado), dejando los datos ilegibles de forma inmediata y auditable." },
        { icon: "📜", t: "Normativa de destrucción de datos", d: "En entornos formales existe política documentada: qué discos se destruyen físicamente, cuáles se reutilizan y cómo se registra cada caso (cadena de custodia)." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué mecanismo restablece las celdas de un SSD de forma segura?", opts: ["Secure Erase del firmware", "Desfragmentación", "Sobrescritura simple", "chkdsk"], a: 0, fb: "Secure Erase restablece las celdas del SSD a nivel de firmware; la sobrescritura clásica no es fiable en SSD." },
        { type: "tf", time: 35, q: "El cripto-borrado consiste en cifrar el disco y destruir la clave, dejando los datos ilegibles.", a: true, fb: "Sin la clave, el disco cifrado es inútil: método rápido y auditable de borrado." }
      ]
    }
  },
  "11": {
    intermedio: {
      review: [
        { icon: "🤖", t: "Instalación desatendida (unattend.xml)", d: "Archivo de respuestas que automatiza la instalación del SO: idioma, particiones, usuario y clave se configuran sin intervención humana." },
        { icon: "🔀", t: "Dual boot", d: "Dos sistemas operativos en un mismo disco, cada uno en su partición, seleccionados en un menú de arranque. Requiere particionar antes de instalar el segundo sistema." },
        { icon: "🛟", t: "Partición de recuperación", d: "Windows crea una partición oculta con herramientas de reparación. En mantenimiento avanzado se preserva o se recrea para recuperar el sistema sin USB." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué archivo permite automatizar la instalación de Windows sin intervención del usuario?", opts: ["unattend.xml", "autoexec.bat", "config.sys", "hosts"], a: 0, fb: "unattend.xml (archivo de respuestas) automatiza particiones, idioma y configuración." },
        { type: "tf", time: 35, q: "El dual boot permite elegir entre dos sistemas operativos instalados en particiones distintas.", a: true, fb: "Correcto: cada sistema vive en su partición y se elige al arrancar." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🌐", t: "Despliegue por red (PXE/WDS)", d: "Los equipos arrancan desde la RED y se instalan solos desde un servidor de despliegue (WDS/MDT): imprescindible para instalar 20, 50 o más equipos idénticos." },
        { icon: "🖼️", t: "Imagen dorada (golden image)", d: "Equipo modelo con SO, drivers, ofimática y configuración listos; se captura como imagen y se replica en todos los equipos del parque." },
        { icon: "📄", t: "Licenciamiento por volumen", d: "Las organizaciones usan licencias por volumen (VL/KMS) para activar muchos equipos de forma centralizada y legal." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué tecnología permite instalar el sistema operativo en muchos equipos arrancando desde la red?", opts: ["PXE/WDS", "Bluetooth", "NFC", "Infrarrojo"], a: 0, fb: "PXE arranca desde la red y WDS/MDT despliega la imagen en el equipo." },
        { type: "tf", time: 35, q: "La imagen dorada se captura de un equipo modelo ya configurado y se replica en el resto del parque.", a: true, fb: "La golden image estandariza la instalación de todo el parque." }
      ]
    }
  },
  "12": {
    intermedio: {
      review: [
        { icon: "📏", t: "Políticas de grupo (GPO)", d: "En dominios Windows, las GPO configuran cientos de equipos desde el servidor: desactivar servicios innecesarios, restringir software y aplicar ajustes de rendimiento." },
        { icon: "🔌", t: "Servicios innecesarios", d: "Windows ejecuta servicios que no siempre se necesitan (impresión, fax, Bluetooth). Desactivarlos en equipos de aula libera memoria y acelera el arranque." },
        { icon: "🔎", t: "Indexación de búsqueda", d: "El índice de búsqueda consume recursos. En equipos de uso específico se puede limitar a carpetas necesarias o desactivar para ganar rendimiento." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué mecanismo configura muchos equipos del dominio desde el servidor?", opts: ["Políticas de grupo (GPO)", "El protector de pantalla", "El fondo de escritorio", "La calculadora"], a: 0, fb: "Las GPO aplican configuración masiva y centralizada a los equipos del dominio." },
        { type: "tf", time: 35, q: "Desactivar servicios innecesarios de Windows puede acelerar el arranque y liberar memoria.", a: true, fb: "Correcto: cada servicio desactivado libera recursos que el sistema usa al inicio." }
      ]
    },
    avanzado: {
      review: [
        { icon: "📈", t: "Performance Monitor", d: "Herramienta avanzada de Windows que registra contadores (CPU, disco, memoria, red) a lo largo del tiempo para diagnosticar cuellos de botella con evidencia." },
        { icon: "👤", t: "Perfiles de usuario y perfiles obligatorios", d: "En aulas se usan perfiles obligatorios: el usuario no puede modificar la configuración, lo que reduce el mantenimiento del software." },
        { icon: "🧩", t: "Virtualización de aplicaciones", d: "Las aplicaciones se ejecutan en entornos aislados (App-V, contenedores): se despliegan y actualizan sin tocar cada equipo individualmente." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué herramienta de Windows registra contadores de rendimiento a lo largo del tiempo?", opts: ["Performance Monitor", "Bloc de notas", "Paint", "Explorador de archivos"], a: 0, fb: "Performance Monitor captura CPU, disco, memoria y red con historial para diagnosticar." },
        { type: "tf", time: 35, q: "Los perfiles obligatorios evitan que el usuario modifique la configuración del equipo, reduciendo el mantenimiento.", a: true, fb: "Correcto: el perfil obligatorio se restaura siempre igual, protegiendo la configuración del aula." }
      ]
    }
  },
  "13": {
    intermedio: {
      review: [
        { icon: "🐟", t: "Diagrama de Ishikawa", d: "Herramienta de diagnóstico por categorías (causa-efecto): para una falla se analizan fuente, placa, RAM, disco, temperatura y software, evitando saltar a conclusiones." },
        { icon: "🔌", t: "Testers de fuente de poder", d: "Probador de fuente: conecta los cables de la PSU y verifica voltajes (3.3V, 5V, 12V). Detecta fuentes muertas o inestables sin arriesgar la placa madre." },
        { icon: "🔢", t: "POST codes", d: "Los códigos POST (pitidos o display numérico de la placa) indican la etapa exacta del arranque que falla. Se contrastan con la tabla del fabricante." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué herramienta analiza una falla por categorías de causa (fuente, RAM, disco, temperatura…)?", opts: ["Diagrama de Ishikawa", "Diagrama de Gantt", "Organigrama", "Mapa de red"], a: 0, fb: "Ishikawa organiza las causas posibles por categorías para un diagnóstico sistemático." },
        { type: "tf", time: 35, q: "Los códigos POST indican la etapa del arranque que falla y se interpretan con la tabla del fabricante.", a: true, fb: "Correcto: pitidos o displays numéricos del POST localizan la etapa fallida." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🔬", t: "Microsoldadura", d: "Reparación a nivel de componentes (SMD): reemplazo de capacitores, conectores y chips con estación de soldadura, microscopio y flux. Nivel laboratorio." },
        { icon: "🔥", t: "Reballing / reflow BGA", d: "Técnicas para chips BGA (como GPUs) con soldaduras rotas: reflow aplica calor controlado; reballing reemplaza las esferas de soldadura. Requieren equipo especializado." },
        { icon: "🧪", t: "Laboratorio de reparación", d: "Entorno profesional de reparación: estación de soldadura, microscopio, fuente de laboratorio, componentes de repuesto y registro de cada reparación." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué técnica se usa para reparar chips BGA con soldaduras rotas?", opts: ["Reballing / reflow", "Desfragmentación", "Formateo rápido", "Limpieza de registro"], a: 0, fb: "Reflow y reballing reparan las soldaduras de chips BGA con equipo especializado." },
        { type: "tf", time: 35, q: "La microsoldadura reemplaza componentes SMD (capacitores, conectores) con estación de soldadura y microscopio.", a: true, fb: "Correcto: es reparación a nivel componente, propia de laboratorio." }
      ]
    }
  },
  "14": {
    intermedio: {
      review: [
        { icon: "📜", t: "ISO 27001 — Seguridad de la información", d: "Norma internacional que estructura un sistema de gestión de seguridad: clasificación de la información, controles y mejora continua. Referencia para las políticas del CPD." },
        { icon: "🎲", t: "Análisis de riesgos", d: "Método para decidir prioridades de seguridad:", points: ["Identificar activos y amenazas.", "Valorar impacto y probabilidad.", "Aplicar controles donde el riesgo es mayor."] },
        { icon: "🛟", t: "Plan de continuidad (BCP)", d: "Define cómo el centro de cómputo sigue operando ante incidentes: roles de emergencia, respaldos críticos y tiempos máximos de recuperación (RTO)." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué norma internacional estructura el sistema de gestión de seguridad de la información?", opts: ["ISO 27001", "ISO 55000", "IEEE 802.11", "DoD 5220.22-M"], a: 0, fb: "ISO 27001 es la norma de gestión de seguridad de la información." },
        { type: "tf", time: 35, q: "El análisis de riesgos cruza amenazas, impacto y probabilidad para decidir dónde aplicar controles.", a: true, fb: "Correcto: los controles se priorizan donde el riesgo (impacto × probabilidad) es mayor." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🛡️", t: "DRP — Plan de recuperación de desastres", d: "Va más allá del respaldo: define CÓMO restaurar servicios completos tras un desastre (incendio, robo, falla mayor), con procedimientos probados y responsables." },
        { icon: "🔎", t: "Auditoría de seguridad", d: "Revisión periódica del cumplimiento de las políticas: contraseñas, permisos, respaldos y accesos físicos se verifican contra la norma y se corrigen desviaciones." },
        { icon: "🎭", t: "Ingeniería social", d: "El ataque más común no es técnico: engañar personas para obtener accesos (llamadas falsas, USB regaladas, phishing). Las políticas incluyen capacitación del personal." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué plan define cómo restaurar los servicios completos tras un desastre?", opts: ["DRP (plan de recuperación de desastres)", "POE", "Plan de formateo", "Plan de compras"], a: 0, fb: "El DRP restaura servicios completos con procedimientos probados y responsables definidos." },
        { type: "tf", time: 35, q: "La ingeniería social ataca a las personas (engaños, phishing), no a los sistemas.", a: true, fb: "Correcto: la capacitación del personal es parte clave de las políticas de seguridad." }
      ]
    }
  },
  "15": {
    intermedio: {
      review: [
        { icon: "🧱", t: "VLAN y segmentación", d: "Las VLAN dividen una red física en redes lógicas separadas (aula, administración, cámaras), aislando el tráfico y mejorando seguridad y orden." },
        { icon: "📐", t: "Cableado estructurado (ANSI/TIA-568)", d: "Norma de cableado profesional: rack, patch panel, canaletas, tomas certificadas y etiquetado. Es la referencia para diseñar la red del aula." },
        { icon: "⚡", t: "PoE", d: "Power over Ethernet: el mismo cable UTP alimenta dispositivos (access points, cámaras) sin tomacorriente adicional. El switch debe ser PoE." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué tecnología divide una red física en redes lógicas separadas?", opts: ["VLAN", "RAID", "GPT", "SMART"], a: 0, fb: "Las VLAN segmentan la red lógicamente: tráfico separado sobre el mismo cableado." },
        { type: "tf", time: 35, q: "PoE permite alimentar access points y cámaras por el mismo cable UTP.", a: true, fb: "Power over Ethernet entrega energía y datos por el mismo cable." }
      ]
    },
    avanzado: {
      review: [
        { icon: "📡", t: "Monitoreo de red (SNMP)", d: "SNMP permite supervisar los equipos de red desde una consola: tráfico de cada puerto, errores y estado de los enlaces, detectando problemas antes que los usuarios." },
        { icon: "🎚️", t: "QoS — Calidad de servicio", d: "Prioriza el tráfico crítico (videollamadas, clases virtuales) sobre el resto, garantizando fluidez cuando la red se satura." },
        { icon: "🧱", t: "Seguridad perimetral (firewall)", d: "El firewall del router filtra el tráfico entre la red interna e internet: bloquea accesos no deseados y controla qué servicios salen y entran." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Qué protocolo permite supervisar desde una consola el tráfico y estado de los equipos de red?", opts: ["SNMP", "SMTP", "DHCP", "FTP"], a: 0, fb: "SNMP es el protocolo de monitoreo de equipos de red." },
        { type: "tf", time: 35, q: "QoS prioriza el tráfico crítico (como videollamadas) cuando la red se satura.", a: true, fb: "Calidad de servicio asigna prioridad al tráfico importante." }
      ]
    }
  },
  "16": {
    intermedio: {
      review: [
        { icon: "🔁", t: "Copias diferenciales vs incrementales", d: "Estrategias de respaldo:", points: ["Completa: copia todo (lenta, base del esquema).", "Diferencial: copia lo cambiado desde la última completa.", "Incremental: copia lo cambiado desde el último respaldo (más rápida)."] },
        { icon: "📸", t: "Snapshots", d: "Fotografías instantáneas del estado del sistema o de archivos en un momento dado, para volver atrás rápidamente sin restaurar todo." },
        { icon: "🗓️", t: "Retención de respaldos (GFS)", d: "Esquema abuelo-padre-hijo: se guardan copias diarias (hijo), semanales (padre) y mensuales (abuelo), equilibrando espacio y capacidad de recuperación." }
      ],
      questions: [
        { type: "mc", time: 50, q: "La copia INCREMENTAL guarda…", opts: ["Lo cambiado desde el último respaldo", "Todo el disco completo", "Lo cambiado desde la última copia completa", "Solo el sistema operativo"], a: 0, fb: "La incremental guarda los cambios desde el último respaldo (cualquiera); la diferencial, desde la última completa." },
        { type: "tf", time: 35, q: "Un snapshot permite volver al estado del sistema en un momento dado sin restaurar todo.", a: true, fb: "El snapshot es una fotografía instantánea del estado: restauración rápida." }
      ]
    },
    avanzado: {
      review: [
        { icon: "🏢", t: "Replicación fuera del sitio", d: "Las copias se replican automáticamente a otra ubicación (otra sede o nube), protegiendo incluso ante incendios o robos en el local." },
        { icon: "🧪", t: "Prueba de restauración periódica", d: "Un respaldo que nunca se probó no es un respaldo: cada mes se restaura una copia de prueba y se verifica que los datos vuelven correctamente." },
        { icon: "🔐", t: "Cifrado de respaldos", d: "Las copias se cifran (BitLocker, VeraCrypt o cifrado de la nube) para que, si el medio de respaldo cae en manos ajenas, los datos sigan protegidos." }
      ],
      questions: [
        { type: "mc", time: 50, q: "¿Por qué es imprescindible la prueba de restauración periódica?", opts: ["Porque un respaldo que nunca se probó puede no funcionar al necesitarlo", "Porque así el disco dura más", "Porque mejora la velocidad del equipo", "Porque reduce el consumo eléctrico"], a: 0, fb: "La prueba mensual de restauración verifica que las copias realmente recuperan los datos." },
        { type: "tf", time: 35, q: "La replicación fuera del sitio protege los datos incluso ante incendios o robos en el local.", a: true, fb: "Correcto: la copia en otra ubicación sobrevive a desastres del local." }
      ]
    }
  }
};
