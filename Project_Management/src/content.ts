export type Tone = 'indigo' | 'emerald' | 'amber' | 'rose';

/** Detail shown in the modal when a principle, domain or guide card is opened. */
export interface Topic {
  title: string;
  sub: string;
  tone: Tone;
  lead: string;
  /** Replaces the tone's lead box classes where the original page styled it differently. */
  leadClass?: string;
  items: readonly string[];
  /** Measurement shows the KPI/SPI/CPI cards and puts the list in a "Fórmulas y Tipos" box. */
  kind?: 'measurement';
}

export const topics = {
  Stewardship: {
    title: 'Stewardship',
    sub: 'Responsabilidad',
    tone: 'indigo',
    lead: 'Cuidar el proyecto como si fuera propio.',
    items: [
      'Integridad (Integrity): Actuar con honestidad en cada decisión.',
      'Cuidado (Care): Proteger recursos financieros y ambientales.',
      'Compliance (Cumplimiento): Respetar leyes y normas internas y externas.',
    ],
  },
  Team: {
    title: 'Team',
    sub: 'Equipo',
    tone: 'indigo',
    lead: 'El corazón de la ejecución.',
    items: [
      'Cultura: Crear un entorno de seguridad psicológica.',
      'Respeto: Valorar la diversidad de pensamiento.',
      'Empoderamiento (Empowerment): Dar autonomía para resolver problemas.',
    ],
  },
  Stakeholders: {
    title: 'Stakeholders',
    sub: 'Interesados',
    tone: 'indigo',
    lead: 'Gestionar relaciones, no solo nombres.',
    items: [
      'Involucramiento (Engagement): Mantenerlos activos y motivados.',
      'Expectativas: Alinear lo que desean con la realidad técnica.',
      'Colaboración: Construir puentes de comunicación efectivos.',
    ],
  },
  Value: {
    title: 'Value',
    sub: 'Valor',
    tone: 'indigo',
    lead: 'El fin último de todo esfuerzo.',
    items: [
      'Beneficios: Medir el éxito por el impacto, no solo por tareas.',
      'Alineación: Asegurar que el proyecto ayude a la estrategia del negocio.',
      'Optimización: Entregar el máximo valor con los recursos disponibles.',
    ],
  },
  SystemsThinking: {
    title: 'Systems Thinking',
    sub: 'Pensamiento Sistémico',
    tone: 'indigo',
    lead: 'Entender que todo está conectado.',
    items: [
      'Holismo: Mirar la imagen completa o Big Picture.',
      'Interacciones: Ver cómo una parte afecta a las demás del sistema.',
      'Contexto: No ignorar el entorno organizacional y externo.',
    ],
  },
  Leadership: {
    title: 'Leadership',
    sub: 'Liderazgo',
    tone: 'indigo',
    lead: 'Influencia positiva sin jerarquías.',
    items: [
      'Inspiración: Motivar hacia una visión común compartida.',
      'Servicio (Servant Leadership): Liderar para que el equipo brille.',
      'Adaptabilidad: Cambiar el estilo de liderazgo según la necesidad.',
    ],
  },
  Tailoring: {
    title: 'Tailoring',
    sub: 'Adaptación',
    tone: 'indigo',
    lead: 'No hay una receta mágica única.',
    items: [
      'Ajuste: Seleccionar los procesos que sirven específicamente hoy.',
      'Eficiencia: Eliminar burocracia innecesaria en la gestión.',
      'Evolución: Cambiar el método si el entorno del proyecto cambia.',
    ],
  },
  Quality: {
    title: 'Quality',
    sub: 'Calidad',
    tone: 'indigo',
    lead: 'Hacerlo bien desde la primera vez.',
    items: [
      'Satisfacción: Cumplir con lo que el cliente espera recibir.',
      'Mejora Continua: Refinar procesos constantemente.',
      'Desempeño: Entregables que funcionan según las especificaciones.',
    ],
  },
  Complexity: {
    title: 'Complexity',
    sub: 'Complejidad',
    tone: 'indigo',
    lead: 'Navegar en la niebla con seguridad.',
    items: [
      'Diagnóstico: Entender qué variables hacen complejo al proyecto.',
      'Estrategia: Simplificar lo difícil donde sea posible.',
      'Vigilancia: Monitorear cambios inesperados que aumenten el caos.',
    ],
  },
  Risk: {
    title: 'Risk',
    sub: 'Riesgo',
    tone: 'indigo',
    lead: 'Anticiparse al futuro incierto.',
    items: [
      'Amenazas (Threats): Planear para lo que puede salir mal.',
      'Oportunidades (Opportunities): Listos para lo que puede salir mejor.',
      'Respuesta: Acciones rápidas y planeadas ante la incertidumbre.',
    ],
  },
  Adaptability: {
    title: 'Adaptability & Resiliency',
    sub: 'Adaptabilidad y Resiliencia',
    tone: 'indigo',
    lead: 'Flexibilidad para ganar.',
    items: [
      'Reacción: Ajustar las velas cuando cambia el viento del proyecto.',
      'Recuperación: Aprender de los errores técnicos y seguir adelante.',
      'Constancia: No perder el foco estratégico ante el caos temporal.',
    ],
  },
  Change: {
    title: 'Change',
    sub: 'Cambio',
    tone: 'indigo',
    lead: 'Acompañar la transformación organizacional.',
    items: [
      'Transición: Ayudar a la gente a adoptar los nuevos resultados.',
      'Sostenibilidad: Que el cambio perdure una vez finalizado el proyecto.',
      'Visión: Mirar siempre hacia el estado futuro deseado.',
    ],
  },

  DomainStakeholders: {
    title: 'Stakeholders',
    sub: 'Interesados',
    tone: 'emerald',
    lead: 'Este dominio establece una Estrategia de Relación (Engagement Strategy) efectiva.',
    items: [
      'Matrices de Poder e Interés: Saber quién decide de verdad.',
      'Planes de Comunicación: Determinar qué decir y cuándo hacerlo.',
      'Gestión de Expectativas: Evitar sorpresas negativas para el cliente.',
    ],
  },
  DomainTeam: {
    title: 'Team',
    sub: 'Equipo',
    tone: 'emerald',
    lead: 'Aborda la Estructura y Gobernanza (Governance) del grupo de trabajo.',
    items: [
      'Matriz RACI: Claridad absoluta en responsabilidades y roles.',
      'Normas de Equipo: Reglas del juego claras para la convivencia.',
      'Desarrollo: Potenciar el talento y los SME (Expertos en la Materia).',
    ],
  },
  DomainLifecycle: {
    title: 'Development Approach and Life Cycle',
    sub: 'Ciclo de Vida',
    tone: 'amber',
    lead: 'Define la Metodología de Entrega (Delivery Methodology).',
    items: [
      'Agile (Ágil): Para requisitos cambiantes y rapidez de entrega.',
      'Cascada (Waterfall): Para estabilidad y hitos fijos secuenciales.',
      'Híbrido: Combinar lo mejor de ambos mundos según el caso.',
    ],
  },
  DomainPlanning: {
    title: 'Planning',
    sub: 'Planificación',
    tone: 'amber',
    lead: 'Cubre la organización técnica de recursos, tiempo y costos.',
    items: [
      'Líneas Base (Baselines): El punto de comparación inicial aprobado.',
      'EDT (Estructura de Desglose del Trabajo): Dividir para vencer.',
      'Estimación: Tiempos y costos realistas basados en datos.',
    ],
  },
  DomainWork: {
    title: 'Project Work',
    sub: 'Trabajo del Proyecto',
    tone: 'emerald',
    lead: 'Se enfoca en la Operación Diaria (Daily Operations).',
    items: [
      'Flujos como Kanban: Visibilidad total de las tareas diarias.',
      'Logística: Recursos listos justo cuando se necesitan.',
      'Eliminación de Trabas: Desbloquear al equipo de forma rápida.',
    ],
  },
  DomainDelivery: {
    title: 'Delivery',
    sub: 'Entrega',
    tone: 'emerald',
    lead: '🎯 Foco en Requisitos y Alcance (Scope). Es el dominio donde se realiza el Levantamiento de Requisitos.',
    leadClass:
      'bg-emerald-50 p-6 rounded-xl border-l-4 border-emerald-600 mb-4 font-semibold text-emerald-900 shadow-sm',
    items: [
      'Levantamiento (Requirements Gathering): Captura técnica de necesidades.',
      'Trazabilidad (Traceability): Seguir el requisito hasta su entrega.',
      'Criterios de Aceptación: Condiciones claras para dar el visto bueno.',
    ],
  },
  DomainMeasurement: {
    title: 'Measurement',
    sub: 'Medición',
    tone: 'indigo',
    kind: 'measurement',
    lead: 'Este dominio es el corazón del control basado en datos cuantificables.',
    leadClass:
      'bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-500 mb-4 font-semibold text-indigo-800 italic',
    items: [
      'SPI = EV / PV: Valor Ganado (Earned Value) entre Valor Planificado.',
      'CPI = EV / AC: Valor Ganado (Earned Value) entre Costo Real.',
      'Leading Indicators (Indicadores Adelantados): Predicen cambios futuros.',
      'Lagging Indicators (Indicadores Atrasados): Confirman resultados pasados.',
    ],
  },
  DomainUncertainty: {
    title: 'Uncertainty',
    sub: 'Incertidumbre',
    tone: 'amber',
    lead: 'Gestiona el espectro completo de Riesgos y Oportunidades.',
    items: [
      'Heat Maps (Mapas de Calor): Priorizar riesgos por impacto y probabilidad.',
      'Contingencia: Tener un Plan B listo para ejecución inmediata.',
      'Oportunidades: Aprovechar lo inesperado a favor de los objetivos.',
    ],
  },

  GuideGobernanza: {
    title: 'Gobernanza',
    sub: 'Liderazgo y Ética',
    tone: 'indigo',
    lead: 'El marco de decisión del proyecto.',
    items: [
      'Modelo de Liderazgo: Definir si será directivo, servicial o transformacional.',
      'Ética Profesional: Alineación con el código de conducta institucional.',
      'Compliance (Cumplimiento): Asegurar el respeto al marco legal desde el inicio.',
    ],
  },
  GuideTecnica: {
    title: 'Cuerpo Técnico',
    sub: 'Metodología y Alcance',
    tone: 'emerald',
    lead: 'La arquitectura de la solución propuesta.',
    items: [
      'Levantamiento de Requisitos: Métodos para capturar necesidades técnicas.',
      'Entrega: Justificación del enfoque Agile, Cascada o Híbrido.',
      'Criterios de Éxito: Definir qué se considera un trabajo terminado.',
    ],
  },
  GuideVisual: {
    title: 'Gestión Visual',
    sub: 'Transparencia y Control',
    tone: 'amber',
    lead: 'Mostrar el progreso en tiempo real.',
    items: [
      'Kanban: Visualización del flujo y detección de cuellos de botella.',
      'Dashboards (Tableros): Radiadores de información con métricas clave.',
      'Acceso a Datos: Transparencia total sobre la realidad operativa.',
    ],
  },
  GuideCompliance: {
    title: 'Compliance',
    sub: 'Normativa y Sostenibilidad',
    tone: 'rose',
    lead: 'Protección legal y regulatoria.',
    items: [
      'Monitoreo: Auditorías periódicas de procesos y resultados técnicos.',
      'Leyes y Normas: Checklist de cumplimiento de estándares nacionales o internacionales.',
      'Prevención: Identificación proactiva de riesgos legales y normativos.',
    ],
  },
} as const satisfies Record<string, Topic>;

export type TopicId = keyof typeof topics;

export const leadClassByTone: Record<Tone, string> = {
  indigo: 'bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500 mb-4 font-semibold text-indigo-800',
  emerald: 'bg-emerald-50 p-4 rounded-xl border-l-4 border-emerald-500 mb-4 font-semibold text-emerald-800',
  amber: 'bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500 mb-4 font-semibold text-amber-800',
  rose: 'bg-rose-50 p-4 rounded-xl border-l-4 border-rose-500 mb-4 font-semibold text-rose-800',
};

export interface PrincipleButton {
  id: TopicId;
  label: string;
  translation: string;
}

export const principles: readonly PrincipleButton[] = [
  { id: 'Stewardship', label: 'Stewardship', translation: 'Responsabilidad' },
  { id: 'Team', label: 'Team', translation: 'Equipo' },
  { id: 'Stakeholders', label: 'Stakeholders', translation: 'Interesados' },
  { id: 'Value', label: 'Value', translation: 'Valor' },
  { id: 'SystemsThinking', label: 'Systems Thinking', translation: 'Pensa. Sistémico' },
  { id: 'Leadership', label: 'Leadership', translation: 'Liderazgo' },
  { id: 'Tailoring', label: 'Tailoring', translation: 'Adaptación' },
  { id: 'Quality', label: 'Quality', translation: 'Calidad' },
  { id: 'Complexity', label: 'Complexity', translation: 'Complejidad' },
  { id: 'Risk', label: 'Risk', translation: 'Riesgo' },
  { id: 'Adaptability', label: 'Adaptability & Resiliency', translation: 'Resiliencia' },
  { id: 'Change', label: 'Change', translation: 'Cambio' },
];

/** `amber` marks the planning-related domains, `delivery` the highlighted Delivery domain. */
export type DomainAccent = 'emerald' | 'amber' | 'delivery';

export interface DomainButton {
  id: TopicId;
  label: string;
  summary: string;
  accent: DomainAccent;
}

export const domains: readonly DomainButton[] = [
  {
    id: 'DomainStakeholders',
    label: 'Stakeholders',
    summary: 'Interesados — Estrategia y expectativas.',
    accent: 'emerald',
  },
  { id: 'DomainTeam', label: 'Team', summary: 'Equipo — Estructura y gobernanza.', accent: 'emerald' },
  {
    id: 'DomainLifecycle',
    label: 'Development Approach and Life Cycle',
    summary: 'Ciclo de Vida — Metodología.',
    accent: 'amber',
  },
  { id: 'DomainPlanning', label: 'Planning', summary: 'Planificación — Cronograma.', accent: 'amber' },
  { id: 'DomainWork', label: 'Project Work', summary: 'Trabajo — Procesos operativos.', accent: 'emerald' },
  { id: 'DomainDelivery', label: 'Delivery', summary: 'Entrega — Alcance y Requisitos.', accent: 'delivery' },
  {
    id: 'DomainMeasurement',
    label: 'Measurement',
    summary: 'Medición — KPIs y desempeño.',
    accent: 'emerald',
  },
  { id: 'DomainUncertainty', label: 'Uncertainty', summary: 'Incertidumbre — Riesgos.', accent: 'amber' },
];

export interface ArtifactColumn {
  title: string;
  items: readonly { icon: string; label: string }[];
}

export const artifactColumns: readonly ArtifactColumn[] = [
  {
    title: 'Ejecución y Flujo',
    items: [
      { icon: '🎴', label: 'Tableros y Tarjetas Kanban' },
      { icon: '📈', label: 'Diagrama de Gantt / Cronograma' },
      { icon: '📉', label: 'Burndown / Burnup Charts' },
      { icon: '📊', label: 'Curva S (Costos Acumulados)' },
      { icon: '🌊', label: 'Flujo Acumulado (CFD)' },
    ],
  },
  {
    title: 'Requisitos e Informes',
    items: [
      { icon: '📋', label: 'Matriz de Trazabilidad' },
      { icon: '📑', label: 'Backlog / Historias de Usuario' },
      { icon: '🌳', label: 'EDT / WBS (Jerarquía)' },
      { icon: '📐', label: 'Líneas Base (Baselines)' },
      { icon: '🔎', label: 'Diagrama de Pareto' },
    ],
  },
  {
    title: 'Estrategia y Riesgo',
    items: [
      { icon: '🗺️', label: 'Roadmap del Proyecto' },
      { icon: '🔥', label: 'Mapa de Calor de Riesgos' },
      { icon: '🖥️', label: 'Dashboard de Desempeño' },
      { icon: '💎', label: 'Mapa de Valor (VSM)' },
      { icon: '🦴', label: 'Diagrama de Ishikawa' },
    ],
  },
];

export interface GuideCard {
  id: TopicId;
  title: string;
  description: string;
  cardClass: string;
  titleClass: string;
}

export const guideCards: readonly GuideCard[] = [
  {
    id: 'GuideGobernanza',
    title: 'Gobernanza',
    description: 'Modelo de liderazgo y aseguramiento de la ética y Compliance (Cumplimiento).',
    cardClass: 'border-indigo-500 hover:bg-indigo-50',
    titleClass: 'text-indigo-700',
  },
  {
    id: 'GuideTecnica',
    title: 'Cuerpo Técnico',
    description: 'Levantamiento de Requisitos y Metodología de Entrega elegida.',
    cardClass: 'border-emerald-500 hover:bg-emerald-50',
    titleClass: 'text-emerald-700',
  },
  {
    id: 'GuideVisual',
    title: 'Gestión Visual',
    description: 'Uso de Kanban y Dashboards (Tableros) para transparencia.',
    cardClass: 'border-amber-500 hover:bg-indigo-50',
    titleClass: 'text-amber-700',
  },
  {
    id: 'GuideCompliance',
    title: 'Compliance',
    description: 'Monitorización de leyes y normas vigentes.',
    cardClass: 'border-rose-500 hover:bg-rose-50',
    titleClass: 'text-rose-700',
  },
];
