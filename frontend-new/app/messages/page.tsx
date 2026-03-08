'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { useMessages } from '@/lib/message-context';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MessagesPage() {
  const router = useRouter();
  const { conversations, markAsRead, sendMessage } = useMessages();
  const [selectedArtisan, setSelectedArtisan] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = selectedArtisan
    ? conversations.find((c) => c.artisanId === selectedArtisan)
    : null;

  useEffect(() => {
    if (selectedArtisan) {
      markAsRead(selectedArtisan);
    }
  }, [selectedArtisan, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    await sendMessage(
      selectedConversation.artisanId,
      selectedConversation.artisanName,
      selectedConversation.artisanImage,
      messageInput
    );
    setMessageInput('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={false} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-warm-charcoal hover:text-primary group mb-4 flex items-center gap-2 transition"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-warm-charcoal font-serif text-4xl font-bold">Messages</h1>
          <p className="text-warm-charcoal/60 mt-2">
            Chat with artisans about their products and craft
          </p>
        </div>

        <div className="grid h-[600px] gap-6 md:grid-cols-3">
          {/* Conversations List */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-border border-b p-4">
              <h2 className="text-warm-charcoal font-semibold">Conversations</h2>
            </div>
            <div className="h-[calc(600px-60px)] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-warm-charcoal/60 p-8 text-center">
                  <p>No conversations yet</p>
                  <p className="mt-2 text-sm">Start messaging artisans from their profiles</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.artisanId}
                    onClick={() => setSelectedArtisan(conv.artisanId)}
                    className={`hover:bg-warm-sand/30 border-border flex w-full gap-3 border-b p-4 transition ${
                      selectedArtisan === conv.artisanId ? 'bg-warm-sand/50' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={conv.artisanImage || '/placeholder.svg'}
                        alt={conv.artisanName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-start justify-between">
                        <h3 className="text-warm-charcoal font-semibold">{conv.artisanName}</h3>
                        <span className="text-warm-charcoal/60 text-xs">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-warm-charcoal/60 mt-1 truncate text-sm">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm md:col-span-2">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="border-border flex items-center gap-3 border-b p-4">
                  <Link href={`/artisans/${selectedConversation.artisanId}`}>
                    <img
                      src={selectedConversation.artisanImage || '/placeholder.svg'}
                      alt={selectedConversation.artisanName}
                      className="ring-primary h-10 w-10 cursor-pointer rounded-full object-cover transition hover:ring-2"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/artisans/${selectedConversation.artisanId}`}
                      className="text-warm-charcoal hover:text-primary font-semibold transition"
                    >
                      {selectedConversation.artisanName}
                    </Link>
                    <p className="text-warm-charcoal/60 text-xs">Connected via WhatsApp</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          msg.sender === 'user'
                            ? 'bg-primary rounded-br-none text-white'
                            : 'bg-warm-sand text-warm-charcoal rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div className="mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3 opacity-60" />
                          <span className="text-xs opacity-60">
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-border border-t p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="border-border focus:ring-primary flex-1 rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-primary hover:bg-warm-rust flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-warm-charcoal/60 mt-2 text-xs">
                    Messages are delivered via WhatsApp. Artisan can reply here or on WhatsApp.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-warm-charcoal/60 flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="bg-warm-sand mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                    <Send className="text-primary h-10 w-10" />
                  </div>
                  <p className="text-lg font-semibold">Select a conversation</p>
                  <p className="mt-2 text-sm">Choose an artisan to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
