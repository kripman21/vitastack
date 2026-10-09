import { User, Task, DailyCheckIn } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Dra. Aris Thorne',
    email: 'aris.thorne@biocluster.io',
    role: 'MANAGER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    initials: 'AT',
    specialty: 'Directora de Operaciones & Telemetría BioCluster',
    department: 'Dirección Operativa',
    currentEnergy: 84, // Batería: 84%
    burnoutScore: 12,  // Burnout: 12% Bajo
    burnoutCategory: 'Bajo',
    moodLabel: 'Enfocado',
    moodType: 'enfocado',
    maxEnergy: 100,
    sleepHours: 8.0,
    stressLevel: 1,
    status: 'active',
    lastCheckIn: '2026-10-08T08:00:00Z',
    energyHistory: [
      { date: 'Lun', value: 85 },
      { date: 'Mar', value: 82 },
      { date: 'Mié', value: 88 },
      { date: 'Jue', value: 84 },
      { date: 'Hoy', value: 84 }
    ]
  },
  {
    id: 'usr-2',
    name: 'Lucas Morales',
    email: 'lucas.morales@biocluster.io',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'LM',
    specialty: 'Sr. Backend Specialist',
    department: 'Backend Engineering',
    currentEnergy: 22, // Batería: 22%
    burnoutScore: 78,  // Burnout: 78% Sobrecarga
    burnoutCategory: 'Sobrecarga',
    moodLabel: 'Fatiga Operativa',
    moodType: 'burnout',
    maxEnergy: 100,
    sleepHours: 4.8,
    stressLevel: 5,
    status: 'deep_work',
    lastCheckIn: '2026-10-08T09:10:00Z',
    energyHistory: [
      { date: 'Lun', value: 50 },
      { date: 'Mar', value: 40 },
      { date: 'Mié', value: 32 },
      { date: 'Jue', value: 26 },
      { date: 'Hoy', value: 22 }
    ]
  },
  {
    id: 'usr-3',
    name: 'Sofia Chen',
    email: 'sofia.chen@biocluster.io',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    initials: 'SC',
    specialty: 'Genomics Data Scientist',
    department: 'Algoritmos & Síntesis',
    currentEnergy: 78, // Batería: 78%
    burnoutScore: 22,  // Burnout: 22% Saludable
    burnoutCategory: 'Saludable',
    moodLabel: 'Óptimo',
    moodType: 'optimo',
    maxEnergy: 100,
    sleepHours: 7.5,
    stressLevel: 2,
    status: 'active',
    lastCheckIn: '2026-10-08T08:30:00Z',
    energyHistory: [
      { date: 'Lun', value: 76 },
      { date: 'Mar', value: 80 },
      { date: 'Mié', value: 77 },
      { date: 'Jue', value: 79 },
      { date: 'Hoy', value: 78 }
    ]
  },
  {
    id: 'usr-4',
    name: 'Marcos Rivas',
    email: 'marcos.rivas@biocluster.io',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'MR',
    specialty: 'Frontend Lead',
    department: 'Bio-Interfaces',
    currentEnergy: 45, // Batería: 45%
    burnoutScore: 55,  // Burnout: 55% Precaución
    burnoutCategory: 'Precaución',
    moodLabel: 'Fatiga',
    moodType: 'fatiga',
    maxEnergy: 100,
    sleepHours: 6.0,
    stressLevel: 3,
    status: 'active',
    lastCheckIn: '2026-10-08T08:45:00Z',
    energyHistory: [
      { date: 'Lun', value: 65 },
      { date: 'Mar', value: 58 },
      { date: 'Mié', value: 50 },
      { date: 'Jue', value: 47 },
      { date: 'Hoy', value: 45 }
    ]
  },
  {
    id: 'usr-5',
    name: 'Dra. Valeria Ortiz',
    email: 'valeria.ortiz@biocluster.io',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initials: 'VO',
    specialty: 'Bio-QA Lead',
    department: 'Compliance & Bio-QA',
    currentEnergy: 82, // Batería: 82%
    burnoutScore: 18,  // Burnout: 18% Saludable
    burnoutCategory: 'Saludable',
    moodLabel: 'Óptimo',
    moodType: 'optimo',
    maxEnergy: 100,
    sleepHours: 7.8,
    stressLevel: 2,
    status: 'active',
    lastCheckIn: '2026-10-08T07:50:00Z',
    energyHistory: [
      { date: 'Lun', value: 80 },
      { date: 'Mar', value: 84 },
      { date: 'Mié', value: 81 },
      { date: 'Jue', value: 83 },
      { date: 'Hoy', value: 82 }
    ]
  },
  {
    id: 'usr-6',
    name: 'Diego Méndez',
    email: 'diego.mendez@biocluster.io',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    initials: 'DM',
    specialty: 'Hardware & IoT Engineer',
    department: 'Bio-Hardware & Sensores',
    currentEnergy: 66, // Batería: 66%
    burnoutScore: 34,  // Burnout: 34% Normal
    burnoutCategory: 'Saludable',
    moodLabel: 'Enfocado',
    moodType: 'enfocado',
    maxEnergy: 100,
    sleepHours: 7.0,
    stressLevel: 2,
    status: 'active',
    lastCheckIn: '2026-10-08T08:15:00Z',
    energyHistory: [
      { date: 'Lun', value: 70 },
      { date: 'Mar', value: 68 },
      { date: 'Mié', value: 65 },
      { date: 'Jue', value: 67 },
      { date: 'Hoy', value: 66 }
    ]
  },
  {
    id: 'usr-7',
    name: 'Camila Torres',
    email: 'camila.torres@biocluster.io',
    role: 'MEMBER',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    initials: 'CT',
    specialty: 'Bioinformatics Specialist',
    department: 'Algoritmos & Síntesis',
    currentEnergy: 58, // Batería: 58%
    burnoutScore: 42,  // Burnout: 42% Normal
    burnoutCategory: 'Saludable',
    moodLabel: 'Enfocado',
    moodType: 'enfocado',
    maxEnergy: 100,
    sleepHours: 6.8,
    stressLevel: 3,
    status: 'active',
    lastCheckIn: '2026-10-08T08:20:00Z',
    energyHistory: [
      { date: 'Lun', value: 62 },
      { date: 'Mar', value: 60 },
      { date: 'Mié', value: 57 },
      { date: 'Jue', value: 59 },
      { date: 'Hoy', value: 58 }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  // Exact tasks from Image 1 ("Tareas Próximas a Vencer")
  {
    id: 'BIO-128',
    title: 'Refactorizar telemetría de pulso y batería vital',
    description: 'Actualizar controladores MQTT y optimizar serialización en búferes de baja latencia para pulso cardíaco.',
    status: 'EN_PROGRESO',
    priority: 'URGENTE',
    assigneeId: 'usr-2', // Lucas Morales
    createdById: 'usr-1',
    energyCost: 30,
    tags: ['Bio-Pipeline', 'Hardware', 'Backend'],
    subtasks: [
      { id: 'sub-1', title: 'Comprobar frecuencia de muestreo 250Hz', completed: true },
      { id: 'sub-2', title: 'Filtrar artefactos biométricos de ruido', completed: false }
    ],
    dueDate: '2026-10-09',
    vencimientoLabel: 'Mañana (Urgente)',
    createdAt: '2026-10-05T10:00:00Z',
    estimatedHours: 12
  },
  {
    id: 'BIO-142',
    title: 'Optimizar pipeline de síntesis genómica distribuida',
    description: 'Alinear particionamiento k-mer en cluster HPC Slurm reduciendo cuellos de botella en memoria.',
    status: 'EN_PROGRESO',
    priority: 'ALTA',
    assigneeId: 'usr-3', // Sofia Chen
    createdById: 'usr-1',
    energyCost: 20,
    tags: ['Genómica', 'Bio-Pipeline'],
    subtasks: [
      { id: 'sub-3', title: 'Descargar genoma de referencia GRCh38', completed: true },
      { id: 'sub-4', title: 'Ejecutar benchmark de particionamiento', completed: true }
    ],
    dueDate: '2026-10-10',
    vencimientoLabel: 'En 2 días',
    createdAt: '2026-10-04T11:00:00Z',
    estimatedHours: 14
  },
  {
    id: 'BIO-118',
    title: 'Validar microservicios de secuenciación con HL7 FHIR',
    description: 'Comprobar interoperabilidad con historiales clínicos electrónicos y cumplimiento de endpoints HL7 FHIR R4.',
    status: 'EN_REVISION',
    priority: 'ALTA',
    assigneeId: 'usr-4', // Marcos Rivas
    createdById: 'usr-1',
    energyCost: 25,
    tags: ['Frontend', 'Seguridad'],
    subtasks: [
      { id: 'sub-5', title: 'Mapear recursos Observation y DiagnosticReport', completed: true },
      { id: 'sub-6', title: 'Pruebas de compatibilidad con servidor HAPI FHIR', completed: true }
    ],
    dueDate: '2026-10-11',
    vencimientoLabel: 'En 3 días',
    createdAt: '2026-10-03T09:30:00Z',
    estimatedHours: 10
  },
  {
    id: 'BIO-134',
    title: 'Implementar autenticación WebAuthn FIDO2',
    description: 'Proteger el portal de acceso con biometría de llave de seguridad hardware y passkeys.',
    status: 'POR_HACER',
    priority: 'MEDIA',
    assigneeId: 'usr-2', // Lucas Morales
    createdById: 'usr-1',
    energyCost: 15,
    tags: ['Seguridad', 'DevOps'],
    subtasks: [
      { id: 'sub-7', title: 'Configurar desafío WebAuthn en backend Express', completed: false },
      { id: 'sub-8', title: 'Validar firmas criptográficas de attestación', completed: false }
    ],
    dueDate: '2026-10-28',
    vencimientoLabel: '28 Oct',
    createdAt: '2026-10-06T15:00:00Z',
    estimatedHours: 8
  },
  {
    id: 'BIO-112',
    title: 'Soporte offline para ingesta biométrica PWA',
    description: 'Almacenar en caché local con IndexedDB los registros biométricos durante pérdidas de conectividad en laboratorio.',
    status: 'EN_PROGRESO',
    priority: 'MEDIA',
    assigneeId: 'usr-5', // Dra. Valeria Ortiz
    createdById: 'usr-1',
    energyCost: 15,
    tags: ['Frontend', 'Hardware'],
    subtasks: [
      { id: 'sub-9', title: 'Configurar Service Worker Workbox', completed: true },
      { id: 'sub-10', title: 'Mecanismo de sincronización en segundo plano', completed: false }
    ],
    dueDate: '2026-10-29',
    vencimientoLabel: '29 Oct',
    createdAt: '2026-10-07T08:00:00Z',
    estimatedHours: 8
  },

  // Additional tasks for Lucas Morales (8 total to match cards: 5 prog, 2 rev, 1 por hacer)
  {
    id: 'BIO-125',
    title: 'Ajuste de pools de conexión en PostgreSQL Cloud SQL',
    description: 'Configurar PgBouncer para mitigar saturación de sockets durante picos de secuenciación.',
    status: 'EN_PROGRESO',
    priority: 'ALTA',
    assigneeId: 'usr-2',
    createdById: 'usr-1',
    energyCost: 20,
    tags: ['DevOps', 'Backend'],
    subtasks: [{ id: 'sub-11', title: 'Stress test con 500 conexiones concurrentes', completed: true }],
    dueDate: '2026-10-18',
    vencimientoLabel: '18 Oct',
    createdAt: '2026-10-02T10:00:00Z',
    estimatedHours: 6
  },
  {
    id: 'BIO-126',
    title: 'Indexación FASTA en memoria compartida Rust',
    description: 'Reescribir parser de cabeceras en biblioteca nativa de Rust invocada por FFI.',
    status: 'EN_PROGRESO',
    priority: 'CRITICA',
    assigneeId: 'usr-2',
    createdById: 'usr-1',
    energyCost: 25,
    tags: ['Bio-Pipeline', 'Backend'],
    subtasks: [{ id: 'sub-12', title: 'Zero-copy buffer allocation', completed: true }],
    dueDate: '2026-10-14',
    vencimientoLabel: '14 Oct',
    createdAt: '2026-10-01T12:00:00Z',
    estimatedHours: 16
  },
  {
    id: 'BIO-127',
    title: 'Compresión de lecturas VCF con códec Zstandard',
    description: 'Reducir footprint de almacenamiento en frío para 5TB de datos genómicos.',
    status: 'EN_PROGRESO',
    priority: 'MEDIA',
    assigneeId: 'usr-2',
    createdById: 'usr-2',
    energyCost: 15,
    tags: ['Genómica', 'Backend'],
    subtasks: [{ id: 'sub-13', title: 'Validar ratio de compresión > 4.2x', completed: false }],
    dueDate: '2026-10-22',
    vencimientoLabel: '22 Oct',
    createdAt: '2026-10-04T14:00:00Z',
    estimatedHours: 8
  },
  {
    id: 'BIO-129',
    title: 'Auditoría de logs de acceso a muestras biológicas',
    description: 'Revisión por pares de auditorías de trazabilidad de cadenas genómicas.',
    status: 'EN_REVISION',
    priority: 'ALTA',
    assigneeId: 'usr-2',
    createdById: 'usr-1',
    energyCost: 15,
    tags: ['Seguridad', 'Backend'],
    subtasks: [{ id: 'sub-14', title: 'Reporte de conformidad HIPAA', completed: true }],
    dueDate: '2026-10-16',
    vencimientoLabel: '16 Oct',
    createdAt: '2026-10-05T09:00:00Z',
    estimatedHours: 5
  },
  {
    id: 'BIO-130',
    title: 'Actualización de certificados mTLS en API Gateway',
    description: 'Renovación de certificados de cifrado mutuo entre servicios de bio-computación.',
    status: 'EN_REVISION',
    priority: 'MEDIA',
    assigneeId: 'usr-2',
    createdById: 'usr-1',
    energyCost: 10,
    tags: ['Seguridad', 'DevOps'],
    subtasks: [{ id: 'sub-15', title: 'Despliegue sin caída de tráfico en clúster', completed: true }],
    dueDate: '2026-10-15',
    vencimientoLabel: '15 Oct',
    createdAt: '2026-10-06T11:00:00Z',
    estimatedHours: 4
  },

  // Tasks for Dra. Aris Thorne (Manager: 6 total: 3 prog, 1 rev, 2 completadas)
  {
    id: 'BIO-101',
    title: 'Supervisión de Despliegue de Sprint 34: Bio-Sync Engine',
    description: 'Alineación de objetivos de resiliencia y telemetría de esfuerzo con directores científicos.',
    status: 'EN_PROGRESO',
    priority: 'CRITICA',
    assigneeId: 'usr-1', // Manager
    createdById: 'usr-1',
    energyCost: 15,
    tags: ['Bio-Sync', 'Dirección Operativa' as any],
    subtasks: [
      { id: 'sub-16', title: 'Reunión de balance biométrico con leads', completed: true },
      { id: 'sub-17', title: 'Aprobación de umbrales de fatiga de sprint', completed: true }
    ],
    dueDate: '2026-10-12',
    vencimientoLabel: '12 Oct',
    createdAt: '2026-10-04T08:00:00Z',
    estimatedHours: 10
  },
  {
    id: 'BIO-102',
    title: 'Estrategia de Rebalanceo de Carga para Especialistas',
    description: 'Establecer políticas de descompresión para evitar saturación en el equipo backend y genómica.',
    status: 'EN_PROGRESO',
    priority: 'ALTA',
    assigneeId: 'usr-1',
    createdById: 'usr-1',
    energyCost: 15,
    tags: ['Bio-Sync', 'DevOps'],
    subtasks: [
      { id: 'sub-18', title: 'Monitorear índice de fatiga de Lucas Morales', completed: true },
      { id: 'sub-19', title: 'Habilitar relevos preventivos automáticos', completed: false }
    ],
    dueDate: '2026-10-15',
    vencimientoLabel: '15 Oct',
    createdAt: '2026-10-05T09:00:00Z',
    estimatedHours: 6
  },
  {
    id: 'BIO-103',
    title: 'Auditoría de Cumplimiento Regulatorio FDA / EMA',
    description: 'Validar expedientes de trazabilidad de datos de secuenciación clínica.',
    status: 'EN_PROGRESO',
    priority: 'MEDIA',
    assigneeId: 'usr-1',
    createdById: 'usr-1',
    energyCost: 10,
    tags: ['Seguridad'],
    subtasks: [{ id: 'sub-20', title: 'Revisión final de sign-off técnico', completed: false }],
    dueDate: '2026-10-20',
    vencimientoLabel: '20 Oct',
    createdAt: '2026-10-06T10:00:00Z',
    estimatedHours: 8
  },
  {
    id: 'BIO-104',
    title: 'Revisión del Informe de Rendimiento Semanal de Laboratorio',
    description: 'Consolidar métricas de tareas completadas y horas invertidas por departamento.',
    status: 'EN_REVISION',
    priority: 'ALTA',
    assigneeId: 'usr-1',
    createdById: 'usr-1',
    energyCost: 10,
    tags: ['Bio-Sync'],
    subtasks: [{ id: 'sub-21', title: 'Generar gráficas de dispersión', completed: true }],
    dueDate: '2026-10-11',
    vencimientoLabel: '11 Oct',
    createdAt: '2026-10-07T11:00:00Z',
    estimatedHours: 4
  },
  {
    id: 'BIO-105',
    title: 'Aprobación de Presupuesto para Nodos GPU H100',
    description: 'Autorizar adquisición de capacidad de cómputo para modelos de difusión molecular.',
    status: 'COMPLETADA',
    priority: 'MEDIA',
    assigneeId: 'usr-1',
    createdById: 'usr-1',
    energyCost: 10,
    tags: ['Hardware', 'DevOps'],
    subtasks: [{ id: 'sub-22', title: 'Firma de acuerdo con proveedor de cloud', completed: true }],
    dueDate: '2026-10-05',
    vencimientoLabel: '5 Oct',
    createdAt: '2026-09-29T10:00:00Z',
    estimatedHours: 4,
    completedAt: '2026-10-05T17:00:00Z'
  },
  {
    id: 'BIO-106',
    title: 'Diseño de la Matriz de Permisos RBAC BioCluster v2.4',
    description: 'Modelado y validación de privilegios de acceso para roles Manager y Member.',
    status: 'COMPLETADA',
    priority: 'CRITICA',
    assigneeId: 'usr-1',
    createdById: 'usr-1',
    energyCost: 15,
    tags: ['Seguridad', 'DevOps'],
    subtasks: [{ id: 'sub-23', title: 'Desplegar directivas de autorización', completed: true }],
    dueDate: '2026-10-06',
    vencimientoLabel: '6 Oct',
    createdAt: '2026-09-30T10:00:00Z',
    estimatedHours: 12,
    completedAt: '2026-10-06T18:00:00Z'
  },

  // Sofia Chen additional tasks
  {
    id: 'BIO-143',
    title: 'Clustering de secuencias scRNA-seq con UMAP',
    description: 'Procesamiento de 80.000 células individuales para perfilar subpoblaciones tumorales.',
    status: 'EN_PROGRESO',
    priority: 'ALTA',
    assigneeId: 'usr-3',
    createdById: 'usr-1',
    energyCost: 20,
    tags: ['Genómica', 'AI Model'],
    subtasks: [{ id: 'sub-24', title: 'Calcular dimensiones PCA', completed: true }],
    dueDate: '2026-10-17',
    vencimientoLabel: '17 Oct',
    createdAt: '2026-10-05T14:00:00Z',
    estimatedHours: 12
  },
  {
    id: 'BIO-144',
    title: 'Limpieza de lecturas Novaseq con FastQC',
    description: 'Remover lecturas cortas y adaptadores Illumina en 32 muestras de tejido pulmonar.',
    status: 'POR_HACER',
    priority: 'MEDIA',
    assigneeId: 'usr-3',
    createdById: 'usr-1',
    energyCost: 10,
    tags: ['Genómica', 'Bio-Pipeline'],
    subtasks: [{ id: 'sub-25', title: 'Generar reporte multiQC', completed: false }],
    dueDate: '2026-10-25',
    vencimientoLabel: '25 Oct',
    createdAt: '2026-10-07T12:00:00Z',
    estimatedHours: 6
  },
  {
    id: 'BIO-145',
    title: 'Publicación de dataset de variantes genéticas raras',
    description: 'Subir archivo anotado VCF a repositorio de acceso controlado.',
    status: 'POR_HACER',
    priority: 'BAJA',
    assigneeId: 'usr-3',
    createdById: 'usr-3',
    energyCost: 10,
    tags: ['Genómica'],
    subtasks: [{ id: 'sub-26', title: 'Verificar anonimización', completed: false }],
    dueDate: '2026-10-30',
    vencimientoLabel: '30 Oct',
    createdAt: '2026-10-08T09:00:00Z',
    estimatedHours: 4
  },

  // Marcos Rivas additional tasks (Frontend Lead)
  {
    id: 'BIO-119',
    title: 'Componente interactivo del mapa de concentración de tareas',
    description: 'Matriz estilo GitHub con 7 filas y niveles de saturación en cian para sprints.',
    status: 'EN_PROGRESO',
    priority: 'ALTA',
    assigneeId: 'usr-4',
    createdById: 'usr-1',
    energyCost: 20,
    tags: ['Frontend'],
    subtasks: [{ id: 'sub-27', title: 'Animaciones de tooltip con datos de jornada', completed: true }],
    dueDate: '2026-10-13',
    vencimientoLabel: '13 Oct',
    createdAt: '2026-10-05T15:00:00Z',
    estimatedHours: 10
  },
  {
    id: 'BIO-120',
    title: 'Optimización de renderizado para 100k registros biométricos',
    description: 'Implementar virtual scrolling en la vista de lista detallada del equipo.',
    status: 'EN_PROGRESO',
    priority: 'MEDIA',
    assigneeId: 'usr-4',
    createdById: 'usr-4',
    energyCost: 15,
    tags: ['Frontend'],
    subtasks: [{ id: 'sub-28', title: 'Test de 60fps con DevTools', completed: false }],
    dueDate: '2026-10-16',
    vencimientoLabel: '16 Oct',
    createdAt: '2026-10-06T16:00:00Z',
    estimatedHours: 8
  },
  {
    id: 'BIO-121',
    title: 'Revisión de accesibilidad WCAG AAA en tema Dark Biotech',
    description: 'Comprobar ratios de contraste de colores cian y púrpura contra fondos de pizarra.',
    status: 'EN_REVISION',
    priority: 'MEDIA',
    assigneeId: 'usr-4',
    createdById: 'usr-1',
    energyCost: 10,
    tags: ['Frontend'],
    subtasks: [{ id: 'sub-29', title: 'Ajustar tokens de color de alto contraste', completed: true }],
    dueDate: '2026-10-12',
    vencimientoLabel: '12 Oct',
    createdAt: '2026-10-07T14:00:00Z',
    estimatedHours: 5
  },

  // Diego Méndez (Hardware & IoT)
  {
    id: 'BIO-150',
    title: 'Calibración de transductores térmicos de Biorreactor Bio-X3',
    description: 'Corregir deriva en los sensores ópticos de pH y concentración de oxígeno disuelto.',
    status: 'EN_PROGRESO',
    priority: 'MEDIA',
    assigneeId: 'usr-6',
    createdById: 'usr-1',
    energyCost: 15,
    tags: ['Hardware'],
    subtasks: [{ id: 'sub-30', title: 'Pruebas de tolerancia térmica', completed: true }],
    dueDate: '2026-10-15',
    vencimientoLabel: '15 Oct',
    createdAt: '2026-10-04T10:00:00Z',
    estimatedHours: 8
  },
  {
    id: 'BIO-151',
    title: 'Firmware de telemetría BLE para bandas de esfuerzo',
    description: 'Actualización OTA de firmware para medir pulsaciones y variabilidad cardíaca.',
    status: 'EN_PROGRESO',
    priority: 'ALTA',
    assigneeId: 'usr-6',
    createdById: 'usr-6',
    energyCost: 20,
    tags: ['Hardware', 'DevOps'],
    subtasks: [{ id: 'sub-31', title: 'Validar cifrado AES-128 en canal Bluetooth', completed: false }],
    dueDate: '2026-10-19',
    vencimientoLabel: '19 Oct',
    createdAt: '2026-10-06T11:00:00Z',
    estimatedHours: 12
  },
  {
    id: 'BIO-152',
    title: 'Benchmarking de latencia en bus CAN-bus industrial',
    description: 'Medición de retardos de transmisión en incubadoras de cultivo celular continuo.',
    status: 'EN_REVISION',
    priority: 'BAJA',
    assigneeId: 'usr-6',
    createdById: 'usr-1',
    energyCost: 10,
    tags: ['Hardware'],
    subtasks: [{ id: 'sub-32', title: 'Documentar histograma de latencias', completed: true }],
    dueDate: '2026-10-21',
    vencimientoLabel: '21 Oct',
    createdAt: '2026-10-07T13:00:00Z',
    estimatedHours: 6
  },

  // Camila Torres (Bioinformatics)
  {
    id: 'BIO-160',
    title: 'Anotación funcional de mutaciones oncogénicas con VEP',
    description: 'Ejecución de Variant Effect Predictor sobre 1.200 muestras exómicas de validación.',
    status: 'EN_PROGRESO',
    priority: 'ALTA',
    assigneeId: 'usr-7',
    createdById: 'usr-1',
    energyCost: 20,
    tags: ['Genómica', 'Bio-Pipeline'],
    subtasks: [{ id: 'sub-33', title: 'Anotar con bases de datos ClinVar y COSMIC', completed: true }],
    dueDate: '2026-10-14',
    vencimientoLabel: '14 Oct',
    createdAt: '2026-10-05T16:00:00Z',
    estimatedHours: 10
  },
  {
    id: 'BIO-161',
    title: 'Pipeline de predicción de epítopos con Deep Learning',
    description: 'Integrar modelo de enlace péptido-MHC para diseño de vacunas de ARN mensajero.',
    status: 'EN_PROGRESO',
    priority: 'MEDIA',
    assigneeId: 'usr-7',
    createdById: 'usr-7',
    energyCost: 15,
    tags: ['AI Model', 'Genómica'],
    subtasks: [{ id: 'sub-34', title: 'Validar precisión contra IEDB', completed: false }],
    dueDate: '2026-10-18',
    vencimientoLabel: '18 Oct',
    createdAt: '2026-10-06T14:30:00Z',
    estimatedHours: 8
  },
  {
    id: 'BIO-162',
    title: 'Informe de congruencia filogenética de cepas bacterianas',
    description: 'Construir árboles de máxima verosimilitud para seguimiento epidemiológico.',
    status: 'EN_REVISION',
    priority: 'BAJA',
    assigneeId: 'usr-7',
    createdById: 'usr-1',
    energyCost: 10,
    tags: ['Bio-Pipeline'],
    subtasks: [{ id: 'sub-35', title: 'Revisión con genetista sénior', completed: true }],
    dueDate: '2026-10-23',
    vencimientoLabel: '23 Oct',
    createdAt: '2026-10-07T15:00:00Z',
    estimatedHours: 6
  }
];

export const INITIAL_CHECKINS: DailyCheckIn[] = [
  {
    id: 'chk-1',
    userId: 'usr-1',
    date: '2026-10-08',
    sleepHours: 8.0,
    stressRating: 1,
    hydrationLiters: 2.5,
    mood: 'radiante',
    notes: 'Óptima disposición operativa. Coordinación de sprint balanceada.',
    energyCalculated: 84
  },
  {
    id: 'chk-2',
    userId: 'usr-2',
    date: '2026-10-08',
    sleepHours: 4.8,
    stressRating: 5,
    hydrationLiters: 1.0,
    mood: 'agotado',
    notes: 'Fatiga severa por tareas concurrentes críticas en Backend y Rust.',
    energyCalculated: 22
  },
  {
    id: 'chk-3',
    userId: 'usr-3',
    date: '2026-10-08',
    sleepHours: 7.5,
    stressRating: 2,
    hydrationLiters: 2.2,
    mood: 'radiante',
    notes: 'Progreso fluido en síntesis genómica sin fricción técnica.',
    energyCalculated: 78
  }
];
