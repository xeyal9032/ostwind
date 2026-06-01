import { prisma } from '@/prisma';
import { generateAdmissionSummaryPdf, saveAdmissionPdf } from '@/lib/admission-pdf';
import { getLocaleText } from '@/lib/locale-content';

const STUDY_TYPES: Record<string, string> = {
  FULL_TIME: 'Əyani təhsil',
  PART_TIME: 'Qiyabi təhsil',
};

const STUDY_LANGS: Record<string, string> = {
  EN: 'İngilis dili',
  UK: 'Ukrayna dili',
  RU: 'Rus dili',
};

function formatDate(d: Date): string {
  return d.toLocaleDateString('az-AZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Mövcud qəbul qeydi üçün yeni formatda PDF xülasə yaradır və DB yolunu yeniləyir */
export async function regenerateAdmissionSummary(
  admissionId: number,
): Promise<{ url: string }> {
  const row = await prisma.onlineAdmission.findUnique({
    where: { id: admissionId },
    include: { studentUser: true, university: true },
  });

  if (!row) {
    throw new Error('ADMISSION_NOT_FOUND');
  }

  const tuitionFee =
    row.studyType === 'PART_TIME'
      ? row.university.tuitionFeePartTime || row.university.tuitionFee || '—'
      : row.university.tuitionFee || '—';

  const pdfBytes = await generateAdmissionSummaryPdf({
    firstName: row.firstName || row.studentUser.firstName,
    lastName: row.lastName || row.studentUser.lastName,
    birthDate: formatDate(row.birthDate),
    email: row.email || row.studentUser.email,
    phone: row.phone,
    registrationAddress: row.registrationAddress,
    foreignPassportNumber: row.foreignPassportNumber,
    foreignPassportIssueDate: formatDate(row.foreignPassportIssueDate),
    foreignPassportExpiryDate: formatDate(row.foreignPassportExpiryDate),
    universityName: getLocaleText(row.university.name, 'az'),
    studyTypeLabel: STUDY_TYPES[row.studyType] ?? row.studyType,
    studyLanguageLabel: STUDY_LANGS[row.studyLanguage] ?? row.studyLanguage,
    tuitionFee,
    submittedAt: row.createdAt.toLocaleString('az-AZ'),
  });

  const url = await saveAdmissionPdf(pdfBytes, admissionId);
  await prisma.onlineAdmission.update({
    where: { id: admissionId },
    data: { summaryPdf: url },
  });

  return { url };
}

/** Bütün onlayn qəbul qeydləri üçün PDF yeniləyir */
export async function regenerateAllAdmissionSummaries(): Promise<
  { id: number; url: string }[]
> {
  const rows = await prisma.onlineAdmission.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  const results: { id: number; url: string }[] = [];
  for (const { id } of rows) {
    const { url } = await regenerateAdmissionSummary(id);
    results.push({ id, url });
  }
  return results;
}
