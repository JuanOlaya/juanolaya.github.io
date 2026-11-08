/** Page copy and prompts, kept out of the components so the templates stay about layout. */

export interface NavLink {
  href: string;
  label: string;
}

export const sectionLinks: readonly NavLink[] = [
  { href: '#concept-overload', label: '1. Sobrecarga Cognitiva' },
  { href: '#concept-disclosure', label: '2. Divulgación Progresiva' },
  { href: '#concept-hick', label: '3. Ley de Hick' },
];

export const LAWS_OF_UX_URL = 'https://lawsofux.com/';

export const chaosTabs: readonly string[] = [
  'Verbo Básico',
  'Pasado simple',
  'Perfecto',
  'Ejemplos (25)',
  'Reglas Gramaticales',
];

export const chaosMeta: readonly string[] = [
  'ID: #9284-A',
  'Creado: 2026-03-10',
  'Nivel: A1-B2',
  'Progreso: 12% completado',
];

export interface ColoredButton {
  label: string;
  className: string;
}

export const chaosButtons: readonly ColoredButton[] = [
  { label: 'Guardar', className: 'bg-emerald-500 text-white font-bold hover:bg-emerald-600' },
  { label: 'Marcar como Importante', className: 'bg-sky-500 text-white font-bold' },
  { label: 'Borrar', className: 'bg-rose-500 text-white font-bold' },
  { label: 'Reset', className: 'border border-slate-300 text-slate-600' },
  { label: '¿Ayuda?', className: 'bg-amber-500 text-white font-bold' },
];

export interface Conjugation {
  pronoun: string;
  form: string;
}

export const presentTense: readonly Conjugation[] = [
  { pronoun: 'ich', form: 'spreche' },
  { pronoun: 'wir', form: 'sprechen' },
  { pronoun: 'du', form: 'sprichst' },
  { pronoun: 'ihr', form: 'sprecht' },
];

export const pastTense: readonly Conjugation[] = [
  { pronoun: 'ich', form: 'sprach' },
  { pronoun: 'wir', form: 'sprachen' },
  { pronoun: 'du', form: 'sprachst' },
  { pronoun: 'ihr', form: 'spracht' },
];

export interface UsageExample {
  title: string;
  sentence: string;
}

export const usageExamples: readonly UsageExample[] = [
  { title: 'Ejemplo 1:', sentence: '"Sprichst du Deutsch?" (¿Hablas alemán?)' },
  {
    title: 'Ejemplo 2:',
    sentence: '"Er hat gestern mit dem Lehrer gesprochen." (Él habló ayer con el profesor)',
  },
];

export const PRONUNCIATION_TEXT =
  'Sprechen. El verbo sprechen significa hablar en alemán. Es un verbo irregular de nivel básico.';

export interface PromptTemplate {
  label: string;
  prompt: string;
}

export const prototypeTemplates: readonly PromptTemplate[] = [
  {
    label: 'Login Minimalista',
    prompt:
      'Un formulario de login móvil limpio con dos campos, un botón de ingresar prominente y un enlace discreto de recuperar contraseña',
  },
  {
    label: 'Dashboard de Idiomas',
    prompt:
      'Un dashboard para aprender alemán que muestra el verbo sprechen, con diseño limpio, un reproductor de audio simple y un botón de completado',
  },
  {
    label: 'UI de Sobrecarga Cognitiva',
    prompt:
      'Un panel administrativo extremadamente caótico lleno de gráficos superpuestos, 30 botones de colores saturados y alertas de error por doquier',
  },
];

export const groundingTemplates: readonly PromptTemplate[] = [
  {
    label: '🔗 Scroll Infinito vs Paginación (2026)',
    prompt:
      '¿Cuál es el consenso actual sobre el debate de scroll infinito vs paginación en interfaces móviles de comercio electrónico?',
  },
  {
    label: '🔗 Ley de Hick en VR/AR',
    prompt:
      '¿Cómo se aplica la Ley de Hick en los menús de navegación de Realidad Virtual y Aumentada actualmente?',
  },
];

export const AUDIT_SYSTEM_PROMPT = `Actúa como un Auditor de Usabilidad de Software Senior de nivel mundial.
Analiza visualmente la captura de pantalla provista para diagnosticar la interfaz según las leyes cognitivas de UX (Sobrecarga Cognitiva, Divulgación Progresiva, Ley de Hick).
Genera un reporte estrictamente formateado como un JSON plano con estas claves exactas:
{
   "sobrecarga_score": un entero de 1 a 10 de calificación (donde 10 es un diseño perfecto y libre de sobrecarga, y 1 es el peor caos),
   "sobrecarga_feedback": "Explicación breve de lo que viste en la captura sobre la sobrecarga cognitiva",
   "disclosure_score": entero de 1 a 10,
   "disclosure_feedback": "Explicación breve de cómo aplica o no la divulgación progresiva",
   "hick_score": entero de 1 a 10,
   "hick_feedback": "Explicación de cómo el diseño afecta al tiempo de toma de decisiones del usuario",
   "resumen_general": "Recomendación de mejoras críticas de diseño para esta interfaz."
}`;

export const AUDIT_USER_PROMPT =
  'Analiza visualmente esta interfaz según los estándares de usabilidad de Laws of UX.';

export const REDESIGN_PROMPT =
  'Rediseña la captura de pantalla de interfaz provista. Crea un mockup de baja fidelidad (wireframe) optimizado, sumamente limpio y estético, eliminando la sobrecarga cognitiva, aplicando la Ley de Hick con pocas opciones y escondiendo lo avanzado con divulgación progresiva. Devuelve la nueva imagen de wireframe en tu respuesta.';

export const PROTOTYPE_STYLE_SUFFIX =
  ', wireframe layout, clean UI, modern, minimal mobile design, vector illustration style';

export const INTERVIEW_OPENING_PROMPT =
  'Hola. Actúa como un reclutador de diseño UX de Alemania de alta exigencia para una startup berlinesa. Inicia la simulación de la entrevista técnica. Háblame en alemán formal y, para ayudarme a aprender, incluye la traducción del mensaje al español entre corchetes [como esto]. Hazme la primera pregunta conceptual combinando el idioma alemán y conceptos de usabilidad (Ley de Hick o Divulgación Progresiva).';

export const INTERVIEW_START_SYSTEM =
  'Eres un reclutador técnico de diseño UX en Alemania. Conduce la entrevista de manera formal. Proporciona siempre la traducción al español en un bloque con corchetes [ ] al final de cada párrafo de tus mensajes.';

export const INTERVIEW_FOLLOW_UP_SYSTEM =
  'Eres un entrevistador de UX en Berlín. Sigue la conversación en base a las respuestas de usabilidad del usuario. Siempre incluye la traducción al español en corchetes [ ] al final de tus párrafos.';

export const QUIZ_SYSTEM_PROMPT = `Actúa como un profesor de diseño interactivo de interfaces y usabilidad web.
Genera un cuestionario interactivo de exactamente 3 preguntas de opción múltiple enfocadas en:
- Sobrecarga Cognitiva (Cognitive Overload)
- Divulgación Progresiva (Progressive Disclosure)
- Ley de Hick (Hick's Law)
Cada pregunta debe contener 4 opciones con un caso real de UI.
El formato de salida debe ser estrictamente un arreglo JSON con el siguiente esquema exacto:
[
   {
      "question": "Texto de la pregunta de usabilidad",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "answer_index": 0, // Índice de la respuesta correcta (0 a 3)
      "explanation": "Breve explicación educativa de por qué esta es la opción correcta sustentada en usabilidad."
   }
]`;

export const QUIZ_USER_PROMPT =
  'Genera 3 preguntas avanzadas y dinámicas de usabilidad basándote en la Ley de Hick, Miller y el caos visual.';
