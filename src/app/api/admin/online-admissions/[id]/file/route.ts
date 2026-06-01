import { NextResponse } from 'next/server';
import { access, readFile, readdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';

const MIME: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

const FIELD_KEYS = ['attestat', 'passport', 'photo', 'summary'] as const;
type FieldKey = (typeof FIELD_KEYS)[number];

const FIELD_PREFIX: Record<FieldKey, string> = {
  attestat: 'attestat',
  passport: 'passport',
  photo: 'photo',
  summary: 'summary',
};

async function fileExists(diskPath: string): Promise<boolean> {
  try {
    await access(diskPath);
    return true;
  } catch {
    return false;
  }
}

function resolveDiskPath(publicUrl: string): string | null {
  if (!publicUrl.startsWith('/uploads/')) return null;
  const rel = publicUrl.replace(/^\//, '').replace(/\\/g, '/');
  if (rel.includes('..')) return null;
  return path.join(process.cwd(), 'public', ...rel.split('/'));
}

async function findByPrefix(admissionId: number, prefix: string): Promise<string | null> {
  const dir = path.join(process.cwd(), 'public', 'uploads', 'admissions', String(admissionId));
  try {
    const files = await readdir(dir);
    const match = files.find((f) => f.startsWith(`${prefix}-`));
    if (match) return `/uploads/admissions/${admissionId}/${match}`;
  } catch {
    /* qovluq yoxdur */
  }
  return null;
}

async function buildCandidates(
  field: FieldKey,
  fileUrl: string,
  admissionId: number,
  studentUserId: number,
): Promise<string[]> {
  const base = path.basename(fileUrl);
  const prefix = FIELD_PREFIX[field];
  const set = new Set<string>();

  set.add(fileUrl);
  set.add(`/uploads/admissions/${admissionId}/${base}`);
  set.add(`/uploads/admissions/pending/${studentUserId}/${base}`);

  const byPrefix = await findByPrefix(admissionId, prefix);
  if (byPrefix) set.add(byPrefix);

  return [...set];
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('onlineAdmissions');
  if (error) return error;

  const { id } = await params;
  const admissionId = parseInt(id, 10);
  const field = new URL(req.url).searchParams.get('field') as FieldKey | null;

  if (!field || !FIELD_KEYS.includes(field)) {
    return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
  }

  const row = await prisma.onlineAdmission.findUnique({
    where: { id: admissionId },
  });
  if (!row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const pathMap: Record<FieldKey, string | null> = {
    attestat: row.attestatFile,
    passport: row.passportFile,
    photo: row.photoFile,
    summary: row.summaryPdf,
  };

  const fileUrl = pathMap[field];
  if (!fileUrl) {
    return NextResponse.json({ error: 'No file' }, { status: 404 });
  }

  const candidates = await buildCandidates(field, fileUrl, admissionId, row.studentUserId);

  for (const url of candidates) {
    const disk = resolveDiskPath(url);
    if (!disk || !(await fileExists(disk))) continue;

    try {
      const buffer = await readFile(disk);
      const ext = path.extname(disk).slice(1).toLowerCase();
      const contentType = MIME[ext] || 'application/octet-stream';

      // DB yolu səhvdirsə avtomatik düzəlt
      if (url !== fileUrl) {
        const updateKey = `${field}File` as 'attestatFile' | 'passportFile' | 'photoFile' | 'summaryPdf';
        if (updateKey in row) {
          await prisma.onlineAdmission
            .update({
              where: { id: admissionId },
              data: { [updateKey]: url },
            })
            .catch(() => {});
        }
      }

      const cacheControl =
        field === 'summary'
          ? 'private, no-cache, no-store, must-revalidate'
          : 'private, max-age=3600';

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${path.basename(disk)}"`,
          'Cache-Control': cacheControl,
        },
      });
    } catch {
      /* növbəti */
    }
  }

  return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
}
