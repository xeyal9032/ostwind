import Sidebar from "@/components/admin/Sidebar";
import AdminPresenceHeartbeat from "@/components/admin/AdminPresenceHeartbeat";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isAdminRole } from "@/lib/admin-roles";
import { redirect } from "next/navigation";
import { touchAdminPresence } from "@/lib/admin-presence";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdminRole(session.user?.role)) {
    redirect("/admin/login");
  }

  const userId = session.user?.id ? parseInt(session.user.id, 10) : NaN;
  if (!Number.isNaN(userId)) {
    await touchAdminPresence(userId);
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 overflow-hidden">
      <AdminPresenceHeartbeat />
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-4">
          <div className="flex justify-end items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Yönetici Paneli</span>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
