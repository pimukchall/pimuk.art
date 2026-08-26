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
    const liability = await prisma.liability.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        originalAmount: Number(body.originalAmount) || 0,
        currentBalance: Number(body.currentBalance) || 0,
        interestRate: body.interestRate != null ? Number(body.interestRate) : null,
        dueDay: body.dueDay != null ? Number(body.dueDay) : null,
        note: body.note ?? null,
        archived: Boolean(body.archived),
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(liability);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    await prisma.liability.delete({ where: { id } });
    return NextResponse.json({ success: true });
  });
}
