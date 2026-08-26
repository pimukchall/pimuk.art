import { prisma } from '@/lib/prisma';
import LicensesClient from './LicensesClient';

export default async function AdminLicensesPage() {
  const licenses = await prisma.license.findMany({
    where: { archived: false },
    include: { seats: true },
    orderBy: { order: 'asc' },
  });
  return <LicensesClient licenses={licenses} />;
}
