import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const ids = Array.isArray(body.ids) ? (body.ids as string[]) : [];
    if (ids.length === 0) return NextResponse.json({ error: 'ต้องระบุ ids' }, { status: 400 });

    await prisma.$transaction(
      ids.map((id, index) => prisma.task.update({ where: { id }, data: { order: index } }))
    );

    return NextResponse.json({ success: true });
  });
}
