import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const archivedParam = searchParams.get('archived');
  const where = { archived: archivedParam != null ? archivedParam === 'true' : false };

  const notes = await prisma.note.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const content = String(body.content ?? '').trim();
    if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

    const note = await prisma.note.create({ data: { content } });
    return NextResponse.json(note, { status: 201 });
  });
}
