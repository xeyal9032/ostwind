import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { regenerateAdmissionSummary } from '@/lib/regenerate-admission-summary';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requirePermission('onlineAdmissions');
  if (error) return error;

  const { id } = await params;
  const admissionId = parseInt(id, 10);
  if (Number.isNaN(admissionId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  try {
    const { url } = await regenerateAdmissionSummary(admissionId);
    return NextResponse.json({ ok: true, summaryPdf: url });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'PDF_ERROR';
    if (message === 'ADMISSION_NOT_FOUND') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('[regenerate-summary]', e);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
