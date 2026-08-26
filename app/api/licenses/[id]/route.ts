import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';
import { validateLicensePayload } from '@/lib/validators/license';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const existing = await prisma.license.findUnique({ where: { id }, include: { seats: true } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const error = validateLicensePayload(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const seatsTotal = Number(body.seatsTotal) || 1;
    if (seatsTotal < existing.seats.length) {
      return NextResponse.json({ error: `ลดจำนวน seat ไม่ได้ต่ำกว่าจำนวนที่ใช้อยู่ (${existing.seats.length})` }, { status: 409 });
    }

    const license = await prisma.license.update({
      where: { id },
      data: {
        name: String(body.name).trim(),
        vendor: body.vendor || null,
        licenseKey: body.licenseKey || null,
        seatsTotal,
        cost: body.cost != null && body.cost !== '' ? Number(body.cost) : null,
        billingCycle: body.billingCycle ?? 'YEARLY',
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        renewalDate: body.renewalDate ? new Date(body.renewalDate) : null,
        autoRenew: Boolean(body.autoRenew),
        note: body.note || null,
        archived: Boolean(body.archived),
        order: Number(body.order) || 0,
      },
      include: { seats: true },
    });
    return NextResponse.json(license);
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    if (searchParams.get('permanent') === 'true') {
      const existing = await prisma.license.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      if (!existing.archived) return NextResponse.json({ error: 'ต้อง archive ก่อนจึงจะลบถาวรได้' }, { status: 400 });
      await prisma.license.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    const license = await prisma.license.update({ where: { id }, data: { archived: true } });
    return NextResponse.json(license);
  });
}
