export type TeamSocialLinks = {
  linkedin?: string;
  twitter?: string;
  email?: string;
};

export const EMPTY_SOCIAL_LINKS: TeamSocialLinks = {
  linkedin: '',
  twitter: '',
  email: '',
};

export function parseSocialLinks(value: unknown): TeamSocialLinks {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ...EMPTY_SOCIAL_LINKS };
  }
  const record = value as Record<string, unknown>;
  return {
    linkedin: typeof record.linkedin === 'string' ? record.linkedin : '',
    twitter:
      typeof record.twitter === 'string'
        ? record.twitter
        : typeof record.x === 'string'
          ? record.x
          : '',
    email: typeof record.email === 'string' ? record.email : '',
  };
}

export function normalizeSocialLinks(links: TeamSocialLinks): TeamSocialLinks {
  const normalized: TeamSocialLinks = {};

  const linkedin = links.linkedin?.trim();
  const twitter = links.twitter?.trim();
  const email = links.email?.trim();

  if (linkedin) normalized.linkedin = linkedin;
  if (twitter) normalized.twitter = twitter;
  if (email) normalized.email = email;

  return normalized;
}
