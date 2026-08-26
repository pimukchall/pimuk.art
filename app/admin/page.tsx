import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [
    unreadContacts,
    publishedProjects,
    gamesCount,
    itAssetsCount,
    licensesRenewingSoon,
    subscriptionsDueSoon,
    tasksDueOrOverdue,
    assets,
    liabilities,
    monthTransactions,
  ] = await Promise.all([
    prisma.contact.count({ where: { read: false } }),
    prisma.project.count({ where: { published: true } }),
    prisma.game.count(),
    prisma.iTAsset.count({ where: { archived: false } }),
    prisma.license.count({ where: { archived: false, renewalDate: { lte: in30Days } } }),
    prisma.recurringRule.count({ where: { active: true, archived: false, nextRunAt: { lte: in7Days } } }),
    prisma.task.count({ where: { archived: false, status: { not: 'DONE' }, dueDate: { lte: endOfToday } } }),
    prisma.asset.findMany({ where: { archived: false } }),
    prisma.liability.findMany({ where: { archived: false } }),
    prisma.transaction.findMany({ where: { occurredAt: { gte: startOfMonth } } }),
  ]);

  const netWorth = assets.reduce((s, a) => s + a.currentValue, 0) - liabilities.reduce((s, l) => s + l.currentBalance, 0);
  const monthIncome = monthTransactions.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const monthExpense = monthTransactions.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

  return (
    <AdminDashboardClient
      stats={{
        unreadContacts,
        publishedProjects,
        gamesCount,
        itAssetsCount,
        licensesRenewingSoon,
        subscriptionsDueSoon,
        tasksDueOrOverdue,
        netWorth,
        monthIncome,
        monthExpense,
      }}
    />
  );
}
