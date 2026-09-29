/* ============================================================
   DATOS — Sesiones 9 a 16
   Mantenimiento de rutina y salvaguarda de información
   ============================================================ */

var SESSIONS3 = [
  {
    id: 9,
    num: "09",
    title: "Particionamiento de discos duros",
    emoji: "🧩",
    module: "C",
    moduleName: "Mantenimiento correctivo",
    color: "#d97706",
    date: "11/09/2026",
    goal: "Particionas un disco duro creando las unidades necesarias (C:, D:) con el sistema de archivos adecuado.",
    product: "Disco particionado correctamente (registro)",
    review: [
      { icon: "🧩", t: "¿Qué es particionar?", d: "Particionar un disco es dividirlo en secciones lógicas independientes (C:, D:, …).", points: ["Cada partición se comporta como un disco aparte.", "Permite organizar datos y separar el sistema de los archivos."] },
      { icon: "📚", t: "Tipos de particiones", d: "Existen dos tipos principales:", points: ["PRIMARIA: puede contener un sistema operativo.", "LÓGICA: se crea dentro de una partición extendida."] },
      { icon: "💾", t: "Sistemas de archivos", d: "Cada partición se formatea con un sistema de archivos:", points: ["NTFS: el estándar de Windows (discos internos).", "FAT32: máxima compatibilidad, archivos de hasta 4 GB.", "exFAT: ideal para memorias USB y discos externos grandes."] },
      {
        icon: "🎯", t: "Ventajas de particionar",
        d: "Separar el sistema de los datos trae beneficios concretos:",
        points: [
          "Reinstalar el SO sin perder los archivos de la partición de datos.",
          "Organizar: sistema, datos y respaldos en unidades distintas.",
          "Facilita las copias de seguridad por partición."
        ],
        img: '<svg viewBox="0 0 460 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Disco particionado C y D"><rect x="20" y="20" width="420" height="110" rx="10" fill="#e2e8f0" stroke="#64748b" stroke-width="2.5"/><rect x="35" y="40" width="180" height="70" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="125" y="70" text-anchor="middle" font-size="13" fill="#1e40af" font-weight="bold">C: SISTEMA</text><text x="125" y="90" text-anchor="middle" font-size="10" fill="#1e40af">NTFS · Windows</text><rect x="245" y="40" width="180" height="70" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><text x="335" y="70" text-anchor="middle" font-size="13" fill="#14532d" font-weight="bold">D: DATOS</text><text x="335" y="90" text-anchor="middle" font-size="10" fill="#14532d">NTFS · Archivos</text><text x="230" y="150" text-anchor="middle" font-size="11" fill="#475569">Un disco físico, dos unidades lógicas</text></svg>'
      },
      { icon: "⚠️", t: "Riesgos", d: "Particionar mal un disco con datos puede causar PÉRDIDA DE INFORMACIÓN.", points: ["Siempre respaldar antes de particionar.", "Verificar que se trabaja sobre el disco correcto."] },
      { icon: "🏫", t: "Ejemplo aplicado", d: "Un disco de 1 TB en un equipo de trabajo se divide así:", points: ["C: (200 GB) para Windows y programas.", "D: (800 GB) para documentos y respaldos.", "Así, al reinstalar Windows solo se formatea C:."] }
    ],
    tip: "Antes de particionar, respalda la información y verifica DOS VECES que es el disco correcto: un error borra datos.",
    questions: [
      { type: "mc", q: "¿Qué es particionar un disco duro?", opts: ["Dividirlo en secciones lógicas independientes (C:, D:)", "Borrar toda la información", "Cambiar el procesador", "Instalar un antivirus"], a: 0, fb: "Particionar divide el disco físico en unidades lógicas independientes que se comportan como discos aparte." },
      { type: "mc", q: "¿Qué tipo de partición puede contener un sistema operativo?", opts: ["La partición primaria", "La partición lógica", "La partición extendida", "La partición de respaldo"], a: 0, fb: "La primaria es la que puede alojar un sistema operativo; las lógicas viven dentro de la extendida." },
      { type: "tf", q: "Una partición lógica se crea dentro de una partición extendida.", a: true, fb: "Correcto: dentro de la extendida se crean las unidades lógicas adicionales." },
      { type: "mc", img: '<svg viewBox="0 0 460 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Disco particionado C y D"><rect x="20" y="20" width="420" height="110" rx="10" fill="#e2e8f0" stroke="#64748b" stroke-width="2.5"/><rect x="35" y="40" width="180" height="70" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="125" y="70" text-anchor="middle" font-size="13" fill="#1e40af" font-weight="bold">C: SISTEMA</text><text x="125" y="90" text-anchor="middle" font-size="10" fill="#1e40af">NTFS · Windows</text><rect x="245" y="40" width="180" height="70" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><text x="335" y="70" text-anchor="middle" font-size="13" fill="#14532d" font-weight="700">D: DATOS</text><text x="335" y="90" text-anchor="middle" font-size="10" fill="#14532d">NTFS · Archivos</text></svg>', q: "Según la imagen, ¿cuál es la principal ventaja de separar C: (sistema) de D: (datos)?", opts: ["Reinstalar Windows sin perder los archivos de D:", "El disco dura más tiempo", "La pantalla se ve mejor", "No necesita antivirus"], a: 0, fb: "Al reinstalar solo se formatea C: y los documentos de D: quedan intactos." },
      { type: "match", q: "Relaciona cada sistema de archivos con su uso recomendado:", pairs: [["NTFS", "Discos internos de Windows"], ["FAT32", "Memorias USB pequeñas (hasta 4 GB por archivo)"], ["exFAT", "Discos externos y USB grandes"]], fb: "NTFS para Windows interno, FAT32 para compatibilidad máxima y exFAT para externos grandes." },
      { type: "order", q: "Ordena el procedimiento de particionamiento:", items: ["Respaldar la información", "Abrir el Administrador de discos", "Reducir el volumen existente", "Crear la nueva partición", "Asignar letra y formatear"], fb: "Primero respaldo (seguridad), luego administrador, reducir, crear y formatear la nueva unidad." },
      { type: "fill", q: "Particionar mal un disco con datos puede causar pérdida de ______.", answers: ["información", "informacion", "datos"], fb: "Por eso el respaldo previo es obligatorio: un error de particionado puede borrar los datos." },
      { type: "tf", q: "El Administrador de discos de Windows permite crear, reducir y eliminar particiones.", a: true, fb: "Correcto: es la herramienta integrada de Windows para gestionar particiones." }
    ]
  },
  {
    id: 10,
    num: "10",
    title: "Formateo de discos duros",
    emoji: "💾",
    module: "C",
    moduleName: "Mantenimiento correctivo",
    color: "#d97706",
    date: "14/09/2026",
    goal: "Formateas un disco duro aplicando el sistema de archivos adecuado según su uso.",
    product: "Disco formateado (registro)",
    review: [
      { icon: "💾", t: "¿Qué es formatear?", d: "Formatear un disco es prepararlo para almacenar información, asignándole un sistema de archivos. ELIMINA los datos existentes.", points: ["Es parte del mantenimiento correctivo de almacenamiento.", "Antes de formatear: verificar que es el disco correcto."] },
      { icon: "⚡", t: "Formateo rápido vs. completo", d: "Dos modos con diferencias importantes:", points: ["RÁPIDO: borra la tabla de archivos; más veloz, pero no verifica el disco.", "COMPLETO: verifica todos los sectores; más lento y seguro."] },
      { icon: "📁", t: "Sistemas de archivos", d: "Se elige según el destino del disco:", points: ["NTFS: discos internos de Windows.", "FAT32: máxima compatibilidad (archivos hasta 4 GB).", "exFAT: USB y discos externos grandes."] },
      { icon: "❓", t: "¿El formateo borra definitivamente?", d: "El formateo elimina el acceso a los datos, pero la información puede recuperarse con herramientas especializadas.", points: ["Para borrado seguro existen utilitarios de borrado definitivo."] },
      { icon: "🏫", t: "Ejemplo aplicado", d: "Una USB de 64 GB para usar entre PC, TV y proyector:", points: ["Se formatea en exFAT: compatible con todos y admite archivos grandes.", "Un disco interno de Windows, en cambio, va en NTFS."] },
      { icon: "⚠️", t: "Errores comunes", points: ["Formatear el disco equivocado (¡adiós datos!).", "Usar FAT32 para archivos mayores de 4 GB.", "Formatear sin respaldo previo."] }
    ],
    tip: "Antes de formatear revisa DOS VECES que sea el disco correcto: el formateo elimina los datos existentes.",
    questions: [
      { type: "mc", q: "¿Qué hace el formateo de un disco?", opts: ["Lo prepara para almacenar información asignando un sistema de archivos y elimina los datos", "Le da más velocidad al procesador", "Instala el antivirus", "Copia los datos a otro disco"], a: 0, fb: "Formatear prepara el disco (sistema de archivos) y elimina los datos existentes." },
      { type: "mc", q: "¿Cuál es la diferencia del formateo COMPLETO frente al rápido?", opts: ["Verifica todos los sectores del disco; es más lento y seguro", "Es más rápido y no borra los datos", "Solo funciona en SSD", "No asigna sistema de archivos"], a: 0, fb: "El completo verifica sector por sector (detecta sectores defectuosos); el rápido solo borra la tabla de archivos." },
      { type: "tf", q: "El formateo rápido verifica todos los sectores del disco.", a: false, fb: "Al contrario: el rápido solo borra la tabla de archivos; el que verifica sectores es el formateo COMPLETO." },
      { type: "match", q: "Relaciona cada medio con su sistema de archivos recomendado:", pairs: [["Disco interno de Windows", "NTFS"], ["USB pequeña de máxima compatibilidad", "FAT32"], ["Disco externo de 1 TB", "exFAT"]], fb: "NTFS interno, FAT32 compatibilidad total y exFAT para externos grandes." },
      { type: "order", q: "Ordena el procedimiento de formateo seguro:", items: ["Respaldar la información importante", "Seleccionar el disco correcto", "Elegir el sistema de archivos", "Ejecutar el formateo", "Verificar el resultado"], fb: "Respaldo → disco correcto → sistema de archivos → formateo → verificación." },
      { type: "mc", img: '<svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ventana de formateo"><rect x="30" y="10" width="360" height="150" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><rect x="30" y="10" width="360" height="26" rx="10" fill="#e2e8f0"/><text x="210" y="28" text-anchor="middle" font-size="11" fill="#334155" font-weight="bold">Formatear Disco local (D:)</text><text x="50" y="56" font-size="11" fill="#475569">Capacidad: 800 GB</text><text x="50" y="76" font-size="11" fill="#475569">Sistema de archivos: [ NTFS ▾ ]</text><rect x="50" y="92" width="14" height="14" rx="3" fill="#2563eb" stroke="#1e40af"/><text x="72" y="104" font-size="11" fill="#1e40af" font-weight="bold">Formateo rápido</text><rect x="140" y="120" width="120" height="30" rx="6" fill="#2563eb"/><text x="200" y="140" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">Iniciar</text></svg>', q: "En la ventana de formateo de la imagen, ¿qué debes hacer para realizar un formateo COMPLETO?", opts: ["Desmarcar la casilla «Formateo rápido»", "Marcar la casilla «Formateo rápido»", "Cambiar el sistema de archivos a FAT32", "Reducir la capacidad"], a: 0, fb: "Con «Formateo rápido» marcado se omite la verificación de sectores; desmarcándolo se ejecuta el formateo completo." },
      { type: "fill", q: "El formateo ______ verifica todos los sectores del disco.", answers: ["completo", "completo es"], fb: "El formateo completo verifica sectores y detecta defectos; es más lento pero más seguro." },
      { type: "tf", q: "Después de un formateo normal, la información puede recuperarse con herramientas especializadas.", a: true, fb: "El formateo elimina el acceso, no necesariamente los datos: para borrado definitivo existen utilitarios especiales." }
    ]
  },
  {
    id: 11,
    num: "11",
    title: "Instalación del sistema operativo",
    emoji: "🖥️",
    module: "C",
    moduleName: "Mantenimiento correctivo",
    color: "#d97706",
    date: "15/09/2026",
    goal: "Instalas el sistema operativo en un equipo como parte del mantenimiento correctivo de software.",
    product: "Sistema operativo instalado (registro)",
    review: [
      { icon: "🖥️", t: "¿Qué es instalar un SO?", d: "Es el proceso de copiar los archivos del sistema a un disco y configurarlo para que el equipo arranque con él.", points: ["Se realiza desde un medio de instalación.", "Incluye la configuración inicial (idioma, usuario)."] },
      { icon: "📀", t: "Medio de instalación", d: "Se necesita un USB booteable o DVD con la imagen ISO del sistema.", points: ["La imagen ISO se graba en el USB con herramientas como Rufus.", "El USB debe marcarse como BOOTEABLE."] },
      { icon: "📋", t: "Requisitos previos", d: "Antes de instalar:", points: ["Verificar los requisitos mínimos de hardware (RAM, disco, procesador).", "RESPALDAR la información existente: la instalación puede borrar el disco."] },
      { icon: "🔢", t: "Pasos generales", d: "La instalación sigue una secuencia estándar:", points: ["1) Arrancar desde el medio de instalación.", "2) Particionar y formatear el disco.", "3) Copiar los archivos del sistema.", "4) Configurar idioma, usuario y ajustes iniciales."] },
      { icon: "⚙️", t: "Arrancar desde el USB", d: "Para que el equipo arranque desde el USB, se configura el orden de arranque en la BIOS/UEFI (menú Boot)." },
      { icon: "⚠️", t: "Errores comunes", points: ["Instalar sin respaldo previo: se pierden los datos.", "Olvidar marcar el USB como booteable.", "No configurar el orden de arranque en la BIOS.", "Olvidar instalar los drivers después del SO."] }
    ],
    tip: "Instalar un sistema operativo SIN respaldo previo es la forma más rápida de perder los datos: respaldo primero, siempre.",
    questions: [
      { type: "mc", q: "¿Qué se necesita como medio de instalación del sistema operativo?", opts: ["Un USB booteable o DVD con la imagen ISO", "Solo el disco duro", "Un antivirus actualizado", "Una conexión a internet obligatoria"], a: 0, fb: "El medio de instalación es un USB booteable o DVD con la imagen ISO del sistema." },
      { type: "tf", q: "Antes de instalar un sistema operativo se debe respaldar la información existente.", a: true, fb: "La instalación puede particionar y formatear el disco: sin respaldo, los datos se pierden." },
      { type: "mc", q: "¿Cómo se logra que el equipo arranque desde el USB de instalación?", opts: ["Configurando el orden de arranque en la BIOS/UEFI", "Conectando el USB después de encender", "Instalando un antivirus", "Cambiando la resolución de pantalla"], a: 0, fb: "Se configura el orden de arranque (menú Boot) de la BIOS/UEFI para que el USB sea el primer dispositivo." },
      { type: "mc", img: '<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="USB booteable con imagen ISO"><rect x="150" y="15" width="120" height="45" rx="8" fill="#94a3b8" stroke="#475569" stroke-width="2"/><rect x="150" y="15" width="120" height="14" rx="8" fill="#cbd5e1"/><rect x="180" y="60" width="60" height="22" fill="#475569"/><path d="M180 82 L210 82 L228 92 L192 92 Z" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/><circle cx="210" cy="97" r="4" fill="#334155"/><rect x="40" y="100" width="340" height="40" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="210" y="125" text-anchor="middle" font-size="12" fill="#1e40af" font-weight="bold">imagen.iso → USB BOOTEABLE</text></svg>', q: "Según la imagen, ¿qué se hace con la imagen ISO para poder instalar el sistema?", opts: ["Grabarla en el USB para hacerlo booteable", "Enviarla por correo", "Imprimirla", "Guardarla en la nube"], a: 0, fb: "La imagen ISO se graba en el USB (por ejemplo con Rufus) y así el equipo puede arrancar desde él." },
      { type: "mc", q: "¿Qué se configura al final de la instalación del sistema?", opts: ["Idioma, usuario y ajustes iniciales", "El voltaje de la fuente", "La marca del procesador", "El número de particiones"], a: 0, fb: "La fase final configura idioma, cuenta de usuario y ajustes iniciales del sistema." },
      { type: "order", q: "Ordena los pasos de la instalación del sistema operativo:", items: ["Crear el USB booteable con la imagen ISO", "Respaldar la información", "Arrancar desde el USB", "Particionar y formatear el disco", "Copiar archivos y configurar el usuario"], fb: "Medio listo → respaldo → arranque desde USB → particionar/formatear → copiar y configurar." },
      { type: "fill", q: "La imagen ______ se graba en el USB para hacerlo booteable.", answers: ["iso", "ISO"], fb: "La imagen ISO contiene todos los archivos del sistema listos para la instalación." },
      { type: "tf", q: "Instalar un sistema operativo nunca afecta los datos del disco.", a: false, fb: "La instalación suele particionar y formatear el disco: los datos pueden perderse. Por eso el respaldo es obligatorio." }
    ]
  },
  {
    id: 12,
    num: "12",
    title: "Instalación de ofimática y optimización del sistema",
    emoji: "📊",
    module: "C",
    moduleName: "Mantenimiento correctivo",
    color: "#d97706",
    date: "16/09/2026",
    goal: "Instalas aplicativos de ofimática y utilitarios, y optimizas el sistema operativo.",
    product: "Informe de instalación y optimización de software",
    review: [
      { icon: "📊", t: "¿Qué es la ofimática?", d: "Conjunto de aplicaciones para el trabajo de oficina:", points: ["Procesador de texto (Word, Writer).", "Hoja de cálculo (Excel, Calc).", "Presentaciones (PowerPoint, Impress)."] },
      { icon: "⚡", t: "¿Qué es optimizar el SO?", d: "Mejorar el RENDIMIENTO del sistema SIN cambiar hardware.", points: ["Un equipo lento no siempre necesita más RAM: primero se optimiza el software."] },
      { icon: "🚀", t: "Programas de inicio", d: "Desactivar los programas innecesarios del inicio acelera el arranque.", points: ["Se gestiona con el Administrador de tareas (pestaña Inicio).", "Cada programa del inicio consume recursos desde el encendido."] },
      { icon: "🧹", t: "Limpieza de temporales y registro", d: "Eliminar archivos temporales y entradas obsoletas del registro libera espacio y evita errores." },
      { icon: "🗑️", t: "Desinstalar lo que no se usa", d: "Los programas olvidados ocupan disco y pueden ejecutar procesos en segundo plano.", points: ["Revisar la lista de programas instalados cada trimestre."] },
      { icon: "🧩", t: "Desfragmentación (si es HDD)", d: "Después de instalar y limpiar, se desfragmenta el disco SI es HDD (en SSD no)." }
    ],
    tip: "Un sistema lento no siempre necesita más RAM: primero optimiza (inicio, temporales, desinstalación) y luego evalúa el hardware.",
    questions: [
      { type: "mc", q: "¿Qué significa optimizar el sistema operativo?", opts: ["Mejorar el rendimiento sin cambiar hardware", "Comprar más memoria RAM", "Cambiar el procesador", "Instalar un segundo sistema operativo"], a: 0, fb: "Optimizar es sacar el máximo rendimiento del software: inicio, limpieza, desinstalación y desfragmentación (HDD)." },
      { type: "mc", q: "¿Qué acción NO ayuda a optimizar el sistema?", opts: ["Subir el brillo de la pantalla", "Desactivar programas del inicio", "Limpiar archivos temporales", "Desinstalar programas sin uso"], a: 0, fb: "El brillo no afecta el rendimiento; las otras tres acciones sí lo mejoran." },
      { type: "tf", q: "Un equipo lento siempre necesita más memoria RAM.", a: false, fb: "Muchas veces basta con optimizar el software: desactivar programas del inicio y limpiar temporales suele ser suficiente." },
      { type: "match", q: "Relaciona cada acción con su efecto:", pairs: [["Desactivar programas del inicio", "Arranque más rápido"], ["Limpiar archivos temporales", "Liberar espacio en disco"], ["Desinstalar programas sin uso", "Liberar disco y recursos"], ["Desfragmentar el HDD", "Acceso más rápido a los datos"]], fb: "Cada acción ataca un cuello de botella distinto del rendimiento." },
      { type: "order", q: "Ordena la rutina de optimización:", items: ["Desactivar programas innecesarios del inicio", "Limpiar temporales y registro", "Desinstalar programas que no se usan", "Desfragmentar (si es HDD)", "Verificar el rendimiento final"], fb: "Inicio → limpieza → desinstalación → desfragmentación (HDD) → verificación." },
      { type: "mc", q: "¿Cuáles son ejemplos de aplicaciones de ofimática?", opts: ["Procesador de texto, hoja de cálculo y presentaciones", "Antivirus y firewall", "Juegos en línea", "Drivers de video"], a: 0, fb: "La ofimática es el paquete de oficina: texto, cálculo y presentaciones." },
      { type: "fill", q: "La desfragmentación solo se aplica a discos ______.", answers: ["hdd", "duros", "mecanicos", "mecánicos", "hdd mecanicos"], fb: "En discos HDD sí; en SSD es innecesaria y desgastante." },
      { type: "tf", q: "Optimizar el software puede evitar la compra de hardware nuevo.", a: true, fb: "Muchos equipos «lentos» solo necesitan optimización: se evita gastar en RAM o disco sin necesidad." }
    ]
  },
  {
    id: 13,
    num: "13",
    title: "Mantenimiento correctivo de componentes y utilitarios",
    emoji: "🔧",
    module: "C",
    moduleName: "Mantenimiento correctivo",
    color: "#d97706",
    date: "17/09/2026",
    goal: "Ejecutas el mantenimiento correctivo de unidades de procesamiento, memorias, placa madre y tarjetas gráficas.",
    product: "Ficha de mantenimiento correctivo de componentes",
    review: [
      { icon: "🔧", t: "¿Qué es el correctivo?", d: "El mantenimiento correctivo REPARA las fallas que ya ocurrieron.", points: ["Requiere diagnosticar el componente defectuoso.", "Luego se reemplaza o repara."] },
      { icon: "🩺", t: "Diagnóstico de la falla", d: "El primer paso SIEMPRE es diagnosticar:", points: ["Pruebas por aislamiento: cambiar un componente a la vez.", "Utilitarios de diagnóstico (HWMonitor, CrystalDiskInfo).", "Observar síntomas: pitidos, pantalla, temperatura."] },
      { icon: "🔁", t: "Reemplazo de componentes", d: "Los más comunes en mantenimiento correctivo:", points: ["Módulos de memoria RAM defectuosos.", "Tarjeta gráfica con fallas.", "Procesador dañado (menos frecuente).", "Fuente de poder inestable."] },
      { icon: "🧹", t: "Limpieza y reconexión", d: "Muchas fallas se resuelven con limpieza y reconexión:", points: ["Conectores flojos o con óxido.", "Polvo que provoca cortocircuitos o sobrecalentamiento."] },
      { icon: "🧰", t: "Utilitarios de diagnóstico", d: "Acompañan el diagnóstico físico:", points: ["Memtest86: prueba la memoria RAM.", "CrystalDiskInfo: salud del disco.", "HWMonitor: temperaturas y voltajes."] },
      { icon: "⚠️", t: "Errores comunes", points: ["Reemplazar componentes sin diagnosticar (gastar de más).", "Probar varios componentes a la vez (no se aísla la falla).", "Manipular componentes sin descargar la estática."] }
    ],
    tip: "Diagnostica ANTES de reemplazar y cambia de a UN componente: así aíslas la falla y no gastas repuestos de más.",
    questions: [
      { type: "mc", q: "¿Qué es el mantenimiento correctivo?", opts: ["El que repara las fallas que ya ocurrieron", "El que evita las fallas futuras", "La limpieza programada mensual", "La actualización del antivirus"], a: 0, fb: "El correctivo interviene cuando la falla ya existe: diagnostica y repara o reemplaza." },
      { type: "mc", q: "¿Cuál es el primer paso ante una falla de hardware?", opts: ["Diagnosticar y aislar el componente defectuoso", "Comprar un equipo nuevo", "Formatear el disco", "Actualizar el antivirus"], a: 0, fb: "Primero se diagnostica: identificar el síntoma y aislar el componente fallado antes de gastar en repuestos." },
      { type: "tf", q: "Una falla puede estar en varios componentes a la vez.", a: true, fb: "Por eso el aislamiento es clave: se cambia un componente a la vez para identificar la causa." },
      { type: "match", q: "Relaciona cada síntoma con su causa probable:", pairs: [["El equipo no enciende", "Fuente de poder o placa madre"], ["Pitidos al encender", "Memoria RAM"], ["No hay imagen en pantalla", "Tarjeta gráfica o monitor"], ["Reinicios aleatorios", "Sobrecalentamiento"]], fb: "Los síntomas guían el diagnóstico: energía, RAM, video o temperatura." },
      { type: "order", q: "Ordena el procedimiento correctivo:", items: ["Identificar el síntoma", "Aislar el componente (uno a la vez)", "Diagnosticar con utilitarios", "Reemplazar el componente defectuoso", "Probar el equipo y registrar en la ficha"], fb: "Síntoma → aislamiento → diagnóstico → reemplazo → prueba y registro." },
      { type: "mc", img: '<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Módulos de memoria RAM"><rect x="30" y="20" width="360" height="120" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><rect x="60" y="40" width="300" height="18" rx="3" fill="#166534" stroke="#14532d" stroke-width="1.5"/><rect x="60" y="62" width="300" height="18" rx="3" fill="#166534" stroke="#14532d" stroke-width="1.5"/><rect x="60" y="84" width="300" height="18" rx="3" fill="#166534" stroke="#14532d" stroke-width="1.5"/><rect x="60" y="106" width="300" height="18" rx="3" fill="#166534" stroke="#14532d" stroke-width="1.5"/><circle cx="96" cy="49" r="3" fill="#fbbf24"/><circle cx="140" cy="49" r="3" fill="#fbbf24"/><circle cx="184" cy="49" r="3" fill="#fbbf24"/><circle cx="228" cy="49" r="3" fill="#fbbf24"/><circle cx="96" cy="71" r="3" fill="#fbbf24"/><circle cx="140" cy="71" r="3" fill="#fbbf24"/><circle cx="184" cy="71" r="3" fill="#fbbf24"/><circle cx="228" cy="71" r="3" fill="#fbbf24"/><text x="210" y="144" text-anchor="middle" font-size="11" fill="#475569">Módulo de memoria RAM (contactos dorados)</text></svg>', q: "El equipo emite pitidos al encender y no arranca. Según la imagen, ¿qué componente revisarías primero?", opts: ["La memoria RAM", "El monitor", "La impresora", "El mouse"], a: 0, fb: "Los pitidos del POST suelen indicar falla de memoria RAM: se limpian los contactos o se reemplaza el módulo." },
      { type: "fill", q: "Para aislar una falla se prueba un componente a la ______.", answers: ["vez", "la vez"], fb: "Cambiar de a un componente permite identificar cuál es el defectuoso." },
      { type: "tf", q: "Antes de manipular componentes internos se debe descargar la estática del cuerpo.", a: true, fb: "La estática puede dañar los circuitos: toca el chasis metálico o usa pulsera antiestática." }
    ]
  },
  {
    id: 14,
    num: "14",
    title: "Políticas de mantenimiento y seguridad informática",
    emoji: "🛡️",
    module: "D",
    moduleName: "Salvaguarda de la información",
    color: "#7c3aed",
    date: "18/09/2026",
    goal: "Reconoces las políticas de mantenimiento y seguridad informática y su relación con la salvaguarda de la información.",
    product: "Cuadro de políticas de mantenimiento y seguridad",
    review: [
      { icon: "🛡️", t: "¿Qué son las políticas de seguridad?", d: "Son REGLAS que definen cómo se protegen los equipos y la información. Orientan las acciones de todo el personal.", points: ["Sin políticas, cada quien actúa como quiere.", "Deben comunicarse y cumplirse por todos."] },
      { icon: "🔐", t: "Control de acceso", d: "Dos niveles de control:", points: ["FÍSICO: puertas con llave, cámaras, control del ingreso al CPD.", "LÓGICO: contraseñas, usuarios y permisos en los sistemas."] },
      { icon: "📅", t: "Mantenimiento preventivo programado", d: "La seguridad también es mantenimiento:", points: ["Limpieza y revisión programadas de los equipos.", "Actualizaciones de seguridad puntuales."] },
      { icon: "💾", t: "Respaldo periódico", d: "Política de respaldo (backup):", points: ["Copias programadas (diaria, semanal).", "Guardadas en un medio distinto al equipo original."] },
      { icon: "🦠", t: "Antivirus y actualizaciones", d: "Protección contra software malicioso:", points: ["Antivirus activo y actualizado en todos los equipos.", "Sistema operativo y aplicaciones al día."] },
      { icon: "🔗", t: "Salvaguarda mediante interconexión", d: "La interconexión de equipos permite COMPARTIR y RESPALDAR información entre computadoras, reforzando la salvaguarda." }
    ],
    tip: "La seguridad no es un producto, es una política: reglas claras, comunicadas y cumplidas por todo el personal.",
    questions: [
      { type: "mc", q: "¿Qué es una política de seguridad informática?", opts: ["Reglas que definen cómo se protegen los equipos y la información", "Un antivirus de pago", "El cableado de la red", "Una marca de computadoras"], a: 0, fb: "Las políticas son reglas que orientan las acciones del personal para proteger equipos e información." },
      { type: "mc", q: "¿Cuál es un ejemplo de control de acceso LÓGICO?", opts: ["La contraseña de usuario", "La puerta con llave del CPD", "La cámara de seguridad", "El candado del rack"], a: 0, fb: "Lo lógico vive en los sistemas (contraseñas, permisos); lo físico son puertas, llaves y candados." },
      { type: "tf", q: "El respaldo periódico de la información forma parte de las políticas de seguridad.", a: true, fb: "El respaldo programado es una política clave de salvaguarda: protege ante pérdidas y fallas." },
      { type: "match", q: "Relaciona cada política con su ejemplo:", pairs: [["Control de acceso físico", "Puerta con llave del centro de cómputo"], ["Control de acceso lógico", "Contraseñas y permisos de usuario"], ["Respaldo periódico", "Copia semanal en disco externo"], ["Antivirus y actualizaciones", "Protección contra malware"]], fb: "Físico = llaves; lógico = contraseñas; respaldo = copias; antivirus = protección." },
      { type: "order", q: "Ordena la implementación de políticas de seguridad:", items: ["Definir las políticas por escrito", "Comunicarlas a todo el personal", "Aplicar los controles de acceso", "Ejecutar respaldos periódicos", "Auditar el cumplimiento"], fb: "Definir → comunicar → aplicar → respaldar → auditar: la política vive si se cumple y se verifica." },
      { type: "mc", img: '<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Puerta con candado"><rect x="30" y="15" width="360" height="130" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5"/><rect x="150" y="45" width="120" height="100" rx="4" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/><circle cx="250" cy="95" r="6" fill="#64748b"/><rect x="60" y="60" width="70" height="42" rx="8" fill="#fbbf24" stroke="#b45309" stroke-width="2.5"/><rect x="60" y="92" width="70" height="12" rx="4" fill="#b45309"/><text x="95" y="132" text-anchor="middle" font-size="11" fill="#475569" font-weight="bold">CANDADO</text></svg>', q: "La imagen muestra una puerta asegurada con candado. ¿Qué tipo de control de acceso representa?", opts: ["Control de acceso FÍSICO", "Control de acceso LÓGICO", "Control de software", "Ningún control"], a: 0, fb: "Puertas, candados y llaves son controles FÍSICOS; las contraseñas son controles lógicos." },
      { type: "fill", q: "Las políticas de seguridad orientan las acciones del ______ del centro de cómputo.", answers: ["personal", "todo el personal"], fb: "Las políticas solo funcionan si todo el personal las conoce y las cumple." },
      { type: "tf", q: "La interconexión de computadoras permite compartir y respaldar información entre equipos.", a: true, fb: "La interconexión refuerza la salvaguarda: permite respaldos en red y compartición controlada." }
    ]
  },
  {
    id: 15,
    num: "15",
    title: "Interconexión de computadoras y compartición de información",
    emoji: "🔗",
    module: "D",
    moduleName: "Salvaguarda de la información",
    color: "#7c3aed",
    date: "21/09/2026",
    goal: "Identificas los dispositivos y medios de interconexión (cableado e inalámbrico) y compartes información entre computadoras.",
    product: "Esquema de interconexión y compartición de información",
    review: [
      { icon: "🔗", t: "¿Qué es la interconexión?", d: "La interconexión permite que las computadoras se COMUNIQUEN y compartan recursos e información. Es la base de la salvaguarda mediante respaldos en red." },
      { icon: "🔀", t: "Switch", d: "Dispositivo que conecta varios equipos POR CABLE en una red local.", points: ["Ejemplo: las 12 PCs del aula conectadas a un switch."] },
      { icon: "🌐", t: "Router", d: "Dispositivo que conecta REDES entre sí y da acceso a INTERNET.", points: ["Une la red local con la red del proveedor."] },
      { icon: "📡", t: "Punto de acceso (AP)", d: "Dispositivo que conecta equipos por WI-FI.", points: ["Extiende la red a laptops y celulares."] },
      { icon: "🔌", t: "Medios de conexión", d: "Dos medios principales:", points: ["CABLEADO: cable UTP con conectores RJ45 (Ethernet).", "INALÁMBRICO: Wi-Fi (norma IEEE 802.11)."] },
      { icon: "📂", t: "Compartición de información", d: "Compartir carpetas y recursos (impresoras, archivos) en la red, con permisos adecuados.", points: ["Solo se comparte lo necesario y con los permisos correctos."] }
    ],
    tip: "Cada dispositivo tiene su función: switch para cablear, router para salir a internet y AP para el Wi-Fi.",
    questions: [
      { type: "match", q: "Relaciona cada dispositivo con su función:", pairs: [["Switch", "Conecta varios equipos por cable"], ["Router", "Conecta redes y da acceso a internet"], ["Access point (AP)", "Conecta equipos por Wi-Fi"]], fb: "Switch = cable local; router = redes e internet; AP = inalámbrico." },
      { type: "mc", q: "¿Qué conector usa el cable UTP de red?", opts: ["RJ45", "USB-C", "HDMI", "Jack de audio"], a: 0, fb: "El cable UTP Ethernet termina en conectores RJ45." },
      { type: "tf", q: "El Wi-Fi se basa en la norma IEEE 802.11.", a: true, fb: "Correcto: las redes inalámbricas siguen la familia de normas IEEE 802.11." },
      { type: "mc", img: '<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Red con switch, PCs y access point"><rect x="190" y="60" width="100" height="46" rx="10" fill="#d5e8d4" stroke="#82b366" stroke-width="2.5"/><text x="240" y="88" text-anchor="middle" font-size="12" fill="#1e3a1f" font-weight="bold">SWITCH</text><rect x="20" y="140" width="70" height="36" rx="6" fill="#ffffff" stroke="#333" stroke-width="1.5"/><text x="55" y="163" text-anchor="middle" font-size="10">PC 1</text><rect x="120" y="140" width="70" height="36" rx="6" fill="#ffffff" stroke="#333" stroke-width="1.5"/><text x="155" y="163" text-anchor="middle" font-size="10">PC 2</text><rect x="220" y="140" width="70" height="36" rx="6" fill="#ffffff" stroke="#333" stroke-width="1.5"/><text x="255" y="163" text-anchor="middle" font-size="10">PC 3</text><rect x="320" y="140" width="70" height="36" rx="6" fill="#ffffff" stroke="#333" stroke-width="1.5"/><text x="355" y="163" text-anchor="middle" font-size="10">PC 4</text><line x1="55" y1="140" x2="220" y2="106" stroke="#333" stroke-width="2"/><line x1="155" y1="140" x2="230" y2="106" stroke="#333" stroke-width="2"/><line x1="255" y1="140" x2="245" y2="106" stroke="#333" stroke-width="2"/><line x1="355" y1="140" x2="265" y2="106" stroke="#333" stroke-width="2"/><ellipse cx="430" cy="90" rx="24" ry="30" fill="#ffe6cc" stroke="#d79b00" stroke-width="2"/><text x="430" y="96" text-anchor="middle" font-size="11">AP</text><line x1="290" y1="83" x2="406" y2="90" stroke="#d79b00" stroke-width="2" stroke-dasharray="5,4"/></svg>', q: "Observa la red de la imagen: 4 PCs conectadas por cable a un dispositivo central. ¿Qué dispositivo es el marcado como SWITCH?", opts: ["El dispositivo central que conecta las PCs por cable", "El que da acceso a internet", "El punto de acceso Wi-Fi", "El disco duro externo"], a: 0, fb: "El switch es el punto de encuentro del cableado: todas las PCs se conectan a él." },
      { type: "mc", q: "¿Qué permite la compartición de información en la red?", opts: ["Compartir carpetas y recursos como impresoras, con permisos adecuados", "Apagar los equipos a distancia sin permiso", "Ver las contraseñas de los demás usuarios", "Aumentar la velocidad del internet"], a: 0, fb: "Compartir permite usar carpetas e impresoras comunes, siempre con los permisos correctos." },
      { type: "order", q: "Ordena el montaje de la red del aula:", items: ["Instalar el switch", "Conectar las PCs con cable UTP", "Conectar el router al switch", "Configurar el access point", "Compartir carpetas y recursos"], fb: "Primero la infraestructura (switch y cableado), luego router e internet, después Wi-Fi y al final la compartición." },
      { type: "fill", q: "El ______ conecta redes entre sí y da acceso a internet.", answers: ["router", "enrutador"], fb: "El router une la red local con la del proveedor de internet." },
      { type: "tf", q: "El cable UTP de red usa conectores RJ45.", a: true, fb: "Correcto: el cable UTP (par trenzado) termina en conectores RJ45 para Ethernet." }
    ]
  },
  {
    id: 16,
    num: "16",
    title: "Protección de información e imágenes de seguridad",
    emoji: "🔐",
    module: "D",
    moduleName: "Salvaguarda de la información",
    color: "#7c3aed",
    date: "22/09/2026",
    goal: "Aplicas la protección de la información y creas imágenes de seguridad del sistema para la salvaguarda.",
    product: "Plan integral de mantenimiento y salvaguarda (imágenes de seguridad)",
    review: [
      { icon: "🔐", t: "¿Qué es la salvaguarda?", d: "La salvaguarda de la información consiste en protegerla ante pérdidas, daños o accesos no autorizados.", points: ["Es el objetivo final de todo el mantenimiento: que los datos del negocio estén seguros."] },
      { icon: "🛡️", t: "Antivirus y firewall", d: "Primera línea de defensa:", points: ["Antivirus: detecta y elimina software malicioso.", "Firewall: bloquea accesos no autorizados desde la red."] },
      { icon: "💾", t: "Respaldo periódico (backup)", d: "Copias de seguridad programadas de la información.", points: ["Frecuencia según la criticidad (diaria, semanal).", "Guardadas en un medio distinto al equipo."] },
      { icon: "🔑", t: "Contraseñas y control de acceso", d: "Solo acceden a la información quienes tienen permiso:", points: ["Contraseñas seguras y personales.", "Permisos por usuario o por grupo."] },
      { icon: "🖼️", t: "Imágenes de seguridad", d: "Una imagen es una COPIA EXACTA del sistema para restaurarlo ante una falla.", points: ["Herramientas: Clonezilla, Acronis, Windows Backup.", "Se guardan en un disco externo o en la red."] },
      { icon: "🏫", t: "Ejemplo aplicado", d: "Plan de salvaguarda del aula:", points: ["Imagen base de cada equipo con SO, drivers y ofimática instalados.", "Imagen actualizada cada mes en un disco externo.", "Ante una falla: restaurar la imagen y trabajar en minutos."] }
    ],
    tip: "Regla 3-2-1 para respaldos: 3 copias, en 2 medios distintos, y 1 guardada fuera del local.",
    questions: [
      { type: "mc", q: "¿Qué es una imagen de seguridad?", opts: ["Una copia exacta del sistema para restaurarlo ante una falla", "Una fotografía del equipo", "Un antivirus", "Un protector de pantalla"], a: 0, fb: "La imagen guarda el sistema completo (SO, drivers, programas y configuración) listo para restaurar." },
      { type: "mc", q: "¿Qué herramienta se usa para crear imágenes de seguridad?", opts: ["Clonezilla o Acronis", "CCleaner", "Defraggler", "El bloc de notas"], a: 0, fb: "Clonezilla (libre), Acronis y Windows Backup son las herramientas típicas de imágenes." },
      { type: "tf", q: "Las imágenes de seguridad se guardan en un disco externo o en la red.", a: true, fb: "Nunca en el mismo disco del sistema: si el disco falla, se pierde también la imagen." },
      { type: "match", q: "Relaciona cada amenaza con su protección:", pairs: [["Virus y malware", "Antivirus y firewall"], ["Acceso no autorizado", "Contraseñas y permisos"], ["Falla del disco duro", "Imagen de seguridad"], ["Pérdida de archivos", "Respaldo periódico"]], fb: "Virus → antivirus; intrusos → contraseñas; disco fallado → imagen; archivos → respaldo." },
      { type: "order", q: "Ordena el procedimiento de imágenes de seguridad:", items: ["Preparar el sistema (SO, drivers, programas)", "Crear la imagen con la herramienta", "Guardarla en disco externo o red", "Verificar que la imagen restaura correctamente", "Restaurar cuando ocurra una falla"], fb: "Preparar → crear → guardar fuera del equipo → verificar → restaurar cuando se necesite." },
      { type: "mc", img: '<svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Disco fallando y restauración de imagen"><rect x="20" y="20" width="170" height="90" rx="10" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/><circle cx="105" cy="65" r="26" fill="#fca5a5" stroke="#991b1b" stroke-width="2"/><text x="105" y="71" text-anchor="middle" font-size="20">💥</text><text x="105" y="126" text-anchor="middle" font-size="11" fill="#7f1d1d" font-weight="bold">DISCO CON FALLA</text><text x="255" y="60" font-size="26" text-anchor="middle">➡️</text><rect x="230" y="20" width="170" height="90" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/><rect x="246" y="40" width="138" height="20" rx="4" fill="#16a34a"/><text x="315" y="54" text-anchor="middle" font-size="9.5" fill="#fff" font-weight="bold">IMAGEN RESTAURADA</text><text x="315" y="88" text-anchor="middle" font-size="12" fill="#14532d" font-weight="bold">SISTEMA OK ✔</text><text x="315" y="126" text-anchor="middle" font-size="11" fill="#14532d" font-weight="bold">EQUIPO OPERATIVO</text></svg>', q: "Según la imagen, el disco falló. ¿Qué te permite volver a trabajar en minutos?", opts: ["Restaurar la imagen de seguridad", "Comprar un equipo nuevo", "Desfragmentar el disco", "Instalar un juego"], a: 0, fb: "Con la imagen de seguridad restaurada, el sistema vuelve a estar operativo en minutos." },
      { type: "fill", q: "La salvaguarda protege la información ante pérdidas, daños y accesos no ______.", answers: ["autorizados", "autorizado"], fb: "La salvaguarda cubre las tres amenazas: pérdida, daño y acceso indebido." },
      { type: "tf", q: "El firewall ayuda a bloquear accesos no autorizados desde la red.", a: true, fb: "El firewall filtra el tráfico de red y bloquea conexiones no autorizadas." }
    ]
  }
];
