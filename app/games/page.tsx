import { prisma } from '@/lib/prisma';
import GamesClient from './GamesClient';

export const dynamic = 'force-dynamic';

const STATUS_ORDER: Record<string, number> = { playing: 0, backlog: 1, completed: 2, dropped: 3 };

export default async function GamesPage() {
  const games = await prisma.game.findMany({ orderBy: { order: 'asc' } });
  games.sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9) || a.order - b.order);
  return <GamesClient games={games} />;
}
