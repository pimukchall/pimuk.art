import { auth } from '@/auth';
import AdminBarClient from './AdminBarClient';

export default async function AdminBar() {
  const session = await auth();
  if (!session) return null;
  return <AdminBarClient />;
}
