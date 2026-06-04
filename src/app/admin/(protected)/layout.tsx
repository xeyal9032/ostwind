import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
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
    <>
      <AdminPresenceHeartbeat />
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </>
  );
}
