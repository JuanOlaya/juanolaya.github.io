import { demonstrativeRows } from './rows.ts';
import type { DemonstrativeRow, Fall } from './types.ts';

export const GENDER_TITLES = ['Männlich (M)', 'Weiblich (F)', 'Neutral (N)', 'Plural (P)'] as const;

export interface DemonstrativeCase {
  fall: Fall;
  label: string;
  /** Page heading and subtitle of the former single-case page. */
  title: string;
  intro: string;
  /** What the case marks, as worded on the former all-cases page. */
  description: string;
  rows: DemonstrativeRow[];
  overviewRows: DemonstrativeRow[];
  /** Full Tailwind class names, written out so the compiler finds them. */
  theme: { header: string; genders: readonly string[]; chip: string; heading: string };
}

function caseOf(
  fall: Fall,
  fields: Omit<DemonstrativeCase, 'fall' | 'rows' | 'overviewRows'>,
): DemonstrativeCase {
  const { rows, overviewRows } = demonstrativeRows[fall];
  return { fall, ...fields, rows, overviewRows: overviewRows ?? rows };
}

export const demonstrativeCases: Record<Fall, DemonstrativeCase> = {
  nominativ: caseOf('nominativ', {
    label: 'Nominativ',
    title: 'German Demonstratives - Nominativ Case (A1–A2)',
    intro: 'Demostrativos en alemán: dieser (este), jener (aquel), jeder (cada), welcher (cuál).',
    description: 'El Nominativ identifica el sujeto de la oración - quién o qué realiza la acción.',
    theme: {
      header: 'bg-blue-100',
      genders: ['bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500'],
      chip: 'bg-blue-50 text-blue-800',
      heading: 'text-blue-800',
    },
  }),
  akkusativ: caseOf('akkusativ', {
    label: 'Akkusativ',
    title: 'German Demonstratives - Akkusativ Case (A1–A2)',
    intro:
      'Demostrativos en alemán: dieser (este), jener (aquel), jeder (cada), welcher (cuál) - Caso Akkusativ.',
    description:
      'El Akkusativ identifica el objeto directo - qué o a quién recibe directamente la acción del verbo.',
    theme: {
      header: 'bg-red-100',
      genders: ['bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500'],
      chip: 'bg-red-50 text-red-800',
      heading: 'text-red-800',
    },
  }),
  dativ: caseOf('dativ', {
    label: 'Dativ',
    title: 'German Demonstratives - Dativ Case (A1–A2)',
    intro:
      'Demostrativos en alemán: diesem (a este), jenem (a aquel), jedem (a cada), welchem (a cuál) - Caso Dativ.',
    description:
      'El Dativ identifica el objeto indirecto - a quién o para quién se realiza la acción indirectamente.',
    theme: {
      header: 'bg-green-100',
      genders: ['bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'],
      chip: 'bg-green-50 text-green-700',
      heading: 'text-green-700',
    },
  }),
};

export interface HighlightedExample {
  before: string;
  match: string;
  after: string;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Splits an example around the first whole-word, case-insensitive occurrence of the form, as the old pages bolded it. */
export function highlightForm(example: string, form: string): HighlightedExample {
  const match = new RegExp(`\\b(${escapeRegExp(form)})\\b`, 'i').exec(example);
  if (!match) return { before: example, match: '', after: '' };
  return {
    before: example.slice(0, match.index),
    match: match[0],
    after: example.slice(match.index + match[0].length),
  };
}

/** The old pages show a sentence only when both it and its translation exist; `-` marks a missing one. */
export function hasExample(form: { example: string; translation: string }): boolean {
  return Boolean(form.example && form.example !== '-' && form.translation && form.translation !== '-');
}
