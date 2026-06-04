'use client';

import { useEffect, useRef, useState } from 'react';

type StatItem = {
  end: number;
  suffix: string;
  /** true ise değer "10K+" gibi binlik gösterilir (end=10 → 10K+) */
  thousands?: boolean;
  label: string;
};

type HomeStatsSectionProps = {
  items: StatItem[];
};

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function formatValue(value: number, thousands?: boolean) {
  const n = Math.round(value);
  if (thousands) return `${n}K`;
  return String(n);
}

function AnimatedStat({
  end,
  suffix,
  thousands,
  label,
  delayMs = 0,
  durationMs = 2200,
}: StatItem & { delayMs?: number; durationMs?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(() => `${formatValue(0, thousands)}${suffix}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const finalText = `${formatValue(end, thousands)}${suffix}`;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduced) {
          setText(finalText);
          return;
        }

        const run = () => {
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1);
            const current = easeOutCubic(progress) * end;
            setText(`${formatValue(current, thousands)}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setText(finalText);
            }
          };

          requestAnimationFrame(tick);
        };

        if (delayMs > 0) {
          window.setTimeout(run, delayMs);
        } else {
          run();
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, suffix, thousands, durationMs, delayMs]);

  return (
    <div ref={ref}>
      <div
        className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 tabular-nums tracking-tight"
        aria-label={`${formatValue(end, thousands)}${suffix}`}
      >
        {text}
      </div>
      <div className="text-blue-100 font-medium text-xs sm:text-base leading-snug px-1">{label}</div>
    </div>
  );
}

export default function HomeStatsSection({ items }: HomeStatsSectionProps) {
  return (
    <section className="py-12 sm:py-16 bg-blue-600 dark:bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {items.map((item, index) => (
            <AnimatedStat key={item.label} {...item} delayMs={index * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
