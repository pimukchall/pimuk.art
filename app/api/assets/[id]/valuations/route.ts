import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const valuations = await prisma.assetValuation.findMany({
    where: { assetId: id },
    orderBy: { recordedAt: 'asc' },
  });
  return NextResponse.json(valuations);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const body = await req.json();
    const value = Number(body.value);

    const [valuation] = await prisma.$transaction([
      prisma.assetValuation.create({ data: { assetId: id, value } }),
      prisma.asset.update({ where: { id }, data: { currentValue: value } }),
    ]);

    return NextResponse.json(valuation, { status: 201 });
  });
}
