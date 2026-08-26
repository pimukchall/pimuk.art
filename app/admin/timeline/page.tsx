import { prisma } from '@/lib/prisma';
import TimelineClient from './TimelineClient';

export default async function AdminTimelinePage() {
  const milestones = await prisma.milestone.findMany({
    where: { archived: false },
    orderBy: { order: 'asc' },
  });
  return <TimelineClient milestones={milestones} />;
}
