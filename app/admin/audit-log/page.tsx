import { prisma } from '@/lib/prisma';
import AuditLogClient from './AuditLogClient';

export default async function AdminAuditLogPage() {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  const nextCursor = logs.length === 50 ? logs[logs.length - 1].id : null;

  return <AuditLogClient initialLogs={logs} initialNextCursor={nextCursor} />;
}
