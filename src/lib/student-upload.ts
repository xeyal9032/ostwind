import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const MAX_PDF_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function saveStudentAdmissionFile(
  file: File,
  studentId: number,
  kind: 'attestat' | 'passport' | 'photo',
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isImage =
    file.type.startsWith('image/') ||
    /\.(jpe?g|png|webp)$/i.test(file.name);

  if (kind === 'photo') {
    if (!isImage && !isPdf) throw new Error('INVALID_PHOTO');
    const maxSize = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
    if (buffer.length > maxSize) throw new Error('FILE_TOO_LARGE');
  } else {
    if (!isPdf) throw new Error('INVALID_PDF');
    if (buffer.length > MAX_PDF_BYTES) throw new Error('FILE_TOO_LARGE');
  }

  const ext = isPdf ? 'pdf' : path.extname(file.name).replace('.', '') || 'jpg';
  const unique = `${kind}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', 'admissions', 'pending', String(studentId));
  await mkdir(dir, { recursive: true });
  const fullPath = path.join(dir, unique);
  await writeFile(fullPath, buffer);
  return `/uploads/admissions/pending/${studentId}/${unique}`;
}
