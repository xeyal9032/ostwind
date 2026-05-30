'use client';

import { useState } from 'react';

export type MessageWithReply = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  readAt?: string | null;
  adminReply?: string | null;
  repliedAt?: string | null;
  repliedByEmail?: string | null;
  createdAt: string;
};

type MessageReplyBoxProps = {
  message: MessageWithReply;
  onReplied: (updated: MessageWithReply) => void;
  compact?: boolean;
};

export default function MessageReplyBox({ message, onReplied, compact }: MessageReplyBoxProps) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text) return;

    setSending(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Yanıt gönderilemedi');

      setReply('');
      onReplied(data as MessageWithReply);

      if (data.emailSent === false && data.emailError) {
        setError(`Yanıt kaydedildi ancak e-posta gönderilemedi: ${data.emailError}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setSending(false);
    }
  };

  if (message.adminReply) {
    return (
      <div className={`${compact ? 'mt-3' : 'mt-4'} pt-4 border-t border-gray-100 dark:border-zinc-800`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">
          Yanıtınız
          {message.repliedAt && (
            <span className="font-normal text-gray-400 normal-case ml-2">
              {new Date(message.repliedAt).toLocaleString('tr-TR')}
              {message.repliedByEmail ? ` · ${message.repliedByEmail}` : ''}
            </span>
          )}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
          {message.adminReply}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${compact ? 'mt-3' : 'mt-4'} pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3`}
    >
      <label htmlFor={`reply-${message.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Yanıt yaz
      </label>
      <textarea
        id={`reply-${message.id}`}
        rows={compact ? 3 : 4}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Kullanıcıya gönderilecek yanıt..."
        className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 dark:text-white px-3 py-2 text-sm resize-y"
      />
      {error && (
        <p className={`text-sm ${error.includes('kaydedildi') ? 'text-amber-600' : 'text-red-500'}`}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={sending || !reply.trim()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
      >
        {sending ? 'Gönderiliyor...' : 'Yanıtı gönder'}
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Yanıt {message.email} adresine e-posta ile iletilir (SMTP ayarları açıksa).
      </p>
    </form>
  );
}
