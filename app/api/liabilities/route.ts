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
  const where = archivedParam != null ? { archived: archivedParam === 'true' } : {};

  const liabilities = await prisma.liability.findMany({ where, orderBy: { order: 'asc' } });
  return NextResponse.json(liabilities);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const originalAmount = Number(body.originalAmount) || 0;
    const currentBalance = body.currentBalance != null ? Number(body.currentBalance) : originalAmount;

    const liability = await prisma.liability.create({
      data: {
        name: body.name,
        type: body.type,
        originalAmount,
        currentBalance,
        interestRate: body.interestRate != null ? Number(body.interestRate) : null,
        dueDay: body.dueDay != null ? Number(body.dueDay) : null,
        note: body.note ?? null,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(liability, { status: 201 });
  });
}
