import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const body = await req.json();
    const title = String(body.title ?? '').trim();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description: body.description ?? null,
        priority: body.priority ?? 'NOT_URGENT_NOT_IMPORTANT',
        status: body.status ?? 'TODO',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        milestoneId: body.milestoneId || null,
        recurringRuleId: body.recurringRuleId || null,
        archived: Boolean(body.archived),
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(task);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const task = await prisma.task.update({ where: { id }, data: { archived: true } });
    return NextResponse.json(task);
  });
}
