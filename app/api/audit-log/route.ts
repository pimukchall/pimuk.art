import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const model = searchParams.get('model');
  const action = searchParams.get('action');
  const cursor = searchParams.get('cursor');
  const take = Math.min(Number(searchParams.get('take')) || 50, 100);

  const where: Record<string, unknown> = {};
  if (model) where.model = model;
  if (action) where.action = action;

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  const nextCursor = logs.length === take ? logs[logs.length - 1].id : null;

  return NextResponse.json({ logs, nextCursor });
}
