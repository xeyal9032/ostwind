'use client';

import { useState } from 'react';

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
};

export default function FaqAccordion({
  items,
  emptyMessage,
}: {
  items: FaqItem[];
  emptyMessage: string;
}) {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);

  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-12">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex justify-between items-center px-6 py-4 text-left"
            >
              <span className="font-semibold text-gray-900 dark:text-white pr-4">
                {item.question}
              </span>
              <span className="text-blue-600 text-xl shrink-0">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 whitespace-pre-wrap border-t border-gray-100 dark:border-zinc-800 pt-4">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
