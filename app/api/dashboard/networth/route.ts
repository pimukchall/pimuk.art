import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [assets, liabilities, valuations] = await Promise.all([
    prisma.asset.findMany({ where: { archived: false } }),
    prisma.liability.findMany({ where: { archived: false } }),
    prisma.assetValuation.findMany({ orderBy: { recordedAt: 'asc' } }),
  ]);

  const totalAssets = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.currentBalance, 0);
  const netWorth = totalAssets - totalLiabilities;

  const byType: Record<string, number> = {};
  for (const a of assets) {
    byType[a.type] = (byType[a.type] ?? 0) + a.currentValue;
  }

  const trendMap = new Map<string, number>();
  for (const v of valuations) {
    const month = v.recordedAt.toISOString().slice(0, 7);
    trendMap.set(month, (trendMap.get(month) ?? 0) + v.value);
  }
  const trend = Array.from(trendMap.entries()).map(([month, value]) => ({ month, value }));

  return NextResponse.json({
    totalAssets,
    totalLiabilities,
    netWorth,
    breakdown: Object.entries(byType).map(([type, value]) => ({ type, value })),
    trend,
  });
}
