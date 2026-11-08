/**
 * Demonstrative tables extracted verbatim from the former faelle/demonstratives/{nominativ,akkusativ,dativ}.html
 * pages (`rows`) and from their all-cases page faelle/demonstratives/index.html (`overviewRows`, only where it
 * used different example sentences). `"-"` marks a form without an example, as in the original pages.
 */
import type { DemonstrativeRow, Fall } from './types.ts';

export const demonstrativeRows: Record<
  Fall,
  { rows: DemonstrativeRow[]; overviewRows?: DemonstrativeRow[] }
> = {
  nominativ: {
    rows: [
      {
        type: 'dieser (este/esta)',
        typeTranslation: 'este / esta / estos / estas',
        forms: [
          {
            form: 'dieser',
            example: 'Dieser Mann ist nett.',
            translation: 'Este hombre es amable.',
          },
          {
            form: 'diese',
            example: 'Diese Frau arbeitet hier.',
            translation: 'Esta mujer trabaja aquí.',
          },
          {
            form: 'dieses',
            example: 'Dieses Kind spielt gern.',
            translation: 'Este niño juega con gusto.',
          },
          {
            form: 'diese',
            example: 'Diese Bücher sind neu.',
            translation: 'Estos libros son nuevos.',
          },
        ],
      },
      {
        type: 'jener (aquel/aquella)',
        typeTranslation: 'aquel / aquella / aquellos / aquellas',
        forms: [
          {
            form: 'jener',
            example: 'Jener Baum ist alt.',
            translation: 'Aquel árbol es viejo.',
          },
          {
            form: 'jene',
            example: 'Jene Lampe leuchtet hell.',
            translation: 'Aquella lámpara brilla fuerte.',
          },
          {
            form: 'jenes',
            example: 'Jenes Haus ist groß.',
            translation: 'Aquella casa es grande.',
          },
          {
            form: 'jene',
            example: 'Jene Autos sind teuer.',
            translation: 'Aquellos carros son caros.',
          },
        ],
      },
      {
        type: 'jeder (cada)',
        typeTranslation: 'cada (singular)',
        forms: [
          {
            form: 'jeder',
            example: 'Jeder Student lernt Deutsch.',
            translation: 'Cada estudiante aprende alemán.',
          },
          {
            form: 'jede',
            example: 'Jede Antwort ist wichtig.',
            translation: 'Cada respuesta es importante.',
          },
          {
            form: 'jedes',
            example: 'Jedes Kind braucht Liebe.',
            translation: 'Cada niño necesita amor.',
          },
          {
            form: '-',
            example: '-',
            translation: '(No se usa en plural)',
          },
        ],
      },
      {
        type: 'welcher (cuál)',
        typeTranslation: 'cuál / cuáles (interrogativo)',
        forms: [
          {
            form: 'welcher',
            example: 'Welcher Mann ist dein Lehrer?',
            translation: '¿Cuál hombre es tu profesor?',
          },
          {
            form: 'welche',
            example: 'Welche Farbe ist schön?',
            translation: '¿Cuál color es bonito?',
          },
          {
            form: 'welches',
            example: 'Welches Buch liest du?',
            translation: '¿Cuál libro lees?',
          },
          {
            form: 'welche',
            example: 'Welche Filme magst du?',
            translation: '¿Cuáles películas te gustan?',
          },
        ],
      },
    ],
    overviewRows: [
      {
        type: 'dieser (este/esta)',
        typeTranslation: 'este / esta / estos / estas',
        forms: [
          {
            form: 'dieser',
            example: 'Dieser Mann ist nett.',
            translation: 'Este hombre es amable.',
          },
          {
            form: 'diese',
            example: 'Diese Frau ist freundlich.',
            translation: 'Esta mujer es amigable.',
          },
          {
            form: 'dieses',
            example: 'Dieses Kind ist klein.',
            translation: 'Este niño es pequeño.',
          },
          {
            form: 'diese',
            example: 'Diese Leute sind glücklich.',
            translation: 'Estas personas son felices.',
          },
        ],
      },
      {
        type: 'jener (aquel/aquella)',
        typeTranslation: 'aquel / aquella / aquellos / aquellas',
        forms: [
          {
            form: 'jener',
            example: 'Jener Mann ist groß.',
            translation: 'Aquel hombre es grande.',
          },
          {
            form: 'jene',
            example: 'Jene Frau arbeitet hier.',
            translation: 'Aquella mujer trabaja aquí.',
          },
          {
            form: 'jenes',
            example: 'Jenes Auto ist rot.',
            translation: 'Aquel carro es rojo.',
          },
          {
            form: 'jene',
            example: 'Jene Häuser sind alt.',
            translation: 'Aquellas casas son viejas.',
          },
        ],
      },
      {
        type: 'jeder (cada)',
        typeTranslation: 'cada (singular)',
        forms: [
          {
            form: 'jeder',
            example: 'Jeder Schüler lernt.',
            translation: 'Cada alumno aprende.',
          },
          {
            form: 'jede',
            example: 'Jede Frage ist wichtig.',
            translation: 'Cada pregunta es importante.',
          },
          {
            form: 'jedes',
            example: 'Jedes Wort zählt.',
            translation: 'Cada palabra cuenta.',
          },
          {
            form: '-',
            example: '-',
            translation: '(No se usa en plural)',
          },
        ],
      },
      {
        type: 'welcher (cuál)',
        typeTranslation: 'cuál / cuáles (interrogativo)',
        forms: [
          {
            form: 'welcher',
            example: 'Welcher Mann ist dein Vater?',
            translation: '¿Cuál hombre es tu padre?',
          },
          {
            form: 'welche',
            example: 'Welche Frau ist deine Mutter?',
            translation: '¿Cuál mujer es tu madre?',
          },
          {
            form: 'welches',
            example: 'Welches Buch liest du?',
            translation: '¿Cuál libro lees?',
          },
          {
            form: 'welche',
            example: 'Welche Kinder spielen draußen?',
            translation: '¿Cuáles niños juegan afuera?',
          },
        ],
      },
    ],
  },
  akkusativ: {
    rows: [
      {
        type: 'dieser (este/esta)',
        typeTranslation: 'este / esta / estos / estas',
        forms: [
          {
            form: 'diesen',
            example: 'Ich sehe diesen Mann.',
            translation: 'Veo a este hombre.',
          },
          {
            form: 'diese',
            example: 'Ich kenne diese Frau.',
            translation: 'Conozco a esta mujer.',
          },
          {
            form: 'dieses',
            example: 'Ich mag dieses Buch.',
            translation: 'Me gusta este libro.',
          },
          {
            form: 'diese',
            example: 'Ich kaufe diese Schuhe.',
            translation: 'Compro estos zapatos.',
          },
        ],
      },
      {
        type: 'jener (aquel/aquella)',
        typeTranslation: 'aquel / aquella / aquellos / aquellas',
        forms: [
          {
            form: 'jenen',
            example: 'Er nimmt jenen Stuhl.',
            translation: 'Él toma aquella silla.',
          },
          {
            form: 'jene',
            example: 'Sie braucht jene Lampe.',
            translation: 'Ella necesita aquella lámpara.',
          },
          {
            form: 'jenes',
            example: 'Wir kaufen jenes Auto.',
            translation: 'Compramos aquel carro.',
          },
          {
            form: 'jene',
            example: 'Sie sehen jene Gebäude.',
            translation: 'Ellos ven aquellos edificios.',
          },
        ],
      },
      {
        type: 'jeder (cada)',
        typeTranslation: 'cada (singular)',
        forms: [
          {
            form: 'jeden',
            example: 'Ich frage jeden Lehrer.',
            translation: 'Pregunto a cada profesor.',
          },
          {
            form: 'jede',
            example: 'Er liest jede Zeitung.',
            translation: 'Él lee cada periódico.',
          },
          {
            form: 'jedes',
            example: 'Sie kennt jedes Wort.',
            translation: 'Ella conoce cada palabra.',
          },
          {
            form: '-',
            example: '-',
            translation: '(No se usa en plural)',
          },
        ],
      },
      {
        type: 'welcher (cuál)',
        typeTranslation: 'cuál / cuáles (interrogativo)',
        forms: [
          {
            form: 'welchen',
            example: 'Welchen Film siehst du?',
            translation: '¿Cuál película ves?',
          },
          {
            form: 'welche',
            example: 'Welche Sprache lernst du?',
            translation: '¿Cuál idioma aprendes?',
          },
          {
            form: 'welches',
            example: 'Welches Auto kaufst du?',
            translation: '¿Cuál carro compras?',
          },
          {
            form: 'welche',
            example: 'Welche Bücher liest du?',
            translation: '¿Cuáles libros lees?',
          },
        ],
      },
    ],
  },
  dativ: {
    rows: [
      {
        type: 'dieser (a este/esta)',
        typeTranslation: 'a este / a esta / a estos / a estas',
        forms: [
          {
            form: 'diesem',
            example: 'Ich helfe diesem Mann.',
            translation: 'Ayudo a este hombre.',
          },
          {
            form: 'dieser',
            example: 'Er gibt dieser Frau Geld.',
            translation: 'Él le da dinero a esta mujer.',
          },
          {
            form: 'diesem',
            example: 'Sie dankt diesem Kind.',
            translation: 'Ella le agradece a este niño.',
          },
          {
            form: 'diesen',
            example: 'Wir folgen diesen Leuten.',
            translation: 'Seguimos a estas personas.',
          },
        ],
      },
      {
        type: 'jener (a aquel/aquella)',
        typeTranslation: 'a aquel / a aquella / a aquellos / a aquellas',
        forms: [
          {
            form: 'jenem',
            example: 'Er antwortet jenem Lehrer.',
            translation: 'Él le responde a aquel profesor.',
          },
          {
            form: 'jener',
            example: 'Sie schreibt jener Person.',
            translation: 'Ella le escribe a aquella persona.',
          },
          {
            form: 'jenem',
            example: 'Wir geben jenem Tier Futter.',
            translation: 'Le damos comida a aquel animal.',
          },
          {
            form: 'jenen',
            example: 'Ich helfe jenen Studenten.',
            translation: 'Ayudo a aquellos estudiantes.',
          },
        ],
      },
      {
        type: 'jeder (a cada)',
        typeTranslation: 'a cada (singular)',
        forms: [
          {
            form: 'jedem',
            example: 'Er gibt jedem Schüler ein Buch.',
            translation: 'Él le da un libro a cada alumno.',
          },
          {
            form: 'jeder',
            example: 'Sie hilft jeder Person.',
            translation: 'Ella ayuda a cada persona.',
          },
          {
            form: 'jedem',
            example: 'Wir danken jedem Kind.',
            translation: 'Le agradecemos a cada niño.',
          },
          {
            form: '-',
            example: '-',
            translation: '(No se usa en plural)',
          },
        ],
      },
      {
        type: 'welcher (a cuál)',
        typeTranslation: 'a cuál / a cuáles (interrogativo)',
        forms: [
          {
            form: 'welchem',
            example: 'Mit welchem Lehrer sprichst du?',
            translation: '¿Con cuál profesor hablas?',
          },
          {
            form: 'welcher',
            example: 'Von welcher Person redest du?',
            translation: '¿De cuál persona hablas?',
          },
          {
            form: 'welchem',
            example: 'Aus welchem Land kommst du?',
            translation: '¿De cuál país vienes?',
          },
          {
            form: 'welchen',
            example: 'Mit welchen Freunden gehst du?',
            translation: '¿Con cuáles amigos vas?',
          },
        ],
      },
    ],
  },
};
