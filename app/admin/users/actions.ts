'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function createUserAction(formData: FormData) {
  await requireAuth();

  const email = (formData.get('email') as string).trim().toLowerCase();
  const name = (formData.get('name') as string).trim();
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'Email และ Password จำเป็น' };
  if (password.length < 8) return { error: 'Password ต้องมีอย่างน้อย 8 ตัวอักษร' };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: `Email ${email} มีอยู่แล้ว` };

  const hashedPassword = await hash(password, 12);
  await prisma.user.create({ data: { email, name: name || null, hashedPassword } });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function deleteUserAction(id: string) {
  const session = await requireAuth();

  if (session.user?.id === id) return { error: 'ไม่สามารถลบตัวเองได้' };

  await prisma.user.delete({ where: { id } });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function changePasswordAction(id: string, formData: FormData) {
  await requireAuth();

  const newPassword = formData.get('newPassword') as string;
  if (!newPassword || newPassword.length < 8) return { error: 'Password ต้องมีอย่างน้อย 8 ตัวอักษร' };

  const hashedPassword = await hash(newPassword, 12);
  await prisma.user.update({ where: { id }, data: { hashedPassword } });

  revalidatePath('/admin/users');
  return { success: true };
}
