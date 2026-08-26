import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const archived = searchParams.get('archived');
  const where: Record<string, unknown> = { archived: archived != null ? archived === 'true' : false };

  const rules = await prisma.recurringRule.findMany({
    where,
    include: { category: true, fromAsset: true, toAsset: true },
    orderBy: { nextRunAt: 'asc' },
  });
  return NextResponse.json(rules);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return NextResponse.json({ error: 'ต้องระบุชื่อรายการ' }, { status: 400 });
    const amount = Number(body.amount);
    if (!(amount > 0)) return NextResponse.json({ error: 'จำนวนเงินต้องมากกว่า 0' }, { status: 400 });

    const rule = await prisma.recurringRule.create({
      data: {
        title,
        type: body.type,
        amount,
        categoryId: body.categoryId || null,
        fromAssetId: body.fromAssetId || null,
        toAssetId: body.toAssetId || null,
        note: body.note || null,
        frequency: body.frequency ?? 'MONTHLY',
        interval: Number(body.interval) || 1,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        nextRunAt: new Date(body.nextRunAt ?? body.startDate),
        active: body.active ?? true,
      },
      include: { category: true, fromAsset: true, toAsset: true },
    });
    return NextResponse.json(rule, { status: 201 });
  });
}
