/** Başvuru / onlayn qəbul status kodları (DB) */
export const APPLICATION_STATUS_KEYS = [
  'PENDING',
  'REVIEWING',
  'APPROVED',
  'REJECTED',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS_KEYS)[number];

/** Admin paneldə göstərilən Türkçe etiketlər */
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Beklemede',
  REVIEWING: 'İnceleniyor',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
};

export function getApplicationStatusLabel(status: string): string {
  if (status in APPLICATION_STATUS_LABELS) {
    return APPLICATION_STATUS_LABELS[status as ApplicationStatus];
  }
  return status;
}
