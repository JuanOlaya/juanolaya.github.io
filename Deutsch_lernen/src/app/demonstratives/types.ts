export const FAELLE = ['nominativ', 'akkusativ', 'dativ'] as const;

export type Fall = (typeof FAELLE)[number];

export function isFall(value: unknown): value is Fall {
  return FAELLE.includes(value as Fall);
}

/** One gender column: the demonstrative form, an example sentence and its Spanish translation. */
export interface DemonstrativeForm {
  form: string;
  example: string;
  translation: string;
}

/** One table row: a demonstrative (dieser, jener…) and its forms for Männlich, Weiblich, Neutral, Plural. */
export interface DemonstrativeRow {
  type: string;
  typeTranslation: string;
  forms: DemonstrativeForm[];
}
