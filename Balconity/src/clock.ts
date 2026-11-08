export interface CityClock {
  /** 24-hour "HH:MM". */
  time: string;
  /** "Weekday, D Mon" in the viewer's language, e.g. "Monday, 5 Jan". */
  date: string;
}

/**
 * Reads the parts by type: the original picked them by position, which only worked in some locales
 * (en-US, for example, puts the month before the day).
 */
export function formatCityClock(now: Date, timeZone: string, locale?: string): CityClock {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((item) => item.type === type)?.value ?? '';
  return {
    time: `${part('hour')}:${part('minute')}`,
    date: `${part('weekday')}, ${part('day')} ${part('month')}`,
  };
}
