export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface QuizAnswer {
  question: QuizQuestion;
  selected: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toQuestion(raw: unknown): QuizQuestion | null {
  if (!isRecord(raw)) return null;
  const { question, options, answer_index: answerIndex, explanation } = raw;
  if (typeof question !== 'string' || typeof explanation !== 'string') return null;
  if (!Array.isArray(options) || !options.every((option) => typeof option === 'string')) return null;
  if (typeof answerIndex !== 'number' || !Number.isInteger(answerIndex)) return null;
  if (answerIndex < 0 || answerIndex >= options.length) return null;
  return { question, options, answerIndex, explanation };
}

/** The model is asked for JSON but may still return something else, so validate before playing. */
export function parseQuiz(jsonText: string): QuizQuestion[] {
  const data: unknown = JSON.parse(jsonText);
  if (!Array.isArray(data) || data.length === 0) throw new Error('El examen no es una lista de preguntas.');
  const questions = data.map(toQuestion);
  if (questions.some((question) => question === null)) throw new Error('Pregunta de examen no válida.');
  return questions as QuizQuestion[];
}

export function isCorrect(answer: QuizAnswer): boolean {
  return answer.selected === answer.question.answerIndex;
}

export function quizScore(answers: readonly QuizAnswer[]): number {
  return answers.filter(isCorrect).length;
}
