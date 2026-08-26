import { prisma } from './prisma';
import { auditStorage } from './audit-context';
import type { RecurringFrequency } from '@prisma/client';

export function advanceDate(date: Date, frequency: RecurringFrequency, interval: number): Date {
  const next = new Date(date);
  switch (frequency) {
    case 'DAILY':
      next.setDate(next.getDate() + interval);
      break;
    case 'WEEKLY':
      next.setDate(next.getDate() + interval * 7);
      break;
    case 'MONTHLY':
      next.setMonth(next.getMonth() + interval);
      break;
    case 'YEARLY':
      next.setFullYear(next.getFullYear() + interval);
      break;
  }
  return next;
}

export async function runDueRecurringRules(): Promise<{ processed: number; transactionsCreated: number }> {
  return auditStorage.run({ userId: 'system', email: 'cron' }, async () => {
    const now = new Date();
    const dueRules = await prisma.recurringRule.findMany({
      where: { active: true, archived: false, nextRunAt: { lte: now } },
    });

    let transactionsCreated = 0;

    for (const rule of dueRules) {
      let occurrence = rule.nextRunAt;
      let cursor = rule.nextRunAt;
      let stillActive = true;

      // Catch up on every missed occurrence up to now, capped at endDate.
      while (cursor <= now) {
        if (rule.endDate && cursor > rule.endDate) {
          stillActive = false;
          break;
        }

        const ops = [];
        if ((rule.type === 'EXPENSE' || rule.type === 'TRANSFER') && rule.fromAssetId) {
          ops.push(prisma.asset.update({ where: { id: rule.fromAssetId }, data: { currentValue: { decrement: rule.amount } } }));
        }
        if ((rule.type === 'INCOME' || rule.type === 'TRANSFER') && rule.toAssetId) {
          ops.push(prisma.asset.update({ where: { id: rule.toAssetId }, data: { currentValue: { increment: rule.amount } } }));
        }

        await prisma.$transaction([
          prisma.transaction.create({
            data: {
              type: rule.type,
              amount: rule.amount,
              categoryId: rule.categoryId,
              fromAssetId: rule.fromAssetId,
              toAssetId: rule.toAssetId,
              note: rule.note ?? `Auto: ${rule.title}`,
              occurredAt: cursor,
              recurringRuleId: rule.id,
            },
          }),
          ...ops,
        ]);
        transactionsCreated++;

        occurrence = cursor;
        cursor = advanceDate(occurrence, rule.frequency, rule.interval);
      }

      await prisma.recurringRule.update({
        where: { id: rule.id },
        data: { nextRunAt: cursor, active: stillActive },
      });
    }

    return { processed: dueRules.length, transactionsCreated };
  });
}
