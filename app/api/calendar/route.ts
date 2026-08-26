import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { occurrencesInRange } from '@/lib/recurring-occurrences';

export const dynamic = 'force-dynamic';

type CalendarEventOut = {
  id: string;
  title: string;
  date: string;
  sourceType: 'MANUAL' | 'TASK' | 'MILESTONE' | 'IT_ASSET_WARRANTY' | 'LICENSE_RENEWAL' | 'RECURRING_TRANSACTION';
  sourceId: string;
  href: string;
};

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get('year')) || new Date().getFullYear();
  const month = Number(searchParams.get('month')) ?? new Date().getMonth();

  const rangeStart = new Date(year, month, 1);
  const rangeEnd = new Date(year, month + 1, 1);
  const inRange = (d: Date | null) => !!d && d >= rangeStart && d < rangeEnd;
  const toDateKey = (d: Date) => d.toISOString().slice(0, 10);

  const [manual, tasks, milestones, itAssets, licenses, recurringRules] = await Promise.all([
    // Overlaps the viewed month: starts before range ends, and (ends after range starts, or has no end).
    prisma.calendarEvent.findMany({
      where: {
        startAt: { lt: rangeEnd },
        OR: [{ endAt: null }, { endAt: { gte: rangeStart } }],
      },
    }),
    prisma.task.findMany({ where: { archived: false, dueDate: { gte: rangeStart, lt: rangeEnd } } }),
    prisma.milestone.findMany({ where: { archived: false, targetDate: { gte: rangeStart, lt: rangeEnd } } }),
    prisma.iTAsset.findMany({ where: { archived: false, warrantyExpiry: { gte: rangeStart, lt: rangeEnd } } }),
    prisma.license.findMany({ where: { archived: false, renewalDate: { gte: rangeStart, lt: rangeEnd } } }),
    prisma.recurringRule.findMany({ where: { active: true, archived: false } }),
  ]);

  const events: CalendarEventOut[] = [
    ...manual.flatMap((e) => {
      const start = e.startAt < rangeStart ? rangeStart : e.startAt;
      const end = e.endAt && e.endAt < rangeEnd ? e.endAt : new Date(rangeEnd.getTime() - 1);
      const days: CalendarEventOut[] = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push({
          id: `manual-${e.id}-${toDateKey(d)}`,
          title: e.title,
          date: toDateKey(d),
          sourceType: 'MANUAL',
          sourceId: e.id,
          href: '/admin/calendar',
        });
      }
      return days;
    }),
    ...tasks
      .filter((t) => inRange(t.dueDate))
      .map((t) => ({
        id: `task-${t.id}`,
        title: t.title,
        date: toDateKey(t.dueDate as Date),
        sourceType: 'TASK' as const,
        sourceId: t.id,
        href: '/admin/tasks',
      })),
    ...milestones
      .filter((m) => inRange(m.targetDate))
      .map((m) => ({
        id: `milestone-${m.id}`,
        title: m.title,
        date: toDateKey(m.targetDate as Date),
        sourceType: 'MILESTONE' as const,
        sourceId: m.id,
        href: '/admin/timeline',
      })),
    ...itAssets
      .filter((a) => inRange(a.warrantyExpiry))
      .map((a) => ({
        id: `it-asset-${a.id}`,
        title: `หมดประกัน: ${a.name}`,
        date: toDateKey(a.warrantyExpiry as Date),
        sourceType: 'IT_ASSET_WARRANTY' as const,
        sourceId: a.id,
        href: '/admin/it-assets',
      })),
    ...licenses
      .filter((l) => inRange(l.renewalDate))
      .map((l) => ({
        id: `license-${l.id}`,
        title: `ต่ออายุ: ${l.name}`,
        date: toDateKey(l.renewalDate as Date),
        sourceType: 'LICENSE_RENEWAL' as const,
        sourceId: l.id,
        href: '/admin/licenses',
      })),
    ...recurringRules.flatMap((r) =>
      occurrencesInRange(r.startDate, r.frequency, r.interval, r.endDate, rangeStart, rangeEnd).map((d) => ({
        id: `recurring-${r.id}-${toDateKey(d)}`,
        title: `ตัดเงิน: ${r.title}`,
        date: toDateKey(d),
        sourceType: 'RECURRING_TRANSACTION' as const,
        sourceId: r.id,
        href: '/admin/transactions',
      }))
    ),
  ];

  return NextResponse.json({ events });
}
