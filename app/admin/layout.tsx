import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import ThemeRegistry from '../ThemeRegistry';
import AdminShell from './AdminShell';

export const metadata = { title: 'Admin — pimuk.art' };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // login page is inside /admin but must be publicly accessible
  return (
    <ThemeRegistry>
      {session ? (
        <AdminShell session={session}>{children}</AdminShell>
      ) : (
        children
      )}
    </ThemeRegistry>
  );
}
