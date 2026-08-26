import { describe, it, expect } from 'vitest';
import { occurrencesInRange } from './recurring-occurrences';

const localDate = (y: number, m: number, d: number) => new Date(y, m - 1, d);
const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

describe('occurrencesInRange', () => {
  it('finds a monthly occurrence in a month well past the start date', () => {
    const startDate = localDate(2026, 1, 15);
    const rangeStart = localDate(2026, 3, 1);
    const rangeEnd = localDate(2026, 4, 1);
    const result = occurrencesInRange(startDate, 'MONTHLY', 1, null, rangeStart, rangeEnd);
    expect(result.map(fmt)).toEqual(['2026-03-15']);
  });

  it('finds multiple weekly occurrences within one month', () => {
    const startDate = localDate(2026, 1, 5);
    const rangeStart = localDate(2026, 1, 1);
    const rangeEnd = localDate(2026, 2, 1);
    const result = occurrencesInRange(startDate, 'WEEKLY', 1, null, rangeStart, rangeEnd);
    expect(result.map(fmt)).toEqual(['2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26']);
  });

  it('respects endDate — no occurrences after it', () => {
    const startDate = localDate(2026, 1, 1);
    const endDate = localDate(2026, 2, 15);
    const rangeStart = localDate(2026, 3, 1);
    const rangeEnd = localDate(2026, 4, 1);
    const result = occurrencesInRange(startDate, 'MONTHLY', 1, endDate, rangeStart, rangeEnd);
    expect(result).toEqual([]);
  });

  it('returns empty array when the range is entirely before the start date', () => {
    const startDate = localDate(2026, 6, 1);
    const rangeStart = localDate(2026, 1, 1);
    const rangeEnd = localDate(2026, 2, 1);
    const result = occurrencesInRange(startDate, 'MONTHLY', 1, null, rangeStart, rangeEnd);
    expect(result).toEqual([]);
  });
});
