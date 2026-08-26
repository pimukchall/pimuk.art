import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

function reverseOps(tx: {
  type: string;
  amount: number;
  fromAssetId: string | null;
  toAssetId: string | null;
}): Prisma.PrismaPromise<unknown>[] {
  const ops: Prisma.PrismaPromise<unknown>[] = [];
  if ((tx.type === 'EXPENSE' || tx.type === 'TRANSFER') && tx.fromAssetId) {
    ops.push(prisma.asset.update({ where: { id: tx.fromAssetId }, data: { currentValue: { increment: tx.amount } } }));
  }
  if ((tx.type === 'INCOME' || tx.type === 'TRANSFER') && tx.toAssetId) {
    ops.push(prisma.asset.update({ where: { id: tx.toAssetId }, data: { currentValue: { decrement: tx.amount } } }));
  }
  return ops;
}

function applyOps(tx: {
  type: string;
  amount: number;
  fromAssetId: string | null;
  toAssetId: string | null;
}): Prisma.PrismaPromise<unknown>[] {
  const ops: Prisma.PrismaPromise<unknown>[] = [];
  if ((tx.type === 'EXPENSE' || tx.type === 'TRANSFER') && tx.fromAssetId) {
    ops.push(prisma.asset.update({ where: { id: tx.fromAssetId }, data: { currentValue: { decrement: tx.amount } } }));
  }
  if ((tx.type === 'INCOME' || tx.type === 'TRANSFER') && tx.toAssetId) {
    ops.push(prisma.asset.update({ where: { id: tx.toAssetId }, data: { currentValue: { increment: tx.amount } } }));
  }
  return ops;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const amount = Number(body.amount);
    const type = body.type as 'INCOME' | 'EXPENSE' | 'TRANSFER';
    const fromAssetId = body.fromAssetId || null;
    const toAssetId = body.toAssetId || null;

    const reversal = reverseOps(existing);
    const result = await prisma.$transaction([
      ...reversal,
      prisma.transaction.update({
        where: { id },
        data: {
          type,
          amount,
          categoryId: body.categoryId || null,
          fromAssetId,
          toAssetId,
          note: body.note ?? null,
          receiptUrl: body.receiptUrl ?? null,
          occurredAt: new Date(body.occurredAt),
        },
      }),
      ...applyOps({ type, amount, fromAssetId, toAssetId }),
    ]);

    return NextResponse.json(result[reversal.length]);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.$transaction([
      ...reverseOps(existing),
      prisma.transaction.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  });
}
