import { parseSocialLinks } from '@/lib/team-social';

export default function TeamMemberSocial({ socialLinks }: { socialLinks: unknown }) {
  const links = parseSocialLinks(socialLinks);

  const email = links.email?.trim();

  const items = [
    links.linkedin?.trim() && {
      href: links.linkedin.trim(),
      label: 'LinkedIn',
      content: 'in',
      hover: 'hover:bg-[#0A66C2] hover:text-white',
    },
    links.twitter?.trim() && {
      href: links.twitter.trim(),
      label: 'X',
      content: 'X',
      hover: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
    },
    email && {
      href: `mailto:${email}`,
      label: 'E-posta',
      content: '✉',
      hover: 'hover:bg-green-600 hover:text-white',
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    content: string;
    hover: string;
  }>;

  if (items.length === 0) return null;

  return (
    <div className="mt-4 flex justify-center gap-3">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.label === 'E-posta' ? undefined : '_blank'}
          rel={item.label === 'E-posta' ? undefined : 'noopener noreferrer'}
          aria-label={item.label}
          className={`w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors ${item.hover}`}
        >
          {item.content}
        </a>
      ))}
    </div>
  );
}
