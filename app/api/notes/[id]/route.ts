import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.content != null) {
      const content = String(body.content).trim();
      if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });
      data.content = content;
    }
    if (body.archived != null) data.archived = Boolean(body.archived);

    const note = await prisma.note.update({ where: { id }, data });
    return NextResponse.json(note);
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ success: true });
  });
}
