export const TARGET_OPTION = 'Guardar';
export const SCENARIO_A_SIZE = 24;

export const DISTRACTOR_OPTIONS: readonly string[] = [
  'Editar',
  'Cerrar',
  'Enviar',
  'Copiar',
  'Pegar',
  'Borrar',
  'Salir',
  'Imprimir',
  'Nuevo',
  'Abrir',
  'Buscar',
  'Filtro',
  'Configurar',
  'Ayuda',
  'Compartir',
  'Descargar',
  'Subir',
  'Sincronizar',
  'Historial',
  'Exportar',
  'Importar',
  'Deshacer',
  'Rehacer',
];

/** Fisher–Yates; `random` is injectable so the layout can be tested deterministically. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 23 distractors plus the target, in random order. */
export function scenarioAOptions(random: () => number = Math.random): string[] {
  const distractors = shuffle(DISTRACTOR_OPTIONS, random).slice(0, SCENARIO_A_SIZE - 1);
  return shuffle([...distractors, TARGET_OPTION], random);
}

export function elapsedMs(start: number, end: number): number {
  return Math.round(end - start);
}

/** How much faster scenario B was, as a whole percentage; never negative. */
export function improvementPercent(timeA: number, timeB: number): number {
  if (timeA <= 0) return 0;
  return Math.max(0, Math.round(((timeA - timeB) / timeA) * 100));
}
