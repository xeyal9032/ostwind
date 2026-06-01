'use client';

import BackgroundImageSlider from '@/components/BackgroundImageSlider';
import { HERO_SLIDES } from '@/lib/hero-slides';

type Props = {
  slides?: string[];
};

export default function HeroBackgroundSlider({ slides }: Props) {
  const list = slides?.filter(Boolean).length ? slides!.filter(Boolean) : HERO_SLIDES;
  return <BackgroundImageSlider slides={list} />;
}
