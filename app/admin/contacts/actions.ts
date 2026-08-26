'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { withAudit } from '@/lib/with-audit';

export async function markReadAction(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  await withAudit(session, () =>
    prisma.contact.update({
      where: { id },
      data: { read: true },
    })
  );
}
