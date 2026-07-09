import { prisma } from '@/lib/prisma';
import WorkSectionClient from './WorkSectionClient';

export default async function WorkSection() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });
  return <WorkSectionClient projects={projects} />;
}
