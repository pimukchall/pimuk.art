import { describe, it, expect } from 'vitest';
import { advanceDate } from './recurring-engine';

// advanceDate mutates via local-time Date setters, so tests use local-time
// constructors and local getters throughout to stay timezone-independent.
const localDate = (y: number, m: number, d: number) => new Date(y, m - 1, d);
const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

describe('advanceDate', () => {
  it('advances DAILY by interval days', () => {
    expect(fmt(advanceDate(localDate(2026, 1, 1), 'DAILY', 3))).toBe('2026-01-04');
  });

  it('advances WEEKLY by interval weeks', () => {
    expect(fmt(advanceDate(localDate(2026, 1, 1), 'WEEKLY', 2))).toBe('2026-01-15');
  });

  it('advances MONTHLY by interval months', () => {
    expect(fmt(advanceDate(localDate(2026, 1, 15), 'MONTHLY', 1))).toBe('2026-02-15');
  });

  it('advances YEARLY by interval years', () => {
    expect(fmt(advanceDate(localDate(2026, 6, 15), 'YEARLY', 1))).toBe('2027-06-15');
  });

  it('supports interval > 1', () => {
    expect(fmt(advanceDate(localDate(2026, 1, 1), 'MONTHLY', 3))).toBe('2026-04-01');
  });
});
