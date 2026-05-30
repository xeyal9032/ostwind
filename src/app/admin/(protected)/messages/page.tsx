'use client';

import { useEffect, useState } from 'react';
import MessageReplyBox, { type MessageWithReply } from '@/components/admin/MessageReplyBox';

export default function MessagesPage() {
  const [items, setItems] = useState<MessageWithReply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/messages')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateMessage = (updated: MessageWithReply) => {
    setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((m) => m.id !== id));
    } else {
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const unanswered = items.filter((m) => !m.adminReply).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mesajlar</h1>
        {unanswered > 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            {unanswered} mesaj henüz yanıtlanmadı.
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Henüz mesaj yok.</p>
      ) : (
        <div className="space-y-4">
          {items.map((m) => (
            <div
              key={m.id}
              className={`bg-white dark:bg-zinc-900 rounded-xl border p-6 ${
                !m.adminReply
                  ? 'border-blue-200 dark:border-blue-900/50'
                  : 'border-gray-100 dark:border-zinc-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {!m.adminReply && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                      Yanıt bekliyor
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm font-medium"
                  >
                    Sil
                  </button>
                </div>
              </div>
              {m.subject && (
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{m.subject}</p>
              )}
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{m.message}</p>

              <MessageReplyBox message={m} onReplied={updateMessage} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
