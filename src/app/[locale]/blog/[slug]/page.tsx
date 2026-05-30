import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { prisma } from '@/prisma';
import { getLocaleText } from '@/lib/locale-content';
import { getTranslations } from 'next-intl/server';
import BlogPostImage from '@/components/BlogPostImage';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('Blog');

  const post = await prisma.post.findFirst({
    where: { slug, published: true, deletedAt: null },
  });

  if (!post) notFound();

  const title = getLocaleText(post.title, locale);
  const content = getLocaleText(post.content, locale);

  return (
    <article className="py-24 min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-blue-600 hover:underline text-sm font-medium mb-8 inline-block">
          ← {t('backToBlog')}
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
        {post.image && (
          <div className="relative h-72 rounded-2xl overflow-hidden mb-8">
            <BlogPostImage
              src={post.image}
              alt={title}
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    </article>
  );
}
