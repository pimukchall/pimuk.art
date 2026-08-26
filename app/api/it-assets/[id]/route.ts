import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';
import { validateITAssetPayload } from '@/lib/validators/it-asset';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const existing = await prisma.iTAsset.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const error = validateITAssetPayload(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const serialNumber = body.serialNumber ? String(body.serialNumber).trim() : null;
    if (serialNumber) {
      const dup = await prisma.iTAsset.findUnique({ where: { serialNumber } });
      if (dup && dup.id !== id) return NextResponse.json({ error: `Serial number "${serialNumber}" ถูกใช้แล้ว` }, { status: 409 });
    }

    const status = body.status ?? 'IN_USE';
    const assignedTo = body.assignedTo || null;
    const statusChanged = status !== existing.status || assignedTo !== existing.assignedTo;

    const item = await prisma.$transaction(async (tx) => {
      const updated = await tx.iTAsset.update({
        where: { id },
        data: {
          name: String(body.name).trim(),
          type: body.type,
          status,
          serialNumber,
          assignedTo,
          vendor: body.vendor || null,
          purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
          purchasePrice: body.purchasePrice != null && body.purchasePrice !== '' ? Number(body.purchasePrice) : null,
          warrantyExpiry: body.warrantyExpiry ? new Date(body.warrantyExpiry) : null,
          attachmentUrl: body.attachmentUrl || null,
          note: body.note || null,
          archived: Boolean(body.archived),
          order: Number(body.order) || 0,
        },
      });
      if (statusChanged) {
        await tx.iTAssetLog.create({
          data: { itAssetId: id, fromStatus: existing.status, toStatus: status, assignedTo, note: null },
        });
      }
      return updated;
    });

    return NextResponse.json(item);
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    if (searchParams.get('permanent') === 'true') {
      const existing = await prisma.iTAsset.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      if (!existing.archived) return NextResponse.json({ error: 'ต้อง archive ก่อนจึงจะลบถาวรได้' }, { status: 400 });
      await prisma.iTAsset.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    const item = await prisma.iTAsset.update({ where: { id }, data: { archived: true } });
    return NextResponse.json(item);
  });
}
