import type { BarSegment } from '@shared/components/stacked-bar';
import type { Cognate } from './vocabulary';

/** Inline text with optional emphasised fragments, rendered without v-html. */
export type RichText = readonly (string | { strong: string })[];

export interface WordCount {
  label: string;
  value: string;
  tone: 'red' | 'amber';
}

export const kitaCounts: readonly WordCount[] = [
  { label: 'Español (Casa)', value: '~1,500', tone: 'red' },
  { label: 'Alemán (Kita)', value: '~2,000', tone: 'amber' },
];

export const schoolCounts: readonly WordCount[] = [
  { label: 'Español (Casa)', value: '~3,500', tone: 'red' },
  { label: 'Alemán (Kita)', value: '~4,000', tone: 'amber' },
];

export interface LanguageBridge {
  title: string;
  percent: string;
  description: string;
  tone: 'red' | 'amber';
  pairs: readonly [string, string][];
}

export const bridges: readonly LanguageBridge[] = [
  {
    title: 'El Puente Latino (desde el Español)',
    percent: '40%',
    description: 'Palabras sofisticadas, académicas y científicas.',
    tone: 'red',
    pairs: [
      ['Invención', 'Invention'],
      ['Libertad', 'Liberty'],
      ['Curioso', 'Curious'],
    ],
  },
  {
    title: 'El Puente Germánico (desde el Alemán)',
    percent: '30%',
    description: 'Palabras cotidianas, verbos de acción y familia.',
    tone: 'amber',
    pairs: [
      ['Bruder', 'Brother'],
      ['Grün', 'Green'],
      ['Singen', 'Sing'],
    ],
  },
];

export const vocabularyBar: readonly BarSegment[] = [
  {
    label: 'LATINO',
    percent: 40,
    class: 'bg-red-500 flex items-center justify-center text-[11px] font-black text-white rounded-l-full',
  },
  {
    label: 'GERMÁNICO',
    percent: 30,
    class: 'bg-amber-500 flex items-center justify-center text-[11px] font-black text-slate-900',
  },
  {
    label: 'FALTARÍA',
    percent: 30,
    class: 'bg-slate-700 flex items-center justify-center text-[11px] font-black text-slate-400 italic rounded-r-full',
  },
];

export interface GrammarSegment extends BarSegment {
  /** First line of the two-line label; `label` is the second. */
  kicker: string;
}

const grammarSegmentBase = 'flex items-center justify-center gap-1.5 sm:gap-3 px-2';

export const grammarBar: readonly GrammarSegment[] = [
  { kicker: 'Lógica', label: 'Deutsch', percent: 35, class: `${grammarSegmentBase} bg-amber-400 text-indigo-950 rounded-l-full` },
  {
    kicker: 'Tiempos',
    label: 'Español',
    percent: 25,
    class: `${grammarSegmentBase} bg-red-400 text-indigo-950 border-l border-indigo-900/20`,
  },
  {
    kicker: 'Reglas',
    label: 'Nuevas',
    percent: 40,
    class: `${grammarSegmentBase} bg-indigo-600 text-indigo-100 rounded-r-full border-l border-indigo-900/20`,
  },
];

export interface GrammarRule {
  title: string;
  via: string;
  viaClass: string;
  description: string;
  icon: 'check' | 'zap';
}

export const grammarRules: readonly GrammarRule[] = [
  {
    title: 'Sintaxis (Orden)',
    via: 'Vía Alemán',
    viaClass: 'bg-amber-500/20 text-amber-700 dark:text-amber-500',
    description: 'El orden Adjetivo + Sustantivo es natural para ella.',
    icon: 'check',
  },
  {
    title: 'Tiempos Verbales',
    via: 'Vía Español',
    viaClass: 'bg-red-500/20 text-red-700 dark:text-red-500',
    description: "La lógica de 'He comido' (I have eaten) ya la conoce.",
    icon: 'check',
  },
  {
    title: 'Género Neutral',
    via: 'Vía Simplificación',
    viaClass: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-500',
    description: 'Pasar de 3 géneros (DE) a 0 (EN) es muy fácil.',
    icon: 'check',
  },
  {
    title: 'Phrasal Verbs',
    via: 'Vía Nuevo',
    viaClass: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-500',
    description: 'Esto es lo que más le costará: verbos con partículas.',
    icon: 'zap',
  },
];

/** One example line inside an equivalence tab, e.g. `Español: "Yo **he** comido"`. */
export interface ExampleLine {
  label: string;
  text: RichText;
  note?: string;
}

export interface EquivalenceTab {
  id: string;
  label: string;
  heading: string;
  explanation: RichText;
  examples: readonly ExampleLine[];
}

export const spanishTabs: readonly EquivalenceTab[] = [
  {
    id: 'continuos',
    label: '1. Continuos',
    heading: 'Estructura Idéntica (Auxiliar + Gerundio)',
    explanation: [
      'En español e inglés utilizamos un verbo auxiliar seguido de un gerundio en movimiento. El alemán ',
      { strong: 'no cuenta con esta herramienta de manera directa' },
      '.',
    ],
    examples: [
      { label: 'Español:', text: ['"Estoy comiendo"'], note: '(Estar + Gerundio)' },
      { label: 'Inglés:', text: ['"I am eating"'], note: '(Be + -ing Ending)' },
    ],
  },
  {
    id: 'compuestos',
    label: '2. Compuestos',
    heading: 'Estructura Matemática (Haber + Participio)',
    explanation: [
      'El inglés y el español utilizan una fórmula exacta para relacionar acciones pasadas que tienen vigencia en el presente (el Present Perfect).',
    ],
    examples: [
      { label: 'Español:', text: ['"Yo ', { strong: 'he' }, ' comido"'] },
      { label: 'Inglés:', text: ['"I ', { strong: 'have' }, ' eaten"'] },
    ],
  },
  {
    id: 'pasiva',
    label: '3. Pasiva',
    heading: 'Misma Fórmula Simétrica',
    explanation: [
      'Cuando el objeto de la acción es más importante que el agente, las construcciones actúan como un espejo simétrico perfecto.',
    ],
    examples: [
      { label: 'Español:', text: ['"El libro ', { strong: 'fue escrito' }, ' por ella"'] },
      { label: 'Inglés:', text: ['"The book ', { strong: 'was written' }, ' by her"'] },
    ],
  },
];

export const germanTabs: readonly EquivalenceTab[] = [
  {
    id: 'sintaxis',
    label: '1. Sintaxis',
    heading: 'Orden de Adjetivos Automático',
    explanation: [
      'A diferencia del español, en inglés el adjetivo se antepone al sustantivo. Tu hija lo asimilará al instante porque en la Kita ya lo hace de forma natural.',
    ],
    examples: [
      { label: 'Alemán:', text: ['"Das ', { strong: 'rote' }, ' Auto"'] },
      { label: 'Inglés:', text: ['"The ', { strong: 'red' }, ' car"'] },
    ],
  },
  {
    id: 'modales',
    label: '2. Modales',
    heading: 'Verbos de Ayuda sin Cambios',
    explanation: [
      'La fórmula germánica de usar un verbo auxiliar modal que no requiere conjugar el verbo principal es idéntica en alemán e inglés.',
    ],
    examples: [
      { label: 'Alemán:', text: ['"Ich ', { strong: 'kann' }, ' singen"'], note: '(Verbo al final)' },
      { label: 'Inglés:', text: ['"I ', { strong: 'can' }, ' sing"'] },
    ],
  },
  {
    id: 'fonetica',
    label: '3. Fonética',
    heading: 'Entrenamiento del Oído Germánico',
    explanation: [
      'Sonidos como la "h" aspirada, consonantes oclusivas o la distinción sutil de vocales largas/cortas son naturales en su Kita, dándole un oído listo para el inglés.',
    ],
    examples: [
      {
        label: 'H Aspirada:',
        text: ['Haus ➜ House (Fácil para ella, difícil para un monolingüe español)'],
      },
    ],
  },
];

export interface HorizonCard {
  language: string;
  words: string;
  level: string;
  role: string;
  description: string;
  cardClass: string;
}

export const horizonCards: readonly HorizonCard[] = [
  {
    language: 'Alemán',
    words: '35,000',
    level: 'Nativo Académico (C2+)',
    role: 'Cerebro Profesional',
    description: 'Dominio técnico y literario absoluto para el mercado laboral alemán.',
    cardClass: 'bg-amber-600',
  },
  {
    language: 'Español',
    words: '30,000',
    level: 'Nativo Coloquial (C2)',
    role: 'Cerebro Emocional',
    description: 'Fluidez nativa perfecta, matices culturales y conexión familiar.',
    cardClass: 'bg-red-600',
  },
  {
    language: 'Inglés',
    words: '25,000',
    level: 'Fluidez Avanzada (C1/C2)',
    role: 'Cerebro Global',
    description: 'Habilidad para investigar, viajar y trabajar internacionalmente.',
    cardClass: 'bg-blue-600',
  },
];

export const cognates: readonly Cognate[] = [
  {
    query: 'informacion',
    en: 'Information',
    es: 'Información',
    type: 'latin',
    explanation:
      "Pertenece al Puente Latino (40%). El sufijo '-ción' se convierte automáticamente en '-tion' en inglés. ¡Mismo origen del latín medieval!",
  },
  {
    query: 'problema',
    en: 'Problem',
    es: 'Problema',
    type: 'latin',
    explanation:
      "Pertenece al Puente Latino (40%). Las palabras griegas y latinas que terminan en '-ma' en español pasan casi idénticas al inglés.",
  },
  {
    query: 'familia',
    en: 'Family',
    es: 'Familia',
    type: 'latin',
    explanation:
      "Pertenece al Puente Latino (40%). El sufijo '-ia' se reduce a '-y'. Tu hija ya asocia este concepto sin esfuerzo.",
  },
  {
    query: 'haus',
    en: 'House',
    de: 'Haus',
    type: 'germanic',
    explanation:
      "Pertenece al Puente Germánico (30%). Como dialecto del germánico occidental, el sonido 'au' evolucionó directamente al 'ou' inglés.",
  },
  {
    query: 'wasser',
    en: 'Water',
    de: 'Wasser',
    type: 'germanic',
    explanation:
      "Pertenece al Puente Germánico (30%). Sigue la mutación consonántica del alto alemán: la 'ss' alemana se corresponde con la 't' en inglés.",
  },
  {
    query: 'milch',
    en: 'Milk',
    de: 'Milch',
    type: 'germanic',
    explanation:
      'Pertenece al Puente Germánico (30%). Palabras diarias de alimentación y agricultura comparten raíces genéticas idénticas desde la Edad de Hierro.',
  },
  {
    query: 'brother',
    en: 'Brother',
    de: 'Bruder',
    type: 'germanic',
    explanation:
      'Pertenece al Puente Germánico (30%). Las palabras del núcleo familiar íntimo son primos filogenéticos casi exactos.',
  },
];

export const pronunciationWords: readonly string[] = ['Invention', 'Brother', 'House', 'Liberty'];

export interface QuizQuestion {
  question: string;
  options: readonly { text: string; isCorrect: boolean }[];
  explanation: string;
}

export const WRONG_ANSWER_TEXT =
  'Respuesta incorrecta. El anclaje lógico o estructural correcto es diferente. ¡Inténtalo en la siguiente pregunta!';

export const quizQuestions: readonly QuizQuestion[] = [
  {
    question: "¿Por qué vía asimilará más rápido la estructura de 'She is playing' (Ella está jugando)?",
    options: [
      { text: 'Vía Alemán', isCorrect: false },
      { text: 'Vía Español (Tiempos Continuos)', isCorrect: true },
      { text: 'No tiene equivalencia en ninguna', isCorrect: false },
    ],
    explanation:
      "¡Exacto! El español y el inglés comparten la estructura matemática idéntica de 'Estar/Be + Gerundio', mientras que el alemán no posee este tiempo continuo de forma nativa.",
  },
  {
    question: "¿Por qué el orden de la frase 'The blue sky' le resultará natural desde el primer día?",
    options: [
      { text: 'Por la estructura de casa del Español', isCorrect: false },
      { text: 'Por la estructura de la Kita del Alemán (Adjetivo + Sustantivo)', isCorrect: true },
      { text: 'Por herencia del latín clásico', isCorrect: false },
    ],
    explanation:
      "¡Correcto! En alemán se dice 'Der blaue Himmel' (Adjetivo + Sustantivo). Su cerebro ya tiene cableada esta sintaxis de colocación antes del sustantivo.",
  },
  {
    question: "Si tu hija escucha la palabra académica 'Acceleration', ¿cuál es su anclaje mental inmediato?",
    options: [
      { text: 'Su base alemana (Kita)', isCorrect: false },
      { text: 'Su base hispana de casa (Aceleración - Puente Latino 40%)', isCorrect: true },
      { text: 'Ninguna, debe memorizarla desde cero', isCorrect: false },
    ],
    explanation:
      '¡Así es! Las palabras científicas, abstractas y de carácter académico en inglés proceden del latín, haciendo que el español sea su mayor base de transferencia de vocabulario avanzado.',
  },
];
