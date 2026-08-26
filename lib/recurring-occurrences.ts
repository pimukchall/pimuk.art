import { advanceDate } from './recurring-engine';
import type { RecurringFrequency } from '@prisma/client';

/**
 * Returns every occurrence date of a recurring rule that falls within [rangeStart, rangeEnd).
 * Steps forward from startDate — correct for any month, past or future, not just the rule's
 * literal nextRunAt.
 */
export function occurrencesInRange(
  startDate: Date,
  frequency: RecurringFrequency,
  interval: number,
  endDate: Date | null,
  rangeStart: Date,
  rangeEnd: Date
): Date[] {
  const occurrences: Date[] = [];
  let cursor = new Date(startDate);
  let guard = 0;

  while (cursor < rangeEnd && guard < 10_000) {
    guard++;
    if (endDate && cursor > endDate) break;
    if (cursor >= rangeStart) occurrences.push(new Date(cursor));
    cursor = advanceDate(cursor, frequency, interval);
  }

  return occurrences;
}
