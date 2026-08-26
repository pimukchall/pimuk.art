import type { Session } from 'next-auth';
import { auditStorage } from './audit-context';

export function withAudit<T>(session: Session, fn: () => Promise<T>): Promise<T> {
  const userId = session.user?.id as string | undefined;
  const email = session.user?.email ?? '';
  if (!userId) return fn();
  return auditStorage.run({ userId, email }, fn);
}
