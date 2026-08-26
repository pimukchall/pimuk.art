import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ dlcId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { dlcId } = await params;
    const body = await req.json();
    const dlc = await prisma.dlc.update({
      where: { id: dlcId },
      data: {
        name: body.name,
        status: body.status,
        completedYear: body.completedYear ? Number(body.completedYear) : null,
        notes: body.notes ?? null,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(dlc);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ dlcId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { dlcId } = await params;
    await prisma.dlc.delete({ where: { id: dlcId } });
    return NextResponse.json({ success: true });
  });
}
