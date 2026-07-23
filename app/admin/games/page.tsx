import { prisma } from '@/lib/prisma';
import GamesAdminClient from './GamesAdminClient';

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({ orderBy: { order: 'asc' } });
  return <GamesAdminClient games={games} />;
}
