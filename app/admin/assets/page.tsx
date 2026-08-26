import { prisma } from '@/lib/prisma';
import AssetsDashboardClient from './AssetsDashboardClient';

export default async function AdminAssetsPage() {
  const [assets, liabilities, categories, valuations] = await Promise.all([
    prisma.asset.findMany({ orderBy: { order: 'asc' } }),
    prisma.liability.findMany({ orderBy: { order: 'asc' } }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
    prisma.assetValuation.findMany({ orderBy: { recordedAt: 'asc' } }),
  ]);

  return (
    <AssetsDashboardClient
      assets={assets}
      liabilities={liabilities}
      categories={categories}
      valuations={valuations}
    />
  );
}
