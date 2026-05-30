import {
  DEFAULT_COMPANY_SECTION,
  getLocaleText,
  mergeLocaleJson,
} from '@/lib/about-defaults';

type AboutRow = {
  companyTitle?: unknown;
  missionTitle?: unknown;
  missionText?: unknown;
  valuesTitle?: unknown;
  valuesText?: unknown;
  teamTitle?: unknown;
  teamText?: unknown;
} | null;

export function getCompanySectionForLocale(aboutContent: AboutRow, locale: string) {
  const pick = (field: keyof typeof DEFAULT_COMPANY_SECTION, source: unknown) =>
    getLocaleText(
      mergeLocaleJson(source ?? DEFAULT_COMPANY_SECTION[field]),
      locale
    );

  const companyTitle = pick('companyTitle', aboutContent?.companyTitle);
  const missionTitle = pick('missionTitle', aboutContent?.missionTitle);
  const missionText = pick('missionText', aboutContent?.missionText);
  const valuesTitle = pick('valuesTitle', aboutContent?.valuesTitle);
  const valuesText = pick('valuesText', aboutContent?.valuesText);
  const teamTitle = pick('teamTitle', aboutContent?.teamTitle);
  const teamText = pick('teamText', aboutContent?.teamText);

  return {
    sectionTitle: companyTitle,
    cards: [
      { number: 1, title: missionTitle, text: missionText },
      { number: 2, title: valuesTitle, text: valuesText },
      { number: 3, title: teamTitle, text: teamText },
    ].filter((c) => c.text.trim()),
  };
}
