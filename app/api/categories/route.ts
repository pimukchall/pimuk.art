import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const where = type ? { type: type as 'INCOME' | 'EXPENSE' | 'TRANSFER' } : {};

  const categories = await prisma.category.findMany({ where, orderBy: { order: 'asc' } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        type: body.type,
        icon: body.icon ?? null,
        color: body.color ?? null,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(category, { status: 201 });
  });
}
