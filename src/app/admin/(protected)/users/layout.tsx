import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isSuperAdmin } from '@/lib/admin-roles';

export default async function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!isSuperAdmin(session?.user?.role)) {
    redirect('/admin/dashboard');
  }
  return children;
}
