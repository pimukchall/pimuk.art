import { prisma } from '@/lib/prisma';
import ITAssetsClient from './ITAssetsClient';

export default async function AdminITAssetsPage() {
  const items = await prisma.iTAsset.findMany({ where: { archived: false }, orderBy: { order: 'asc' } });
  return <ITAssetsClient items={items} />;
}
