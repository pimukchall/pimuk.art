import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const seats = await prisma.licenseSeat.findMany({ where: { licenseId: id }, include: { itAsset: true }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json(seats);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const body = await req.json();
    const assignedTo = typeof body.assignedTo === 'string' ? body.assignedTo.trim() : '';
    if (!assignedTo) return NextResponse.json({ error: 'ต้องระบุผู้ใช้ seat' }, { status: 400 });

    const license = await prisma.license.findUnique({ where: { id }, include: { seats: true } });
    if (!license) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (license.seats.length >= license.seatsTotal) {
      return NextResponse.json({ error: 'ใช้ครบจำนวน seat แล้ว' }, { status: 409 });
    }
    if (license.seats.some((s) => s.assignedTo.toLowerCase() === assignedTo.toLowerCase())) {
      return NextResponse.json({ error: `"${assignedTo}" มี seat ของ license นี้อยู่แล้ว` }, { status: 409 });
    }

    const seat = await prisma.licenseSeat.create({
      data: {
        licenseId: id,
        assignedTo,
        itAssetId: body.itAssetId || null,
        note: body.note || null,
      },
      include: { itAsset: true },
    });
    return NextResponse.json(seat, { status: 201 });
  });
}
