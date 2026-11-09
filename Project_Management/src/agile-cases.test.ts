import { describe, expect, it } from 'vitest';
import {
  type AgileCase,
  agileCases,
  chooseOption,
  currentCase,
  feedbackFor,
  isCorrect,
  isFinished,
  nextCase,
  restartRun,
  startRun,
} from './agile-cases';

const twoCases: readonly AgileCase[] = [
  {
    id: 'a',
    title: 'A',
    context: 'ctx',
    question: 'q',
    options: [
      { id: 'a1', text: 'right', feedback: 'yes' },
      { id: 'a2', text: 'wrong', feedback: 'no' },
    ],
    correctOptionId: 'a1',
    lesson: 'l',
  },
  {
    id: 'b',
    title: 'B',
    context: 'ctx',
    question: 'q',
    options: [
      { id: 'b1', text: 'wrong', feedback: 'no' },
      { id: 'b2', text: 'right', feedback: 'yes' },
    ],
    correctOptionId: 'b2',
    lesson: 'l',
  },
];

describe('agile case run', () => {
  it('starts at the first case with nothing chosen and no score', () => {
    const run = startRun();
    expect(run).toEqual({ index: 0, chosenOptionId: null, correctCount: 0 });
    expect(currentCase(twoCases, run)?.id).toBe('a');
    expect(isFinished(twoCases, run)).toBe(false);
  });

  it('is finished at once when there are no cases', () => {
    const run = startRun();
    expect(currentCase([], run)).toBeNull();
    expect(isFinished([], run)).toBe(true);
    expect(chooseOption([], run, 'a1')).toBe(run);
    expect(nextCase([], run)).toBe(run);
  });

  it('scores a correct answer and shows its feedback', () => {
    const run = chooseOption(twoCases, startRun(), 'a1');
    expect(run.chosenOptionId).toBe('a1');
    expect(run.correctCount).toBe(1);
    expect(isCorrect(twoCases[0], run.chosenOptionId)).toBe(true);
    expect(feedbackFor(twoCases[0], run.chosenOptionId)).toBe('yes');
  });

  it('does not score an incorrect answer but still shows its feedback', () => {
    const run = chooseOption(twoCases, startRun(), 'a2');
    expect(run.correctCount).toBe(0);
    expect(isCorrect(twoCases[0], run.chosenOptionId)).toBe(false);
    expect(feedbackFor(twoCases[0], run.chosenOptionId)).toBe('no');
  });

  it('has no verdict and no feedback before an answer', () => {
    expect(isCorrect(twoCases[0], null)).toBeNull();
    expect(feedbackFor(twoCases[0], null)).toBeNull();
    expect(isCorrect(twoCases[0], 'nope')).toBeNull();
    expect(feedbackFor(twoCases[0], 'nope')).toBeNull();
  });

  it('ignores an option that does not belong to the current case', () => {
    const run = startRun();
    expect(chooseOption(twoCases, run, 'b2')).toBe(run);
    expect(chooseOption(twoCases, run, '')).toBe(run);
  });

  it('keeps the first answer when a second option is chosen', () => {
    const answered = chooseOption(twoCases, startRun(), 'a2');
    expect(chooseOption(twoCases, answered, 'a1')).toBe(answered);
  });

  it('does not advance without an answer', () => {
    const run = startRun();
    expect(nextCase(twoCases, run)).toBe(run);
  });

  it('advances to the next case keeping the score and clearing the choice', () => {
    const run = nextCase(twoCases, chooseOption(twoCases, startRun(), 'a1'));
    expect(run).toEqual({ index: 1, chosenOptionId: null, correctCount: 1 });
    expect(currentCase(twoCases, run)?.id).toBe('b');
  });

  it('finishes after the last case and then ignores further input', () => {
    let run = nextCase(twoCases, chooseOption(twoCases, startRun(), 'a2'));
    run = nextCase(twoCases, chooseOption(twoCases, run, 'b2'));
    expect(isFinished(twoCases, run)).toBe(true);
    expect(currentCase(twoCases, run)).toBeNull();
    expect(run.correctCount).toBe(1);
    expect(chooseOption(twoCases, run, 'b1')).toBe(run);
    expect(nextCase(twoCases, run)).toBe(run);
  });

  it('restarts from scratch', () => {
    const run = nextCase(twoCases, chooseOption(twoCases, startRun(), 'a1'));
    expect(restartRun()).toEqual(startRun());
    expect(restartRun()).not.toEqual(run);
  });
});

describe('agile case data', () => {
  it('offers at least three cases with unique ids', () => {
    expect(agileCases.length).toBeGreaterThanOrEqual(3);
    expect(new Set(agileCases.map((c) => c.id)).size).toBe(agileCases.length);
  });

  it('gives every case a valid correct option among at least three unique options', () => {
    for (const aCase of agileCases) {
      const ids = aCase.options.map((o) => o.id);
      expect(ids.length, aCase.id).toBeGreaterThanOrEqual(3);
      expect(new Set(ids).size, aCase.id).toBe(ids.length);
      expect(ids, aCase.id).toContain(aCase.correctOptionId);
    }
  });

  it('has no empty text anywhere', () => {
    for (const aCase of agileCases) {
      for (const text of [aCase.title, aCase.context, aCase.question, aCase.lesson]) {
        expect(text.trim().length, aCase.id).toBeGreaterThan(0);
      }
      for (const option of aCase.options) {
        expect(option.text.trim().length, `${aCase.id}/${option.id}`).toBeGreaterThan(0);
        expect(option.feedback.trim().length, `${aCase.id}/${option.id}`).toBeGreaterThan(0);
      }
    }
  });
});
