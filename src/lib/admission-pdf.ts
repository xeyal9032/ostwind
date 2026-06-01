import { PDFDocument, type PDFFont, type PDFPage, rgb, type RGB } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFile } from 'fs/promises';
import path from 'path';

const BRAND = rgb(178 / 255, 59 / 255, 30 / 255);
const BRAND_DARK = rgb(0.12, 0.16, 0.28);
const MUTED = rgb(0.45, 0.48, 0.55);
const LINE = rgb(0.88, 0.9, 0.93);
const PANEL_BG = rgb(0.96, 0.97, 0.99);
const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 44;

const FONT_DIR = path.join(process.cwd(), 'public', 'fonts');

type AdmissionPdfInput = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  registrationAddress: string;
  foreignPassportNumber: string;
  foreignPassportIssueDate: string;
  foreignPassportExpiryDate: string;
  universityName: string;
  studyTypeLabel: string;
  studyLanguageLabel: string;
  tuitionFee: string;
  submittedAt: string;
};

export type PdfFonts = {
  regular: PDFFont;
  bold: PDFFont;
};

async function loadFonts(doc: PDFDocument): Promise<PdfFonts> {
  doc.registerFontkit(fontkit);
  const [regularBytes, boldBytes] = await Promise.all([
    readFile(path.join(FONT_DIR, 'NotoSans-Regular.ttf')),
    readFile(path.join(FONT_DIR, 'NotoSans-Bold.ttf')),
  ]);
  return {
    regular: await doc.embedFont(regularBytes),
    bold: await doc.embedFont(boldBytes),
  };
}

function wrapTextToWidth(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) > maxWidth) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  opts: { size: number; color?: RGB },
) {
  page.drawText(text, {
    x,
    y,
    size: opts.size,
    font,
    color: opts.color ?? rgb(0, 0, 0),
  });
}

async function loadLogo(doc: PDFDocument) {
  const logoPath = path.join(process.cwd(), 'public', 'images', 'ostwind-logo-bg.png');
  try {
    const bytes = await readFile(logoPath);
    return await doc.embedPng(bytes);
  } catch {
    return null;
  }
}

type PdfCtx = {
  doc: PDFDocument;
  page: PDFPage;
  fonts: PdfFonts;
  y: number;
};

function drawHeader(ctx: PdfCtx, logo: Awaited<ReturnType<typeof loadLogo>>) {
  const { page, fonts } = ctx;
  const headerH = 96;

  page.drawRectangle({
    x: 0,
    y: PAGE_H - headerH,
    width: PAGE_W,
    height: headerH,
    color: BRAND,
  });

  const logoSize = 62;
  const logoY = PAGE_H - headerH + (headerH - logoSize) / 2;

  if (logo) {
    page.drawImage(logo, {
      x: MARGIN,
      y: logoY,
      width: logoSize,
      height: logoSize,
    });
  }

  const textX = logo ? MARGIN + logoSize + 14 : MARGIN;
  drawText(page, 'OstWind Group', textX, PAGE_H - 38, fonts.bold, {
    size: 17,
    color: rgb(1, 1, 1),
  });
  drawText(page, 'Onlayn Qəbul Forması', textX, PAGE_H - 58, fonts.regular, {
    size: 11,
    color: rgb(0.95, 0.95, 0.98),
  });

  ctx.y = PAGE_H - headerH - 28;
}

function drawSectionTitle(ctx: PdfCtx, title: string) {
  const { page, fonts } = ctx;
  drawText(page, title, MARGIN, ctx.y, fonts.bold, { size: 11, color: BRAND });
  ctx.y -= 10;
  page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE_W - MARGIN, y: ctx.y },
    thickness: 1,
    color: LINE,
  });
  ctx.y -= 18;
}

function drawRow(ctx: PdfCtx, label: string, value: string) {
  const { page, fonts } = ctx;
  const valueX = MARGIN + 152;
  const valueMaxW = PAGE_W - MARGIN - valueX;
  const size = 10;
  const lineH = 14;

  drawText(page, label, MARGIN, ctx.y, fonts.bold, { size, color: BRAND_DARK });

  const lines = wrapTextToWidth(value || '—', fonts.regular, size, valueMaxW);
  let rowY = ctx.y;
  for (const ln of lines) {
    drawText(page, ln, valueX, rowY, fonts.regular, {
      size,
      color: rgb(0.15, 0.17, 0.22),
    });
    rowY -= lineH;
  }

  ctx.y = Math.min(ctx.y, rowY) - 8;
}

function drawDocumentsPanel(ctx: PdfCtx) {
  const { page, fonts } = ctx;
  const panelX = MARGIN;
  const panelW = PAGE_W - MARGIN * 2;
  const items = [
    'Attestat (apostil ilə) — PDF formatında',
    'Xarici pasport — PDF formatında',
    '3/4 elektron foto — JPG, PNG və ya PDF',
  ];

  const panelPad = 14;
  const titleH = 18;
  const rowH = 16;
  const panelH = panelPad * 2 + titleH + items.length * rowH + 8;

  if (ctx.y - panelH < MARGIN + 40) {
    ctx.y = MARGIN + panelH + 20;
  }

  const panelY = ctx.y - panelH;

  page.drawRectangle({
    x: panelX,
    y: panelY,
    width: panelW,
    height: panelH,
    color: PANEL_BG,
    borderColor: LINE,
    borderWidth: 1,
  });

  let ty = panelY + panelH - panelPad - 12;
  drawText(page, 'Təqdim olunan sənədlər', panelX + panelPad, ty, fonts.bold, {
    size: 11,
    color: BRAND,
  });
  ty -= titleH;

  for (const item of items) {
    page.drawCircle({
      x: panelX + panelPad + 4,
      y: ty + 3,
      size: 2.5,
      color: BRAND,
    });
    drawText(page, item, panelX + panelPad + 14, ty, fonts.regular, {
      size: 9.5,
      color: rgb(0.25, 0.28, 0.35),
    });
    ty -= rowH;
  }

  ctx.y = panelY - 16;

  const note =
    'Sənədlər tələbə kabinetindən yüklənib; tam fayllar admin paneldə «Onlayn qəbul» bölməsində saxlanılır.';
  const noteLines = wrapTextToWidth(note, fonts.regular, 8, panelW);
  let noteY = ctx.y;
  for (const ln of noteLines) {
    drawText(page, ln, MARGIN, noteY, fonts.regular, { size: 8, color: MUTED });
    noteY -= 11;
  }
  ctx.y = noteY - 8;
}

export async function generateAdmissionSummaryPdf(
  data: AdmissionPdfInput,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const fonts = await loadFonts(doc);
  const logo = await loadLogo(doc);

  const ctx: PdfCtx = { doc, page, fonts, y: PAGE_H };

  drawHeader(ctx, logo);

  drawSectionTitle(ctx, 'Şəxsi məlumatlar');
  drawRow(ctx, 'Ad', data.firstName);
  drawRow(ctx, 'Soyad', data.lastName);
  drawRow(ctx, 'Doğum tarixi', data.birthDate);
  drawRow(ctx, 'E-poçt', data.email);
  drawRow(ctx, 'Telefon', data.phone);
  drawRow(ctx, 'Qeydiyyat ünvanı', data.registrationAddress);

  ctx.y -= 6;
  drawSectionTitle(ctx, 'Pasport məlumatları');
  drawRow(ctx, 'Xarici pasport №', data.foreignPassportNumber);
  drawRow(ctx, 'Verilmə tarixi', data.foreignPassportIssueDate);
  drawRow(ctx, 'Bitmə tarixi', data.foreignPassportExpiryDate);

  ctx.y -= 6;
  drawSectionTitle(ctx, 'Təhsil məlumatları');
  drawRow(ctx, 'Universitet', data.universityName);
  drawRow(ctx, 'Təhsil növü', data.studyTypeLabel);
  drawRow(ctx, 'Təhsil dili', data.studyLanguageLabel);
  drawRow(ctx, 'Təhsil haqqı', data.tuitionFee);
  drawRow(ctx, 'Göndərilmə', data.submittedAt);

  ctx.y -= 8;
  drawDocumentsPanel(ctx);

  page.drawLine({
    start: { x: MARGIN, y: 36 },
    end: { x: PAGE_W - MARGIN, y: 36 },
    thickness: 0.5,
    color: LINE,
  });
  drawText(page, 'OstWind Group · Təhsil konsaltinqi', MARGIN, 22, fonts.regular, {
    size: 8,
    color: MUTED,
  });

  return doc.save();
}

export async function saveAdmissionPdf(buffer: Uint8Array, admissionId: number): Promise<string> {
  const dir = path.join(process.cwd(), 'public', 'uploads', 'admissions', String(admissionId));
  const { mkdir, writeFile } = await import('fs/promises');
  await mkdir(dir, { recursive: true });
  const filename = `summary-${Date.now()}.pdf`;
  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, buffer);
  return `/uploads/admissions/${admissionId}/${filename}`;
}

export async function readLocalUpload(fileUrl: string): Promise<Buffer | null> {
  if (!fileUrl.startsWith('/uploads/')) return null;
  try {
    const full = path.join(process.cwd(), 'public', fileUrl.replace(/^\//, ''));
    return await readFile(full);
  } catch {
    return null;
  }
}

/** @deprecated Köhnə PDF-lər üçün */
export function toPdfSafeText(text: string): string {
  const map: Record<string, string> = {
    ə: 'e',
    Ə: 'E',
    ı: 'i',
    I: 'I',
    ş: 's',
    Ş: 'S',
    ğ: 'g',
    Ğ: 'G',
    ö: 'o',
    Ö: 'O',
    ü: 'u',
    Ü: 'U',
    ç: 'c',
    Ç: 'C',
  };
  return text
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '?');
}
