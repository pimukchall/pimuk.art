import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const STATUS_ORDER: Record<string, number> = { playing: 0, backlog: 1, completed: 2, dropped: 3 };

export async function GET() {
  const games = await prisma.game.findMany({ orderBy: { order: 'asc' } });
  games.sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9) || a.order - b.order);
  return NextResponse.json(games);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const game = await prisma.game.create({
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
    return NextResponse.json(game, { status: 201 });
  });
}
