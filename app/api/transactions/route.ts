import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const assetId = searchParams.get('assetId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (assetId) where.OR = [{ fromAssetId: assetId }, { toAssetId: assetId }];
  if (from || to) {
    where.occurredAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: { category: true, fromAsset: true, toAsset: true },
    orderBy: { occurredAt: 'desc' },
  });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const amount = Number(body.amount);
    const type = body.type as 'INCOME' | 'EXPENSE' | 'TRANSFER';
    const fromAssetId = body.fromAssetId || null;
    const toAssetId = body.toAssetId || null;

    const ops = [];

    if ((type === 'EXPENSE' || type === 'TRANSFER') && fromAssetId) {
      ops.push(prisma.asset.update({ where: { id: fromAssetId }, data: { currentValue: { decrement: amount } } }));
    }
    if ((type === 'INCOME' || type === 'TRANSFER') && toAssetId) {
      ops.push(prisma.asset.update({ where: { id: toAssetId }, data: { currentValue: { increment: amount } } }));
    }

    const transaction = await prisma.$transaction([
      prisma.transaction.create({
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
      ...ops,
    ]);

    return NextResponse.json(transaction[0], { status: 201 });
  });
}
