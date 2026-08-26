import { prisma } from '@/lib/prisma';
import TasksClient from './TasksClient';

export default async function AdminTasksPage() {
  const [tasks, notes, milestones] = await Promise.all([
    prisma.task.findMany({
      where: { archived: false, parentTaskId: null },
      include: {
        milestone: true,
        subtasks: { where: { archived: false }, orderBy: { order: 'asc' } },
      },
      orderBy: { order: 'asc' },
    }),
    prisma.note.findMany({ where: { archived: false }, orderBy: { createdAt: 'desc' } }),
    prisma.milestone.findMany({ where: { archived: false }, orderBy: { order: 'asc' } }),
  ]);

  return <TasksClient tasks={tasks} notes={notes} milestones={milestones} />;
}
