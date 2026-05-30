'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BLOG_IMAGE_FALLBACK, resolveBlogImageUrl } from '@/lib/blog-images';

type BlogPostImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export default function BlogPostImage({
  src,
  alt,
  className = 'object-cover',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: BlogPostImageProps) {
  const initial = resolveBlogImageUrl(src) || src;
  const [url, setUrl] = useState(initial);

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => {
        if (url !== BLOG_IMAGE_FALLBACK) setUrl(BLOG_IMAGE_FALLBACK);
      }}
    />
  );
}
