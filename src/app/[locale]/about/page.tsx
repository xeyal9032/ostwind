import { prisma } from '@/prisma';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import TeamMemberSocial from '@/components/TeamMemberSocial';
import AboutCompanySection from '@/components/AboutCompanySection';
import BackgroundImageSlider from '@/components/BackgroundImageSlider';
import { ABOUT_HERO_SLIDES } from '@/lib/about-hero-slides';
import {
  DEFAULT_STORY_IMAGE,
  getLocaleText,
  mergeLocaleJson,
} from '@/lib/about-defaults';
import { getCompanySectionForLocale } from '@/lib/about-company';
import { notDeleted } from '@/lib/soft-delete';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('About');

  const [teamMembers, aboutContent] = await Promise.all([
    prisma.teamMember.findMany({ where: notDeleted, orderBy: { id: 'asc' } }),
    prisma.aboutContent.findUnique({ where: { id: 1 } }),
  ]);

  const storyImage = aboutContent?.storyImage || DEFAULT_STORY_IMAGE;
  const storyTitle = aboutContent
    ? getLocaleText(mergeLocaleJson(aboutContent.storyTitle), locale)
    : t('ourStory');
  const storyText = aboutContent
    ? getLocaleText(mergeLocaleJson(aboutContent.storyText), locale)
    : t('ourStoryText');

  const companySection = getCompanySectionForLocale(aboutContent, locale);

  const getFallback = (field: Record<string, string> | string | null | undefined, loc: string) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[loc] || field['az'] || field['tr'] || field['en'] || '';
  };

  return (
    <div className="min-h-screen">
      <section className="relative isolate overflow-hidden min-h-[55vh] bg-zinc-950">
        <BackgroundImageSlider slides={ABOUT_HERO_SLIDES} />
        <div className="relative z-10 flex min-h-[55vh] items-center justify-center px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="w-full max-w-7xl mx-auto text-center">
          <h1 className="page-title font-extrabold text-white mb-4 drop-shadow-sm px-2">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-100 max-w-3xl mx-auto drop-shadow-sm">{t('description')}</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-b from-zinc-950 to-gray-50 dark:to-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative aspect-[4/3] sm:aspect-auto sm:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={storyImage}
              alt={storyTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{storyTitle}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {storyText}
            </p>
          </div>
        </div>

        {companySection.cards.length > 0 && (
          <AboutCompanySection
            sectionTitle={companySection.sectionTitle}
            cards={companySection.cards}
          />
        )}

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('meetTeam')}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('meetTeamSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-zinc-800 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-[320px] w-full">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Fotoğraf Yok
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                  {getFallback(member.role as Record<string, string> | string, locale)}
                </p>
                <TeamMemberSocial socialLinks={member.socialLinks} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
