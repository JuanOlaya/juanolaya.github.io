export interface AgileOption {
  id: string;
  text: string;
  /** Shown after choosing this option, whether it was right or wrong. */
  feedback: string;
}

/** One practice scenario: a situation, a question and the PMBOK 7 lesson behind the right answer. */
export interface AgileCase {
  id: string;
  title: string;
  context: string;
  question: string;
  options: readonly AgileOption[];
  correctOptionId: string;
  lesson: string;
}

export const agileCases: readonly AgileCase[] = [
  {
    id: 'scope-mid-sprint',
    correctOptionId: 'backlog',
    title: 'Cambio de alcance a mitad del sprint',
    context:
      'Faltan cuatro días para cerrar el sprint. Un directivo pide incluir "una funcionalidad pequeña" que no estaba en el objetivo del sprint.',
    question: '¿Qué haces como responsable del proyecto?',
    options: [
      {
        id: 'add-now',
        text: 'La añado de inmediato: el cliente manda y el equipo puede estirar un poco.',
        feedback:
          'Romper el objetivo del sprint destruye la predictibilidad y desgasta al equipo. El compromiso del sprint existe para proteger el foco.',
      },
      {
        id: 'backlog',
        text: 'Agradezco la petición, la llevo al backlog y el Product Owner la prioriza para el próximo sprint.',
        feedback:
          'Correcto. El cambio es bienvenido, pero entra por el backlog priorizado; así el valor se decide con datos y el sprint actual conserva su objetivo.',
      },
      {
        id: 'reject',
        text: 'La rechazo: el alcance se cerró al inicio del proyecto y no se toca.',
        feedback:
          'En un enfoque adaptativo el alcance evoluciona. Negarse de plano ignora el principio de involucrar a los interesados y el de enfocarse en el valor.',
      },
    ],
    lesson:
      'Principios Stakeholders y Value; dominio Delivery. El alcance adaptativo se gestiona con un backlog priorizado, no con cambios dentro de la iteración.',
  },
  {
    id: 'long-daily',
    correctOptionId: 'timebox',
    title: 'La daily dura 45 minutos',
    context:
      'La reunión diaria se ha convertido en un informe de estado donde cada persona se justifica ante el jefe de proyecto y se discuten soluciones técnicas.',
    question: '¿Cuál es la mejor corrección?',
    options: [
      {
        id: 'cancel',
        text: 'Cancelar la daily: claramente no aporta.',
        feedback:
          'La sincronización diaria sí aporta cuando se hace bien; el problema es el formato, no la práctica.',
      },
      {
        id: 'status-report',
        text: 'Que el jefe de proyecto la dirija y recoja el estado de cada tarea.',
        feedback:
          'Convierte la daily en control jerárquico. El equipo deja de autoorganizarse y la reunión sigue siendo larga.',
      },
      {
        id: 'timebox',
        text: 'Limitarla a 15 minutos, centrarla en el plan del día y los impedimentos, y mover las discusiones técnicas a conversaciones posteriores.',
        feedback:
          'Correcto. La daily es del equipo y para el equipo: coordina el trabajo del día y expone bloqueos; lo demás se resuelve fuera.',
      },
    ],
    lesson:
      'Principios Team y Leadership (liderazgo de servicio); dominio Project Work. Las ceremonias se adaptan (Tailoring) para servir al equipo, no para vigilarlo.',
  },
  {
    id: 'velocity-drop',
    correctOptionId: 'inspect',
    title: 'La velocidad cae dos sprints seguidos',
    context:
      'El equipo pasó de completar 30 puntos por sprint a 18. El burndown se aplana a mitad de sprint y varios elementos quedan "casi terminados".',
    question: '¿Qué decisión toma el equipo en la retrospectiva?',
    options: [
      {
        id: 'overtime',
        text: 'Pedir horas extra hasta recuperar los 30 puntos.',
        feedback:
          'Las horas extra ocultan la causa y degradan la calidad. La velocidad es un indicador para aprender, no una meta que forzar.',
      },
      {
        id: 'inspect',
        text: 'Analizar la causa: impedimentos, deuda técnica o demasiado trabajo en paralelo, y probar una mejora medible en el siguiente sprint.',
        feedback:
          'Correcto. La velocidad es un indicador rezagado; se inspecciona la causa raíz, se ajusta el proceso y se vuelve a medir.',
      },
      {
        id: 'lower-estimates',
        text: 'Bajar las estimaciones para que los números vuelvan a cuadrar.',
        feedback:
          'Manipular la métrica elimina la señal. Las métricas son indicadores de desempeño, no objetivos a maquillar.',
      },
    ],
    lesson:
      'Dominio Measurement: indicadores rezagados (velocidad) y adelantados (trabajo en curso, bloqueos). Principio Quality: mejora continua a partir de los datos.',
  },
  {
    id: 'fixed-date-scope',
    correctOptionId: 'hybrid',
    title: 'Fecha y alcance fijos',
    context:
      'El cliente exige lanzar el 1 de marzo con la lista completa de 40 funcionalidades. La estimación del equipo indica que caben unas 25 con calidad.',
    question: '¿Qué enfoque propones?',
    options: [
      {
        id: 'promise',
        text: 'Comprometer las 40 funcionalidades para no perder al cliente.',
        feedback:
          'Prometer lo que los datos contradicen traslada el riesgo a la calidad y a la confianza del cliente cuando no se cumpla.',
      },
      {
        id: 'waterfall',
        text: 'Pasar a un plan predictivo detallado que fije ambas variables desde el inicio.',
        feedback:
          'Un plan más detallado no crea capacidad. Con alta incertidumbre en los requisitos, el enfoque predictivo puro suele fallar al primer cambio.',
      },
      {
        id: 'hybrid',
        text: 'Fijar la fecha y hacer variable el alcance: priorizar un producto mínimo viable y mostrar el avance con un burnup de releases.',
        feedback:
          'Correcto. Fecha fija con alcance negociable es un enfoque híbrido habitual; el burnup hace visible qué entrará y qué no.',
      },
    ],
    lesson:
      'Dominio Development Approach and Life Cycle: elegir el enfoque según la incertidumbre. Principio Value: entregar primero lo que más beneficio aporta.',
  },
  {
    id: 'kanban-wip',
    correctOptionId: 'wip-limit',
    title: 'Veinte tarjetas en "En progreso"',
    context:
      'En el tablero Kanban hay 20 tarjetas en curso para un equipo de cinco personas. Casi nada llega a "Terminado" y el diagrama de flujo acumulado se ensancha.',
    question: '¿Cuál es la acción más efectiva?',
    options: [
      {
        id: 'wip-limit',
        text: 'Fijar límites de trabajo en curso por columna y terminar antes de empezar, ayudando en las tarjetas bloqueadas.',
        feedback:
          'Correcto. Los límites de WIP reducen el cambio de contexto y hacen visibles los cuellos de botella; el flujo mejora al terminar, no al empezar.',
      },
      {
        id: 'more-people',
        text: 'Incorporar más personas para absorber las tarjetas.',
        feedback:
          'Más personas sin limitar el WIP añaden más trabajo a medias y más coordinación; el problema es de flujo, no de capacidad.',
      },
      {
        id: 'more-columns',
        text: 'Añadir columnas intermedias para que el tablero se vea más ordenado.',
        feedback:
          'Más columnas no reducen el trabajo en paralelo; solo reparten el mismo atasco en más sitios.',
      },
    ],
    lesson:
      'Dominio Project Work: gestionar el flujo con límites de WIP y el diagrama de flujo acumulado (CFD). Principio Systems Thinking: optimizar el sistema, no las partes.',
  },
  {
    id: 'integration-risk',
    correctOptionId: 'spike',
    title: 'Riesgo técnico de integración',
    context:
      'En la planificación aparece una integración con un sistema externo que nadie del equipo conoce. Es necesaria para la entrega final, dentro de seis sprints.',
    question: '¿Cómo gestionas esta incertidumbre?',
    options: [
      {
        id: 'ignore',
        text: 'Seguir con el plan; si surge un problema, se resolverá cuando llegue.',
        feedback:
          'Dejar la incertidumbre para el final concentra el riesgo donde ya no hay margen de maniobra.',
      },
      {
        id: 'spike',
        text: 'Hacer un spike acotado en el próximo sprint para probar la integración, registrar el riesgo y reservar contingencia.',
        feedback:
          'Correcto. Un experimento temprano y acotado convierte la incertidumbre en conocimiento y permite planear la respuesta al riesgo con tiempo.',
      },
      {
        id: 'last-sprint',
        text: 'Programar la integración en el último sprint, cuando el resto esté terminado.',
        feedback:
          'Es la opción de mayor riesgo: cualquier sorpresa en la integración se descubre sin tiempo para reaccionar.',
      },
    ],
    lesson:
      'Dominio Uncertainty y principio Risk: anticipar amenazas con experimentos tempranos, registro de riesgos y reservas de contingencia.',
  },
];

/** Position in the case list, answer to the current case and running score. */
export interface CaseRun {
  index: number;
  chosenOptionId: string | null;
  correctCount: number;
}

export function startRun(): CaseRun {
  return { index: 0, chosenOptionId: null, correctCount: 0 };
}

export function restartRun(): CaseRun {
  return startRun();
}

export function currentCase(cases: readonly AgileCase[], run: CaseRun): AgileCase | null {
  return cases[run.index] ?? null;
}

export function isFinished(cases: readonly AgileCase[], run: CaseRun): boolean {
  return currentCase(cases, run) === null;
}

/** `null` until an option of this case has been chosen. */
export function isCorrect(aCase: AgileCase, optionId: string | null): boolean | null {
  if (!optionId || !aCase.options.some((option) => option.id === optionId)) return null;
  return optionId === aCase.correctOptionId;
}

export function feedbackFor(aCase: AgileCase, optionId: string | null): string | null {
  return aCase.options.find((option) => option.id === optionId)?.feedback ?? null;
}

/** The first answer is final: choosing again, or choosing an unknown option, changes nothing. */
export function chooseOption(cases: readonly AgileCase[], run: CaseRun, optionId: string): CaseRun {
  const aCase = currentCase(cases, run);
  if (!aCase || run.chosenOptionId !== null) return run;
  const correct = isCorrect(aCase, optionId);
  if (correct === null) return run;
  return { ...run, chosenOptionId: optionId, correctCount: run.correctCount + (correct ? 1 : 0) };
}

/** Moves on only after an answer; past the last case the run is finished. */
export function nextCase(cases: readonly AgileCase[], run: CaseRun): CaseRun {
  if (isFinished(cases, run) || run.chosenOptionId === null) return run;
  return { ...run, index: run.index + 1, chosenOptionId: null };
}
