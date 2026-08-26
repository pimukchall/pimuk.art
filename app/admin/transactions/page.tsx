import { prisma } from '@/lib/prisma';
import TransactionsClient from './TransactionsClient';

export default async function AdminTransactionsPage() {
  const [transactions, assets, categories, recurringRules] = await Promise.all([
    prisma.transaction.findMany({
      include: { category: true, fromAsset: true, toAsset: true },
      orderBy: { occurredAt: 'desc' },
    }),
    prisma.asset.findMany({ where: { archived: false }, orderBy: { order: 'asc' } }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.recurringRule.findMany({
      where: { archived: false },
      include: { category: true, fromAsset: true, toAsset: true },
      orderBy: { nextRunAt: 'asc' },
    }),
  ]);

  return (
    <TransactionsClient
      transactions={transactions}
      assets={assets}
      categories={categories}
      recurringRules={recurringRules}
    />
  );
}
