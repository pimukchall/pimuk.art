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

  const assets = await prisma.asset.findMany({ where, orderBy: { order: 'asc' } });
  return NextResponse.json(assets);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const initialValue = Number(body.initialValue) || 0;
    const currentValue = body.currentValue != null ? Number(body.currentValue) : initialValue;

    const asset = await prisma.asset.create({
      data: {
        name: body.name,
        type: body.type,
        initialValue,
        currentValue,
        icon: body.icon ?? null,
        color: body.color ?? null,
        note: body.note ?? null,
        order: Number(body.order) || 0,
      },
    });

    await prisma.assetValuation.create({
      data: { assetId: asset.id, value: currentValue },
    });

    return NextResponse.json(asset, { status: 201 });
  });
}
