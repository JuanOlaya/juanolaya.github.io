import { describe, expect, it } from 'vitest';
import { formatCityClock } from './clock.ts';

const NOON_UTC = new Date('2026-01-05T12:34:00Z');

describe('formatCityClock', () => {
  it('formats the local time of the city in 24-hour format', () => {
    expect(formatCityClock(NOON_UTC, 'Asia/Tokyo', 'en-US')).toEqual({
      time: '21:34',
      date: 'Monday, 5 Jan',
    });
  });

  it('keeps day before month even in locales that put the month first', () => {
    expect(formatCityClock(NOON_UTC, 'America/Sao_Paulo', 'en-US').date).toBe('Monday, 5 Jan');
  });

  it('pads early hours and handles the date change', () => {
    expect(formatCityClock(new Date('2026-01-05T23:05:00Z'), 'Europe/Bucharest', 'en-GB')).toEqual({
      time: '01:05',
      date: 'Tuesday, 6 Jan',
    });
  });

  it('uses the requested language for names', () => {
    expect(formatCityClock(NOON_UTC, 'Europe/Rome', 'de-DE').date).toMatch(/^Montag, 5 Jan/);
  });
});
