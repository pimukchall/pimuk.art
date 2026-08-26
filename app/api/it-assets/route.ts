import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';
import { validateITAssetPayload } from '@/lib/validators/it-asset';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const archived = searchParams.get('archived');
  const search = searchParams.get('search')?.trim();

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (type) where.type = type;
  where.archived = archived != null ? archived === 'true' : false;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { serialNumber: { contains: search } },
      { assignedTo: { contains: search } },
    ];
  }

  const items = await prisma.iTAsset.findMany({ where, orderBy: { order: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const error = validateITAssetPayload(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const serialNumber = body.serialNumber ? String(body.serialNumber).trim() : null;
    if (serialNumber) {
      const dup = await prisma.iTAsset.findUnique({ where: { serialNumber } });
      if (dup) return NextResponse.json({ error: `Serial number "${serialNumber}" ถูกใช้แล้ว` }, { status: 409 });
    }

    const status = body.status ?? 'IN_USE';

    const item = await prisma.$transaction(async (tx) => {
      const created = await tx.iTAsset.create({
        data: {
          name: String(body.name).trim(),
          type: body.type,
          status,
          serialNumber,
          assignedTo: body.assignedTo || null,
          vendor: body.vendor || null,
          purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
          purchasePrice: body.purchasePrice != null && body.purchasePrice !== '' ? Number(body.purchasePrice) : null,
          warrantyExpiry: body.warrantyExpiry ? new Date(body.warrantyExpiry) : null,
          attachmentUrl: body.attachmentUrl || null,
          note: body.note || null,
          order: Number(body.order) || 0,
        },
      });
      await tx.iTAssetLog.create({
        data: { itAssetId: created.id, fromStatus: null, toStatus: status, assignedTo: created.assignedTo, note: 'สร้างรายการ' },
      });
      return created;
    });

    return NextResponse.json(item, { status: 201 });
  });
}
