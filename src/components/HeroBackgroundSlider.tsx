'use client';

import BackgroundImageSlider from '@/components/BackgroundImageSlider';
import { HERO_SLIDES } from '@/lib/hero-slides';

export default function HeroBackgroundSlider() {
  return <BackgroundImageSlider slides={HERO_SLIDES} />;
}
