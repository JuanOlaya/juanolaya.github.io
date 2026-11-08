import { segmentsFillBar } from '@shared/components/stacked-bar';
import { describe, expect, it } from 'vitest';
import { germanTabs, grammarBar, quizQuestions, spanishTabs, vocabularyBar } from './content';

describe('Antonella content', () => {
  it('fills both percentage bars to exactly 100%', () => {
    expect(segmentsFillBar(vocabularyBar)).toBe(true);
    expect(segmentsFillBar(grammarBar)).toBe(true);
  });

  it('has exactly one correct answer per quiz question', () => {
    for (const question of quizQuestions) {
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
    }
  });

  it('gives each equivalence panel three tabs with unique ids', () => {
    for (const tabs of [spanishTabs, germanTabs]) {
      expect(new Set(tabs.map((tab) => tab.id)).size).toBe(3);
    }
  });
});
