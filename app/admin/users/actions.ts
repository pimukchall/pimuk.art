'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { withAudit } from '@/lib/with-audit';
import type { Session } from 'next-auth';

async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function createUserAction(formData: FormData) {
  const session = await requireAuth();

  const email = (formData.get('email') as string).trim().toLowerCase();
  const name = (formData.get('name') as string).trim();
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email และ Password จำเป็น', success: false };
  if (password.length < 8) return { error: 'Password ต้องมีอย่างน้อย 8 ตัวอักษร', success: false };

  return withAudit(session, async () => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: `Email ${email} มีอยู่แล้ว`, success: false };

    const hashedPassword = await hash(password, 12);
    await prisma.user.create({ data: { email, name: name || null, hashedPassword } });

    revalidatePath('/admin/users');
    return { success: true, error: undefined };
  });
}

export async function deleteUserAction(id: string) {
  const session = await requireAuth();

  if (session.user?.id === id) return { error: 'ไม่สามารถลบตัวเองได้', success: false };

  return withAudit(session, async () => {
    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');
    return { success: true, error: undefined };
  });
}

export async function changePasswordAction(id: string, formData: FormData) {
  const session = await requireAuth();

  const newPassword = formData.get('newPassword') as string;
  if (!newPassword || newPassword.length < 8) return { error: 'Password ต้องมีอย่างน้อย 8 ตัวอักษร', success: false };

  return withAudit(session, async () => {
    const hashedPassword = await hash(newPassword, 12);
    await prisma.user.update({ where: { id }, data: { hashedPassword } });

    revalidatePath('/admin/users');
    return { success: true, error: undefined };
  });
}
