import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { error } = await requireSession();
  if (error) return error;

  try {
    const { text, targetLang, sourceLang } = await req.json();

    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'DeepL API key not found' }, { status: 500 });
    }

    const langMap: Record<string, string> = {
      tr: 'TR',
      en: 'EN-US',
      az: 'AZ',
      ru: 'RU',
      uk: 'UK',
      ge: 'KA',
    };

    const deepLTarget = langMap[targetLang];
    if (!deepLTarget) {
      return NextResponse.json({ error: `Unsupported target language: ${targetLang}` }, { status: 400 });
    }

    const body = new URLSearchParams();
    body.append('text', text);
    body.append('target_lang', deepLTarget);
    if (sourceLang && langMap[sourceLang]) {
      body.append('source_lang', langMap[sourceLang]);
    }

    const res = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errorData = await res.text();
      return NextResponse.json({ error: `DeepL API error: ${errorData}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ translatedText: data.translations[0].text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
