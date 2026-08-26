import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const logs = await prisma.iTAssetLog.findMany({
    where: { itAssetId: id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(logs);
}
