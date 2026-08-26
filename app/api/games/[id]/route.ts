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
    const game = await prisma.game.update({
      where: { id },
      data: {
        title: body.title,
        coverUrl: body.coverUrl ?? null,
        platform: body.platform ?? '',
        genre: body.genre ?? '',
        status: body.status ?? 'backlog',
        rating: body.rating != null ? Number(body.rating) : null,
        hoursPlayed: body.hoursPlayed != null ? Number(body.hoursPlayed) : null,
        completedYear: body.completedYear != null ? Number(body.completedYear) : null,
        notes: body.notes ?? null,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(game);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    await prisma.game.delete({ where: { id } });
    return NextResponse.json({ success: true });
  });
}
