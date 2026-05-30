import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { parsePermissions } from '@/lib/admin-permissions';

export async function GET() {
  const { user, error } = await requireSession();
  if (error) return error;

  return NextResponse.json({
    id: user!.id,
    name: user!.name,
    email: user!.email,
    role: user!.role,
    isActive: user!.isActive,
    permissions: parsePermissions(user!.permissions),
    totpEnabled: user!.totpEnabled,
  });
}
