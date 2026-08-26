import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withAudit } from '@/lib/with-audit';
import { prisma } from '@/lib/prisma';
import { validateLicensePayload } from '@/lib/validators/license';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const archived = searchParams.get('archived');
  const search = searchParams.get('search')?.trim();

  const where: Record<string, unknown> = { archived: archived != null ? archived === 'true' : false };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { vendor: { contains: search } },
    ];
  }

  const licenses = await prisma.license.findMany({
    where,
    include: { seats: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(licenses);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return withAudit(session, async () => {
    const body = await req.json();
    const error = validateLicensePayload(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const license = await prisma.license.create({
      data: {
        name: String(body.name).trim(),
        vendor: body.vendor || null,
        licenseKey: body.licenseKey || null,
        seatsTotal: Number(body.seatsTotal) || 1,
        cost: body.cost != null && body.cost !== '' ? Number(body.cost) : null,
        billingCycle: body.billingCycle ?? 'YEARLY',
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        renewalDate: body.renewalDate ? new Date(body.renewalDate) : null,
        autoRenew: Boolean(body.autoRenew),
        note: body.note || null,
        order: Number(body.order) || 0,
      },
      include: { seats: true },
    });
    return NextResponse.json(license, { status: 201 });
  });
}
