'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Message {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanImage: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'artisan';
  read: boolean;
}

export interface Conversation {
  artisanId: string;
  artisanName: string;
  artisanImage: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

interface MessageContextType {
  conversations: Conversation[];
  unreadCount: number;
  sendMessage: (
    artisanId: string,
    artisanName: string,
    artisanImage: string,
    content: string
  ) => Promise<void>;
  markAsRead: (artisanId: string) => void;
  getConversation: (artisanId: string) => Conversation | undefined;
  addArtisanReply: (artisanId: string, content: string, messageId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('artisan-conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((conv: any) => ({
          ...conv,
          lastMessageTime: new Date(conv.lastMessageTime),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('artisan-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const sendMessage = useCallback(
    async (artisanId: string, artisanName: string, artisanImage: string, content: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        artisanId,
        artisanName,
        artisanImage,
        content,
        timestamp: new Date(),
        sender: 'user',
        read: true,
      };

      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.artisanId === artisanId);

        if (existingIndex >= 0) {
          // Update existing conversation
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            lastMessage: content,
            lastMessageTime: new Date(),
            messages: [...updated[existingIndex].messages, newMessage],
          };
          return updated;
        } else {
          // Create new conversation
          return [
            ...prev,
            {
              artisanId,
              artisanName,
              artisanImage,
              lastMessage: content,
              lastMessageTime: new Date(),
              unreadCount: 0,
              messages: [newMessage],
            },
          ];
        }
      });

      // Send to WhatsApp via API
      try {
        await fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            artisanId,
            artisanName,
            content,
            messageId: newMessage.id,
          }),
        });
      } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
      }

      // Emit custom event for notification
      window.dispatchEvent(
        new CustomEvent('messageSent', {
          detail: { artisanName, content },
        })
      );
    },
    []
  );

  const markAsRead = useCallback((artisanId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.artisanId === artisanId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map((msg) => ({ ...msg, read: true })),
          };
        }
        return conv;
      })
    );
  }, []);

  const getConversation = useCallback(
    (artisanId: string) => {
      return conversations.find((c) => c.artisanId === artisanId);
    },
    [conversations]
  );

  const addArtisanReply = useCallback((artisanId: string, content: string, messageId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.artisanId === artisanId) {
          const newMessage: Message = {
            id: messageId,
            artisanId: conv.artisanId,
            artisanName: conv.artisanName,
            artisanImage: conv.artisanImage,
            content,
            timestamp: new Date(),
            sender: 'artisan',
            read: false,
          };

          return {
            ...conv,
            lastMessage: content,
            lastMessageTime: new Date(),
            unreadCount: conv.unreadCount + 1,
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );
  }, []);

  return (
    <MessageContext.Provider
      value={{
        conversations,
        unreadCount,
        sendMessage,
        markAsRead,
        getConversation,
        addArtisanReply,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
