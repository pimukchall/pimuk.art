'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function markReadAction(id: string) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  await prisma.contact.update({
    where: { id },
    data: { read: true },
  });
}
