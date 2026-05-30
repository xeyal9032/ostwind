import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { prisma } from '@/prisma';
import BlogPostImage from '@/components/BlogPostImage';
import { getLocaleText } from '@/lib/locale-content';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Blog');

  const posts = await prisma.post.findMany({
    where: { deletedAt: null, published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-24 min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">{t('noPosts')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const title = getLocaleText(post.title, locale);
              const excerpt = getLocaleText(post.content, locale).slice(0, 160);

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-blue-200/70 dark:hover:border-blue-500/40 transition-all duration-300 ease-out"
                >
                  <div className="relative h-48 bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                    {post.image ? (
                      <>
                        <BlogPostImage
                          src={post.image}
                          alt={title}
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          aria-hidden
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 transition-colors duration-300 group-hover:text-gray-500 dark:group-hover:text-gray-300">
                        {t('noImage')}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2 line-clamp-2 transition-colors duration-300">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                      {excerpt}…
                    </p>
                    <p className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium inline-flex items-center gap-1 transition-all duration-300 group-hover:gap-2.5">
                      {t('readMore')}
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
