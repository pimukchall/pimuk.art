import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ContactsClient from './ContactsClient';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <ContactsClient contacts={contacts} />;
}
