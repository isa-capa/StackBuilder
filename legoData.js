/**
 * Catálogo granular de materias para el simulador StackBuilder.
 * Incluye bases técnicas, arquitectura estructural, calidad y un 
 * nuevo bloque dedicado a las Habilidades Blandas (Soft Skills).
 */
export const LEGO_CATALOG = {
  // ==========================================
  // BASES FUNDACIONALES (Ancho total: 240 -> Sub-bloques: 80)
  // ==========================================

  // --- JAVA CORE ---
  JAVA_OOP: {
    id: 'java_oop', parent: 'java_core', title: 'OOP & Sintaxis', category: 'base', color: '#3A86FF', width: 80, height: 50,
    description: 'Clases, interfaces, herencia, polimorfismo y encapsulamiento.',
    consequence: 'Sin orientación a objetos, tu código Java será un script inmanejable.'
  },
  JAVA_COLLECTIONS: {
    id: 'java_collections', parent: 'java_core', title: 'Colecciones & Lambdas', category: 'base', color: '#3A86FF', width: 80, height: 50,
    description: 'Listas, Mapas, Sets y programación funcional con Streams.',
    consequence: 'Sin colecciones, no podrás manipular ni transformar datos en memoria de forma eficiente.'
  },
  JAVA_MEMORY: {
    id: 'java_memory', parent: 'java_core', title: 'Memoria & Concurrencia', category: 'base', color: '#3A86FF', width: 80, height: 50,
    description: 'Garbage Collection, Multithreading y manejo del Heap/Stack.',
    consequence: 'Ignorar la memoria causará fugas y caídas del servidor bajo estrés (Out Of Memory).'
  },

  // --- BASES DE DATOS ---
  DB_MODELING: {
    id: 'db_modeling', parent: 'databases', title: 'Modelado Relacional', category: 'base', color: '#00B4D8', width: 80, height: 50,
    description: 'Diseño de entidades, normalización y diagramas ER.',
    consequence: 'Un mal modelo de datos condena al proyecto a la rigidez y la duplicación de información.'
  },
  DB_SQL: {
    id: 'db_sql', parent: 'databases', title: 'SQL & Consultas', category: 'base', color: '#00B4D8', width: 80, height: 50,
    description: 'JOINS, agrupaciones, subconsultas y optimización con índices.',
    consequence: 'Sin dominio de SQL, las consultas lentas destruirán la experiencia del usuario.'
  },
  DB_ACID: {
    id: 'db_acid', parent: 'databases', title: 'Transacciones (ACID)', category: 'base', color: '#00B4D8', width: 80, height: 50,
    description: 'Atomicidad, Consistencia, Aislamiento y Durabilidad.',
    consequence: 'Sin transacciones seguras, los pagos y datos críticos quedarán corruptos ante un error.'
  },

  // --- FUNDAMENTOS ---
  FUND_HTTP: {
    id: 'fund_http', parent: 'bases_fundamentals', title: 'Redes & HTTP', category: 'base', color: '#0077B6', width: 80, height: 50,
    description: 'Protocolos, DNS, códigos de estado y verbos HTTP.',
    consequence: 'Si no entiendes la red, no sabrás cómo se comunican tus aplicaciones con el mundo.'
  },
  FUND_OS: {
    id: 'fund_os', parent: 'bases_fundamentals', title: 'Terminal & OS', category: 'base', color: '#0077B6', width: 80, height: 50,
    description: 'Navegación POSIX, permisos de archivos y procesos del sistema.',
    consequence: 'Sin saber usar la terminal, estarás ciego al administrar servidores en la nube.'
  },
  FUND_ALGO: {
    id: 'fund_algo', parent: 'bases_fundamentals', title: 'Estructuras de Datos', category: 'base', color: '#0077B6', width: 80, height: 50,
    description: 'Algoritmos básicos, pilas, colas y complejidad (Big O).',
    consequence: 'Sin lógica fundamental, serás incapaz de resolver problemas de rendimiento.'
  },

  // ==========================================
  // ESTRUCTURA APLICATIVA (Ancho total: 180 -> Sub-bloques: 60)
  // ==========================================

  // --- FRONTEND CORE ---
  FRONT_HTML: {
    id: 'front_html', parent: 'frontend_core', title: 'HTML5 Semántico', category: 'structural', color: '#FFBE0B', width: 60, height: 50,
    description: 'Estructura accesible, SEO técnico y DOM inicial.',
    consequence: 'Sin semántica, los lectores de pantalla y buscadores ignorarán tu aplicación.'
  },
  FRONT_CSS: {
    id: 'front_css', parent: 'frontend_core', title: 'CSS3 & Flex/Grid', category: 'structural', color: '#FFBE0B', width: 60, height: 50,
    description: 'Diseño responsivo, variables y maquetación moderna.',
    consequence: 'Sin CSS sólido, la interfaz será un desastre visual en dispositivos móviles.'
  },
  FRONT_JS: {
    id: 'front_js', parent: 'frontend_core', title: 'JavaScript ES6+', category: 'structural', color: '#FFBE0B', width: 60, height: 50,
    description: 'Eventos, asincronía (Promesas/Fetch) y manipulación del DOM.',
    consequence: 'Sin JS nativo, la página será estática y no podrá interactuar con el usuario.'
  },

  // --- SPRING BOOT ---
  SPRING_CORE: {
    id: 'spring_core', parent: 'spring_boot', title: 'IoC & Beans', category: 'structural', color: '#FF006E', width: 60, height: 50,
    description: 'Inversión de Control, Inyección de Dependencias y contexto de Spring.',
    consequence: 'Sin IoC, tu código estará fuertemente acoplado y será un infierno mantenerlo.'
  },
  SPRING_WEB: {
    id: 'spring_web', parent: 'spring_boot', title: 'REST APIs (MVC)', category: 'structural', color: '#FF006E', width: 60, height: 50,
    description: 'Controladores, mapeo de rutas y manejo de respuestas JSON.',
    consequence: 'Sin Spring Web, tu backend no tiene puertas para comunicarse con el frontend.'
  },
  SPRING_DATA: {
    id: 'spring_data', parent: 'spring_boot', title: 'Spring Data JPA', category: 'structural', color: '#FF006E', width: 60, height: 50,
    description: 'Integración ORM con Hibernate y repositorios mágicos.',
    consequence: 'Sin JPA, escribirás miles de líneas de código SQL repetitivo y propenso a errores.'
  },

  // --- ARQUITECTURA ---
  ARCH_DESIGN: {
    id: 'arch_design', parent: 'architecture', title: 'Patrones de Diseño', category: 'structural', color: '#FB5607', width: 60, height: 50,
    description: 'Singleton, Factory, Builder y Strategy.',
    consequence: 'Ignorar patrones es reinventar la rueda cuadrada en cada problema complejo.'
  },
  ARCH_DDD: {
    id: 'arch_ddd', parent: 'architecture', title: 'Domain-Driven Design', category: 'structural', color: '#FB5607', width: 60, height: 50,
    description: 'Modelado basado en el dominio del negocio, contextos delimitados.',
    consequence: 'Si el código no refleja el lenguaje del negocio, el producto fracasa.'
  },
  ARCH_API: {
    id: 'arch_api', parent: 'architecture', title: 'Diseño de APIs REST', category: 'structural', color: '#FB5607', width: 60, height: 50,
    description: 'Niveles de madurez de Richardson, DTOs y versionado.',
    consequence: 'Una API mal diseñada romperá la integración con los clientes frontend y móviles.'
  },

  // --- REACT JS ---
  REACT_COMPONENTS: {
    id: 'react_components', parent: 'react_js', title: 'Componentes & JSX', category: 'structural', color: '#FF9F1C', width: 60, height: 50,
    description: 'Modularidad visual, props y sintaxis declarativa.',
    consequence: 'Sin modularidad, tu interfaz será un bloque de código monolítico e incomprensible.'
  },
  REACT_HOOKS: {
    id: 'react_hooks', parent: 'react_js', title: 'Hooks & Estado', category: 'structural', color: '#FF9F1C', width: 60, height: 50,
    description: 'useState, useEffect y ciclo de vida del cliente.',
    consequence: 'Un mal manejo del estado provocará que la interfaz no refleje los datos reales.'
  },
  REACT_STATE: {
    id: 'react_state', parent: 'react_js', title: 'Estado Global & APIs', category: 'structural', color: '#FF9F1C', width: 60, height: 50,
    description: 'Context API, Redux/Zustand y consumo de endpoints.',
    consequence: 'Sin estado global, pasarás datos entre componentes como una cadena humana ineficiente.'
  },

  // ==========================================
  // CALIDAD Y CONECTORES (Ancho total: 90 -> Sub-bloques: 30)
  // ==========================================

  // --- SCRUM ---
  SCRUM_ROLES: {
    id: 'scrum_roles', parent: 'scrum', title: 'Roles & Mindset', category: 'quality', color: '#8338EC', width: 30, height: 70,
    description: 'Scrum Master, Product Owner y Developers.',
    consequence: 'Sin roles claros, nadie sabe quién prioriza y quién construye.'
  },
  SCRUM_EVENTS: {
    id: 'scrum_events', parent: 'scrum', title: 'Sprints & Dailies', category: 'quality', color: '#8338EC', width: 30, height: 70,
    description: 'Ritmo de trabajo, inspección y adaptación diaria.',
    consequence: 'Sin eventos ágiles, los problemas se esconden hasta el final del proyecto.'
  },
  SCRUM_ART: {
    id: 'scrum_art', parent: 'scrum', title: 'Backlog & Historias', category: 'quality', color: '#8338EC', width: 30, height: 70,
    description: 'Product Backlog, Sprint Backlog y criterios de aceptación.',
    consequence: 'Sin un backlog claro, el equipo programará funcionalidades que el cliente no necesita.'
  },

  // --- TESTING ---
  TEST_UNIT: {
    id: 'test_unit', parent: 'testing', title: 'Pruebas Unitarias', category: 'quality', color: '#38B000', width: 30, height: 70,
    description: 'Aserciones y aislamiento de métodos (JUnit).',
    consequence: 'Sin aserciones, cada cambio de código es un salto al vacío.'
  },
  TEST_MOCK: {
    id: 'test_mock', parent: 'testing', title: 'Mocks & Spies', category: 'quality', color: '#38B000', width: 30, height: 70,
    description: 'Simulación de dependencias (Mockito).',
    consequence: 'Sin mocks, tus pruebas dependerán de bases de datos vivas, haciéndolas lentas y frágiles.'
  },
  TEST_TDD: {
    id: 'test_tdd', parent: 'testing', title: 'Metodología TDD', category: 'quality', color: '#38B000', width: 30, height: 70,
    description: 'Desarrollo guiado por pruebas (Red-Green-Refactor).',
    consequence: 'Escribir pruebas al final suele resultar en código acoplado y baja cobertura.'
  },

  // --- GIT ---
  GIT_BASICS: {
    id: 'git_basics', parent: 'git', title: 'Comandos Core', category: 'quality', color: '#70E000', width: 30, height: 70,
    description: 'Commit, push, pull, status y log.',
    consequence: 'Si no dominas el core, perderás tu progreso con un simple comando mal escrito.'
  },
  GIT_BRANCH: {
    id: 'git_branch', parent: 'git', title: 'Branching & Merge', category: 'quality', color: '#70E000', width: 30, height: 70,
    description: 'Gestión de ramas, GitFlow y resolución de conflictos.',
    consequence: 'Trabajar en la rama principal (main) destruirá el código en producción.'
  },
  GIT_PR: {
    id: 'git_pr', parent: 'git', title: 'Pull Requests', category: 'quality', color: '#70E000', width: 30, height: 70,
    description: 'Code reviews y trabajo asíncrono colaborativo.',
    consequence: 'Saltarse las revisiones de código introduce bugs y frena el aprendizaje del equipo.'
  },

  // --- DEV_OPS ---
  OPS_DOCKER: {
    id: 'ops_docker', parent: 'dev_ops', title: 'Contenedores', category: 'quality', color: '#9D4EDD', width: 30, height: 70,
    description: 'Imágenes, Dockerfile y aislamiento de entornos.',
    consequence: 'Sin contenedores, tu aplicación sufrirá el "en mi máquina sí funciona".'
  },
  OPS_CICD: {
    id: 'ops_cicd', parent: 'dev_ops', title: 'Pipelines CI/CD', category: 'quality', color: '#9D4EDD', width: 30, height: 70,
    description: 'Integración continua y automatización de tests.',
    consequence: 'Desplegar a mano es lento, tedioso y altamente propenso a errores humanos.'
  },
  OPS_DEPLOY: {
    id: 'ops_deploy', parent: 'dev_ops', title: 'Despliegues', category: 'quality', color: '#9D4EDD', width: 30, height: 70,
    description: 'Servidores nube, IaaS, PaaS (AWS, Heroku).',
    consequence: 'Un código que no llega a producción de forma segura no genera valor al cliente.'
  },

  // --- SECURITY ---
  SEC_AUTHN: {
    id: 'sec_authn', parent: 'security', title: 'Autenticación', category: 'quality', color: '#E0115F', width: 30, height: 70,
    description: 'Login, contraseñas encriptadas y validación de identidad.',
    consequence: 'Cualquiera podrá hacerse pasar por un usuario legítimo en el sistema.'
  },
  SEC_AUTHZ: {
    id: 'sec_authz', parent: 'security', title: 'Autorización (Roles)', category: 'quality', color: '#E0115F', width: 30, height: 70,
    description: 'Control de acceso basado en roles (RBAC) a endpoints.',
    consequence: 'Un usuario normal podría acceder a paneles de administración y borrar datos.'
  },
  SEC_JWT: {
    id: 'sec_jwt', parent: 'security', title: 'Tokens & JWT', category: 'quality', color: '#E0115F', width: 30, height: 70,
    description: 'Tokens stateless para mantener sesiones seguras en APIs.',
    consequence: 'El robo de sesiones pondrá en jaque toda la plataforma.'
  },

  // ==========================================
  // HABILIDADES BLANDAS (Piezas conectores: pequeñas, ancho: 30)
  // ==========================================

  SOFT_TEAMWORK: {
    id: 'soft_teamwork', parent: 'soft_skills', title: 'Trabajo en Equipo', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Capacidad de colaborar, delegar y confiar en los compañeros.',
    consequence: 'Un desarrollador solitario rara vez escala proyectos grandes.'
  },
  SOFT_COMMUNICATION: {
    id: 'soft_comm', parent: 'soft_skills', title: 'Comunicación Asertiva', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Expresar ideas técnicas de forma clara a perfiles no técnicos.',
    consequence: 'Si no puedes explicar tu código, tu solución no será valorada por el negocio.'
  },
  SOFT_PROACTIVITY: {
    id: 'soft_proact', parent: 'soft_skills', title: 'Proactividad', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Anticiparse a los problemas y proponer mejoras activamente.',
    consequence: 'Esperar a que te digan qué hacer te estancará en posiciones junior.'
  },
  SOFT_PROBLEM_SOLVING: {
    id: 'soft_problem', parent: 'soft_skills', title: 'Resolución de Problemas', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Pensamiento lateral para destrabar bloqueos lógicos.',
    consequence: 'Rendirse ante el primer error de consola frena por completo el desarrollo.'
  },
  SOFT_ADAPTABILITY: {
    id: 'soft_adapt', parent: 'soft_skills', title: 'Adaptabilidad', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Flexibilidad ante cambios repentinos en los requerimientos.',
    consequence: 'La frustración ante el cambio genera fricción y retrasa las entregas.'
  },
  SOFT_TIME_MGMT: {
    id: 'soft_time', parent: 'soft_skills', title: 'Gestión del Tiempo', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Priorización de tareas y respeto por los tiempos de entrega (Timeboxing).',
    consequence: 'El código perfecto que se entrega un mes tarde no le sirve a la empresa.'
  },
  SOFT_CRITICAL: {
    id: 'soft_critical', parent: 'soft_skills', title: 'Pensamiento Crítico', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Cuestionar si la tecnología elegida realmente resuelve el problema de negocio.',
    consequence: 'Implementar herramientas de moda sin justificación crea deuda técnica.'
  },
  SOFT_EMPATHY: {
    id: 'soft_empathy', parent: 'soft_skills', title: 'Empatía', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Entender al usuario final y a los compañeros de equipo en momentos de presión.',
    consequence: 'Ignorar la experiencia del usuario resulta en productos hostiles y poco usados.'
  },
  SOFT_LEARNING: {
    id: 'soft_learning', parent: 'soft_skills', title: 'Aprendizaje Continuo', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Autodidactismo y capacidad de leer documentación oficial.',
    consequence: 'En tecnología, quien deja de aprender se vuelve obsoleto en menos de dos años.'
  },
  SOFT_FEEDBACK: {
    id: 'soft_feedback', parent: 'soft_skills', title: 'Recepción de Feedback', category: 'soft', color: '#2A9D8F', width: 30, height: 70,
    description: 'Aceptar correcciones en Code Reviews sin tomarlo como un ataque personal.',
    consequence: 'El ego inflado impide mejorar la calidad del código y daña el ambiente laboral.'
  }
};

/**
 * Mapa de ponderación de estabilidad profesional.
 * Cada bloque tiene un peso que indica su impacto en la "Estabilidad del Sistema"
 * al ser eliminado. Los cimientos técnicos valen más porque sin ellos
 * el resto del ecosistema colapsa.
 *
 * Pesos por categoría:
 *   Bases Fundacionales  → 4-7 puntos (cimientos críticos)
 *   Estructura Aplicativa → 3-5 puntos (tecnologías aplicadas)
 *   Calidad y Conectores  → 1-3 puntos (prácticas profesionales)
 *   Habilidades Blandas   → 1 punto   (complemento humano)
 *
 * Peso total del ecosistema completo: 124 puntos = 100% estabilidad.
 */
export const BLOCK_WEIGHTS = {
  // === BASES FUNDACIONALES (4-7 pts) ===
  // --- Java Core ---
  'java_oop': 7,              // OOP es la piedra angular de todo Java
  'java_collections': 5,      // Colecciones y Streams son uso diario
  'java_memory': 5,           // Memoria/concurrencia evitan caídas en producción
  // --- Bases de Datos ---
  'db_modeling': 5,           // Un mal modelo condena al proyecto
  'db_sql': 6,                // SQL es indispensable para cualquier backend
  'db_acid': 4,               // Transacciones garantizan integridad
  // --- Fundamentos ---
  'fund_http': 5,             // Sin HTTP no hay comunicación web
  'fund_os': 4,               // Terminal es imprescindible en servidores
  'fund_algo': 5,             // Algoritmos resuelven problemas de rendimiento

  // === ESTRUCTURA APLICATIVA (3-5 pts) ===
  // --- Frontend Core ---
  'front_html': 3,            // Estructura semántica del DOM
  'front_css': 3,             // Maquetación y diseño responsivo
  'front_js': 4,              // JS es la base de todo frontend moderno
  // --- Spring Boot ---
  'spring_core': 5,           // IoC es la columna vertebral de Spring
  'spring_web': 4,            // REST APIs conectan frontend con backend
  'spring_data': 3,           // JPA simplifica la persistencia
  // --- Arquitectura ---
  'arch_design': 3,           // Patrones de diseño evitan código espagueti
  'arch_ddd': 3,              // DDD alinea código con negocio
  'arch_api': 3,              // API REST bien diseñada es integración limpia
  // --- React JS ---
  'react_components': 3,      // Componentización modular
  'react_hooks': 3,           // Estado y ciclo de vida del cliente
  'react_state': 3,           // Estado global y consumo de APIs

  // === CALIDAD Y CONECTORES (1-3 pts) ===
  // --- Scrum ---
  'scrum_roles': 1,           // Roles del equipo ágil
  'scrum_events': 1,          // Ceremonias y cadencia
  'scrum_art': 1,             // Backlog y planificación
  // --- Testing ---
  'test_unit': 3,             // Testing unitario es la red de seguridad
  'test_mock': 2,             // Mocks aíslan dependencias
  'test_tdd': 2,              // TDD mejora el diseño del código
  // --- Git ---
  'git_basics': 3,            // Git es herramienta diaria obligatoria
  'git_branch': 2,            // Branching organiza el trabajo en equipo
  'git_pr': 1,                // PRs fomentan calidad colaborativa
  // --- DevOps ---
  'ops_docker': 2,            // Contenedores garantizan portabilidad
  'ops_cicd': 2,              // CI/CD automatiza entregas
  'ops_deploy': 1,            // Despliegue a producción
  // --- Seguridad ---
  'sec_authn': 3,             // Autenticación protege identidad
  'sec_authz': 2,             // Autorización protege recursos
  'sec_jwt': 2,               // JWT es estándar para sesiones API

  // === HABILIDADES BLANDAS (1 pt cada una) ===
  'soft_teamwork': 1,
  'soft_comm': 1,
  'soft_proact': 1,
  'soft_problem': 1,
  'soft_adapt': 1,
  'soft_time': 1,
  'soft_critical': 1,
  'soft_empathy': 1,
  'soft_learning': 1,
  'soft_feedback': 1,
};

/**
 * Materias críticas. (Las soft skills suman estabilidad general, 
 * pero los pilares técnicos siguen siendo el punto crítico de fallo instantáneo).
 */
export const CRITICAL_SUBJECTS = [
  'java_oop',
  'spring_core',
  'db_modeling',
  'front_html',
  'sec_authn'
];