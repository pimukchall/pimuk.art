import { AsyncLocalStorage } from 'node:async_hooks';

export type AuditActor = { userId: string; email: string };

export const auditStorage = new AsyncLocalStorage<AuditActor>();

export function getAuditActor(): AuditActor | undefined {
  return auditStorage.getStore();
}
