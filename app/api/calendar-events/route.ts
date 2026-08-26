import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: Record<string, unknown> = {};
  if (from || to) {
    where.startAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  const events = await prisma.calendarEvent.findMany({ where, orderBy: { startAt: 'asc' } });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const title = String(body.title ?? '').trim();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!body.startAt) return NextResponse.json({ error: 'startAt is required' }, { status: 400 });

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description: body.description ?? null,
        startAt: new Date(body.startAt),
        endAt: body.endAt ? new Date(body.endAt) : null,
        allDay: Boolean(body.allDay),
        location: body.location ?? null,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(event, { status: 201 });
  });
}
