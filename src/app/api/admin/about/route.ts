import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { requirePermission } from '@/lib/auth';
import {
  DEFAULT_ABOUT_STORY,
  DEFAULT_COMPANY_SECTION,
  fillEmptyLocales,
  sanitizeLocaleJson,
} from '@/lib/about-defaults';

const COMPANY_FIELDS = [
  'companyTitle',
  'missionTitle',
  'missionText',
  'valuesTitle',
  'valuesText',
  'teamTitle',
  'teamText',
] as const;

function fillCompanyDefaults(content: Record<string, unknown>) {
  const out = { ...content };
  for (const key of COMPANY_FIELDS) {
    out[key] = fillEmptyLocales(
      content[key],
      DEFAULT_COMPANY_SECTION[key as keyof typeof DEFAULT_COMPANY_SECTION]
    );
  }
  return out;
}

function sanitizeCompanyPayload(body: Record<string, unknown>) {
  const data: Record<string, Record<string, string>> = {};
  for (const key of COMPANY_FIELDS) {
    data[key] = sanitizeLocaleJson(body[key]);
  }
  return data;
}

async function getOrCreateAboutContent() {
  let content = await prisma.aboutContent.findUnique({ where: { id: 1 } });
  if (!content) {
    content = await prisma.aboutContent.create({
      data: {
        id: 1,
        storyImage: DEFAULT_ABOUT_STORY.storyImage,
        storyTitle: DEFAULT_ABOUT_STORY.storyTitle,
        storyText: DEFAULT_ABOUT_STORY.storyText,
        companyTitle: DEFAULT_COMPANY_SECTION.companyTitle,
        missionTitle: DEFAULT_COMPANY_SECTION.missionTitle,
        missionText: DEFAULT_COMPANY_SECTION.missionText,
        valuesTitle: DEFAULT_COMPANY_SECTION.valuesTitle,
        valuesText: DEFAULT_COMPANY_SECTION.valuesText,
        teamTitle: DEFAULT_COMPANY_SECTION.teamTitle,
        teamText: DEFAULT_COMPANY_SECTION.teamText,
      },
    });
  }
  return content;
}

export async function GET() {
  const { error } = await requirePermission('about');
  if (error) return error;

  try {
    const content = await getOrCreateAboutContent();
    return NextResponse.json(
      fillCompanyDefaults({
        ...content,
        storyImage: content.storyImage || DEFAULT_ABOUT_STORY.storyImage,
        storyTitle: fillEmptyLocales(content.storyTitle, DEFAULT_ABOUT_STORY.storyTitle),
        storyText: fillEmptyLocales(content.storyText, DEFAULT_ABOUT_STORY.storyText),
      })
    );
  } catch (err) {
    console.error('About GET error:', err);
    const message = err instanceof Error ? err.message : 'İçerik alınamadı';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { error } = await requirePermission('about');
  if (error) return error;

  try {
    const body = await req.json();
    const storyImage =
      typeof body.storyImage === 'string' && body.storyImage.trim()
        ? body.storyImage.trim()
        : null;
    const storyTitle = sanitizeLocaleJson(body.storyTitle);
    const storyText = sanitizeLocaleJson(body.storyText);
    const companyData = sanitizeCompanyPayload(body);

    const existing = await prisma.aboutContent.findUnique({ where: { id: 1 } });

    const data = {
      storyImage,
      storyTitle,
      storyText,
      ...companyData,
    };

    const content = existing
      ? await prisma.aboutContent.update({ where: { id: 1 }, data })
      : await prisma.aboutContent.create({
          data: {
            id: 1,
            ...data,
            storyImage: storyImage ?? DEFAULT_ABOUT_STORY.storyImage,
          },
        });

    return NextResponse.json(content);
  } catch (err) {
    console.error('About PUT error:', err);
    const message = err instanceof Error ? err.message : 'Kaydedilemedi';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
