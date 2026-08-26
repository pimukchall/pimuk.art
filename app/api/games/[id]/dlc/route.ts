import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dlcs = await prisma.dlc.findMany({
    where: { gameId: id },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(dlcs);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const body = await req.json();
    const dlc = await prisma.dlc.create({
      data: {
        gameId: id,
        name: body.name,
        status: body.status ?? 'not_owned',
        completedYear: body.completedYear ? Number(body.completedYear) : null,
        notes: body.notes ?? null,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(dlc, { status: 201 });
  });
}
