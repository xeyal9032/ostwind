/** Panelə giriş icazəsi olan rollar */
export const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(role: string | undefined | null): role is AdminRole {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

export function isSuperAdmin(role: string | undefined | null): boolean {
  return role === 'SUPER_ADMIN';
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin (tam icazə)',
};
