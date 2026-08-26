import { PrismaClient } from '@prisma/client';
import { getAuditActor } from './audit-context';

const SENSITIVE_KEYS = new Set(['hashedPassword', 'password', 'newPassword']);
const LOGGED_OPERATIONS = new Set(['create', 'update', 'delete', 'updateMany', 'deleteMany']);

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SENSITIVE_KEYS.has(k) ? '[redacted]' : redact(v);
    }
    return out;
  }
  return value;
}

function summarize(args: unknown): string {
  const json = JSON.stringify(redact(args));
  return json.length > 1000 ? `${json.slice(0, 1000)}…` : json;
}

function basePrismaClient() {
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
  const base = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = base;
  return base;
}

const base = basePrismaClient();

export const prisma = base.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const result = await query(args);

        if (model === 'AuditLog' || !LOGGED_OPERATIONS.has(operation)) return result;

        const actor = getAuditActor();
        const recordId =
          (result as { id?: string } | null)?.id ??
          (args as { where?: { id?: string } })?.where?.id ??
          null;

        base.auditLog
          .create({
            data: {
              actorId: actor?.userId ?? null,
              actorEmail: actor?.email ?? null,
              action: operation.startsWith('delete') ? 'DELETE' : operation.startsWith('update') ? 'UPDATE' : 'CREATE',
              model,
              recordId,
              summary: summarize(args),
            },
          })
          .catch((err) => console.error('[audit-log] failed to write:', err));

        return result;
      },
    },
  },
});
