import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const archivedParam = searchParams.get('archived');
  const where = { archived: archivedParam != null ? archivedParam === 'true' : false };

  const milestones = await prisma.milestone.findMany({
    where,
    include: { tasks: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(milestones);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const title = String(body.title ?? '').trim();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const milestone = await prisma.milestone.create({
      data: {
        title,
        description: body.description ?? null,
        targetDate: body.targetDate ? new Date(body.targetDate) : null,
        status: body.status ?? 'PLANNED',
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(milestone, { status: 201 });
  });
}
