import { NextResponse } from 'next/server';
import { copyFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { prisma } from '@/prisma';
import { getStudentSession } from '@/lib/student-session';
import { saveStudentAdmissionFile } from '@/lib/student-upload';
import { generateAdmissionSummaryPdf, saveAdmissionPdf } from '@/lib/admission-pdf';
import { getLocaleText } from '@/lib/locale-content';

export const runtime = 'nodejs';
export const maxDuration = 60;

const STUDY_TYPES: Record<string, string> = {
  FULL_TIME: 'Əyani təhsil',
  PART_TIME: 'Qiyabi təhsil',
};

const STUDY_LANGS: Record<string, string> = {
  EN: 'İngilis dili',
  UK: 'Ukrayna dili',
  RU: 'Rus dili',
};

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getUploadFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (!value || typeof value === 'string') return null;
  if (value instanceof File && value.size > 0) return value;
  return null;
}

async function moveUploadToAdmissionFolder(fileUrl: string, admissionId: number): Promise<string> {
  const rel = fileUrl.replace(/^\//, '').replace(/\\/g, '/');
  const src = path.join(process.cwd(), 'public', ...rel.split('/'));
  const base = path.basename(src);
  const destDir = path.join(process.cwd(), 'public', 'uploads', 'admissions', String(admissionId));
  await mkdir(destDir, { recursive: true });
  const dest = path.join(destDir, base);
  await copyFile(src, dest);
  try {
    await unlink(src);
  } catch {
    // Mənbə silinməsə də davam et
  }
  return `/uploads/admissions/${admissionId}/${base}`;
}

export async function POST(req: Request) {
  let pendingFiles: string[] = [];

  try {
    const session = await getStudentSession();
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const existing = await prisma.onlineAdmission.findFirst({
      where: { studentUserId: session.student.id },
    });
    if (existing) {
      return NextResponse.json({ error: 'ALREADY_SUBMITTED' }, { status: 409 });
    }

    const formData = await req.formData();

    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const birthDate = parseDate(formData.get('birthDate') as string | null);
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const registrationAddress = String(formData.get('registrationAddress') || '').trim();
    const foreignPassportNumber = String(formData.get('foreignPassportNumber') || '').trim();
    const foreignPassportIssueDate = parseDate(
      formData.get('foreignPassportIssueDate') as string | null,
    );
    const foreignPassportExpiryDate = parseDate(
      formData.get('foreignPassportExpiryDate') as string | null,
    );
    const universityId = Number(formData.get('universityId'));
    const studyType = String(formData.get('studyType') || '');
    const studyLanguage = String(formData.get('studyLanguage') || '');

    const attestat = getUploadFile(formData, 'attestat');
    const passport = getUploadFile(formData, 'passport');
    const photo = getUploadFile(formData, 'photo');

    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !email ||
      !phone ||
      !registrationAddress ||
      !foreignPassportNumber ||
      !foreignPassportIssueDate ||
      !foreignPassportExpiryDate ||
      !Number.isFinite(universityId) ||
      universityId < 1 ||
      !studyType ||
      !studyLanguage ||
      !attestat ||
      !passport ||
      !photo
    ) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
    }

    if (!STUDY_TYPES[studyType] || !STUDY_LANGS[studyLanguage]) {
      return NextResponse.json({ error: 'INVALID_OPTION' }, { status: 400 });
    }

    const university = await prisma.university.findFirst({
      where: { id: universityId, deletedAt: null },
    });
    if (!university) {
      return NextResponse.json({ error: 'UNIVERSITY_NOT_FOUND' }, { status: 400 });
    }

    const studentId = session.student.id;

    let attestatFile: string;
    let passportFile: string;
    let photoFile: string;

    try {
      attestatFile = await saveStudentAdmissionFile(attestat, studentId, 'attestat');
      passportFile = await saveStudentAdmissionFile(passport, studentId, 'passport');
      photoFile = await saveStudentAdmissionFile(photo, studentId, 'photo');
      pendingFiles = [attestatFile, passportFile, photoFile];
    } catch (e) {
      const code = e instanceof Error ? e.message : 'UPLOAD_ERROR';
      return NextResponse.json({ error: code }, { status: 400 });
    }

    const admission = await prisma.onlineAdmission.create({
      data: {
        studentUserId: studentId,
        firstName,
        lastName,
        birthDate,
        email,
        phone,
        registrationAddress,
        foreignPassportNumber,
        foreignPassportIssueDate,
        foreignPassportExpiryDate,
        universityId,
        studyType,
        studyLanguage,
        attestatFile,
        passportFile,
        photoFile,
      },
    });

    const finalAttestat = await moveUploadToAdmissionFolder(attestatFile, admission.id);
    const finalPassport = await moveUploadToAdmissionFolder(passportFile, admission.id);
    const finalPhoto = await moveUploadToAdmissionFolder(photoFile, admission.id);
    pendingFiles = [];

    // Sənəd yollarını əvvəlcə yaz — PDF xətası olsa belə admin panel faylları tapsın
    await prisma.onlineAdmission.update({
      where: { id: admission.id },
      data: {
        attestatFile: finalAttestat,
        passportFile: finalPassport,
        photoFile: finalPhoto,
      },
    });

    const uniName = getLocaleText(university.name, 'az');
    const tuitionFee =
      studyType === 'PART_TIME'
        ? university.tuitionFeePartTime || university.tuitionFee || '—'
        : university.tuitionFee || '—';

    let summaryPdf: string | null = null;
    try {
      const fmt = (d: Date) => d.toLocaleDateString('az-AZ');
      const pdfBytes = await generateAdmissionSummaryPdf({
        firstName,
        lastName,
        birthDate: fmt(birthDate),
        email,
        phone,
        registrationAddress,
        foreignPassportNumber,
        foreignPassportIssueDate: fmt(foreignPassportIssueDate),
        foreignPassportExpiryDate: fmt(foreignPassportExpiryDate),
        universityName: uniName,
        studyTypeLabel: STUDY_TYPES[studyType],
        studyLanguageLabel: STUDY_LANGS[studyLanguage],
        tuitionFee,
        submittedAt: new Date().toLocaleString('az-AZ'),
      });
      summaryPdf = await saveAdmissionPdf(pdfBytes, admission.id);
      await prisma.onlineAdmission.update({
        where: { id: admission.id },
        data: { summaryPdf },
      });
    } catch (pdfErr) {
      console.error('[student/admission] PDF summary failed:', pdfErr);
    }

    const { notifyNewOnlineAdmission } = await import('@/lib/admin-email');
    await notifyNewOnlineAdmission(admission.id).catch(() => {});

    return NextResponse.json({ success: true, admissionId: admission.id });
  } catch (err) {
    console.error('Admission submit error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'SERVER_ERROR',
        detail: process.env.NODE_ENV === 'development' ? message : undefined,
      },
      { status: 500 },
    );
  }
}
