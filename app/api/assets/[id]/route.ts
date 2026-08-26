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
    const currentValue = Number(body.currentValue);

    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        initialValue: Number(body.initialValue) || 0,
        currentValue,
        icon: body.icon ?? null,
        color: body.color ?? null,
        note: body.note ?? null,
        archived: Boolean(body.archived),
        order: Number(body.order) || 0,
      },
    });

    if (currentValue !== existing.currentValue) {
      await prisma.assetValuation.create({ data: { assetId: id, value: currentValue } });
    }

    return NextResponse.json(asset);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    await prisma.asset.delete({ where: { id } });
    return NextResponse.json({ success: true });
  });
}
