/** Aktiv (silinməmiş) qeydlər */
export const notDeleted = { deletedAt: null } as const;

/** Soft delete — zibil qutusuna köçürmə */
export function softDeleteData() {
  return { deletedAt: new Date() };
}
