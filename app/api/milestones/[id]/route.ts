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

    const milestone = await prisma.milestone.update({
      where: { id },
      data: {
        title,
        description: body.description ?? null,
        targetDate: body.targetDate ? new Date(body.targetDate) : null,
        status: body.status ?? 'PLANNED',
        archived: Boolean(body.archived),
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(milestone);
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    if (searchParams.get('permanent') === 'true') {
      const existing = await prisma.milestone.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      if (!existing.archived) return NextResponse.json({ error: 'ต้อง archive ก่อนจึงจะลบถาวรได้' }, { status: 400 });
      await prisma.milestone.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    const milestone = await prisma.milestone.update({ where: { id }, data: { archived: true } });
    return NextResponse.json(milestone);
  });
}
