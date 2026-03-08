'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useMessages } from '@/lib/message-context';

interface MessagePopupProps {
  artisanId: string;
  artisanName: string;
  artisanImage: string;
  onClose: () => void;
}

export function MessagePopup({ artisanId, artisanName, artisanImage, onClose }: MessagePopupProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { sendMessage } = useMessages();

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      await sendMessage(artisanId, artisanName, artisanImage, message);
      setMessage('');

      // Show success notification
      window.dispatchEvent(
        new CustomEvent('showNotification', {
          detail: { message: 'Message sent successfully!', type: 'success' },
        })
      );

      // Close popup after a short delay
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
      window.dispatchEvent(
        new CustomEvent('showNotification', {
          detail: { message: 'Failed to send message', type: 'error' },
        })
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-warm-charcoal/50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-primary flex items-center justify-between px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <img
              src={artisanImage || '/placeholder.svg'}
              alt={artisanName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">Message {artisanName}</h3>
              <p className="text-xs text-white/80">Send a message via WhatsApp</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 transition hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <div>
            <label className="text-warm-charcoal mb-2 block text-sm font-semibold">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="border-border focus:ring-primary w-full resize-none rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none"
            />
          </div>

          <div className="bg-warm-sand/30 text-warm-charcoal/70 rounded-lg p-4 text-sm">
            <p>
              💡 Your message will be sent to {artisanName} via WhatsApp. They can reply directly on
              WhatsApp or through our messaging system.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="border-border text-warm-charcoal hover:bg-warm-sand flex-1 rounded-lg border-2 px-6 py-3 font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="bg-primary hover:bg-warm-rust flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
