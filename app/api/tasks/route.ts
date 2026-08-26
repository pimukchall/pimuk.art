import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const milestoneId = searchParams.get('milestoneId');
  const archivedParam = searchParams.get('archived');

  const where: Record<string, unknown> = {
    archived: archivedParam != null ? archivedParam === 'true' : false,
    parentTaskId: null,
  };
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (milestoneId) where.milestoneId = milestoneId;

  const tasks = await prisma.task.findMany({
    where,
    include: {
      milestone: true,
      subtasks: { where: { archived: false }, orderBy: { order: 'asc' } },
    },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const title = String(body.title ?? '').trim();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const task = await prisma.task.create({
      data: {
        title,
        description: body.description ?? null,
        priority: body.priority ?? 'NOT_URGENT_NOT_IMPORTANT',
        status: body.status ?? 'TODO',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        milestoneId: body.milestoneId || null,
        recurringRuleId: body.recurringRuleId || null,
        parentTaskId: body.parentTaskId || null,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(task, { status: 201 });
  });
}
