import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma";
import { isSuperAdmin } from "@/lib/admin-roles";
import { notDeleted } from "@/lib/soft-delete";
import XeyalDashboardCard from "@/components/admin/XeyalDashboardCard";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const [universityCount, applicationCount, messageCount, teamCount] = await Promise.all([
    prisma.university.count({ where: notDeleted }),
    prisma.application.count(),
    prisma.message.count(),
    prisma.teamMember.count({ where: notDeleted }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Hoşgeldiniz, {session?.user?.name || 'Yönetici'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Toplam Üniversite</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{universityCount}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Aktif Başvurular</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{applicationCount}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">İletişim Mesajları</h3>
          <p className="mt-2 text-3xl font-bold text-red-500">{messageCount}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Ekip Üyeleri</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{teamCount}</p>
        </div>
      </div>

      {isSuperAdmin(session?.user?.role) && <XeyalDashboardCard />}

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Son Aktiviteler</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Başvurular ve mesajlar için sol menüden ilgili sayfalara gidebilirsiniz.
        </p>
      </div>
    </div>
  );
}
