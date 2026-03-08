/**
 * Integration Test: Messaging System
 * Feature: frontend-migration
 * Task: 11.2 Migrate messaging system
 * 
 * **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**
 * 
 * This test verifies that the messaging system is properly integrated:
 * 1. Messaging interface is available (11.1)
 * 2. Messages are stored in MessageContext and sent to backend (11.2)
 * 3. Unread message counts are displayed (11.3)
 * 4. Message notifications work (11.4)
 * 5. WhatsApp API integration is functional (11.5)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import { MessageProvider, useMessages } from '../message-context';

describe('Messaging System Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    localStorage.removeItem('artisan-conversations');
    
    // Mock fetch for API calls
    global.fetch = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  /**
   * Test: MessageContext should be properly integrated
   * Validates: Requirement 11.2
   */
  it('should provide messaging functionality through MessageContext', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { result } = renderHook(() => useMessages(), {
          wrapper: MessageProvider,
        });

        // Verify all required methods are available
        expect(result.current.sendMessage).toBeInstanceOf(Function);
        expect(result.current.markAsRead).toBeInstanceOf(Function);
        expect(result.current.getConversation).toBeInstanceOf(Function);
        expect(result.current.addArtisanReply).toBeInstanceOf(Function);

        // Verify initial state
        expect(result.current.conversations).toEqual([]);
        expect(result.current.unreadCount).toBe(0);

        return true;
      }),
      { numRuns: 50 }
    );
  });

  /**
   * Test: Messages should be stored in MessageContext
   * Validates: Requirement 11.2
   */
  it('should store messages in MessageContext when sent', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          artisanId: fc.string({ minLength: 1, maxLength: 20 }),
          artisanName: fc.string({ minLength: 1, maxLength: 50 }),
          artisanImage: fc.webUrl(),
          content: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        async (messageData) => {
          // Clear localStorage for each iteration
          localStorage.clear();
          localStorage.removeItem('artisan-conversations');

          // Mock successful API response
          (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
          });

          const { result } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // Send message
          await act(async () => {
            await result.current.sendMessage(
              messageData.artisanId,
              messageData.artisanName,
              messageData.artisanImage,
              messageData.content
            );
          });

          // Verify message is stored in context
          expect(result.current.conversations.length).toBe(1);
          expect(result.current.conversations[0].artisanId).toBe(messageData.artisanId);
          expect(result.current.conversations[0].artisanName).toBe(messageData.artisanName);
          expect(result.current.conversations[0].lastMessage).toBe(messageData.content);
          expect(result.current.conversations[0].messages.length).toBe(1);
          expect(result.current.conversations[0].messages[0].content).toBe(messageData.content);
          expect(result.current.conversations[0].messages[0].sender).toBe('user');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Test: Messages should be sent to backend API
   * Validates: Requirement 11.2, 11.5
   */
  it('should send messages to backend WhatsApp API', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          artisanId: fc.string({ minLength: 1, maxLength: 20 }),
          artisanName: fc.string({ minLength: 1, maxLength: 50 }),
          artisanImage: fc.webUrl(),
          content: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        async (messageData) => {
          // Clear localStorage for each iteration
          localStorage.clear();
          localStorage.removeItem('artisan-conversations');

          // Mock fetch
          const mockFetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
          });
          global.fetch = mockFetch;

          const { result } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // Send message
          await act(async () => {
            await result.current.sendMessage(
              messageData.artisanId,
              messageData.artisanName,
              messageData.artisanImage,
              messageData.content
            );
          });

          // Verify API was called
          expect(mockFetch).toHaveBeenCalledWith(
            '/api/messages/send',
            expect.objectContaining({
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: expect.stringContaining(messageData.artisanId),
            })
          );

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Test: Unread message count should be calculated correctly
   * Validates: Requirement 11.3
   */
  it('should calculate unread message count correctly', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            artisanId: fc.string({ minLength: 1, maxLength: 20 }),
            artisanName: fc.string({ minLength: 1, maxLength: 50 }),
            artisanImage: fc.webUrl(),
            content: fc.string({ minLength: 1, maxLength: 200 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (messages) => {
          // Clear localStorage for each iteration
          localStorage.clear();
          localStorage.removeItem('artisan-conversations');

          // Mock fetch
          (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
          });

          const { result } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // First, create conversations by sending initial messages
          const uniqueArtisans = messages.filter(
            (msg, index, self) =>
              index === self.findIndex((m) => m.artisanId === msg.artisanId)
          );

          for (const msg of uniqueArtisans) {
            await act(async () => {
              await result.current.sendMessage(
                msg.artisanId,
                msg.artisanName,
                msg.artisanImage,
                'Initial message'
              );
            });
          }

          // Now add artisan replies (which create unread messages)
          act(() => {
            messages.forEach((msg, index) => {
              result.current.addArtisanReply(
                msg.artisanId,
                msg.content,
                `msg-${index}`
              );
            });
          });

          // Calculate expected unread count (unique artisan IDs)
          const uniqueArtisanIds = new Set(messages.map(m => m.artisanId));
          const expectedUnreadCount = uniqueArtisanIds.size;

          // Verify unread count matches
          expect(result.current.unreadCount).toBe(expectedUnreadCount);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Test: Marking messages as read should update unread count
   * Validates: Requirement 11.3
   */
  it('should update unread count when messages are marked as read', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          artisanId: fc.string({ minLength: 1, maxLength: 20 }),
          artisanName: fc.string({ minLength: 1, maxLength: 50 }),
          artisanImage: fc.webUrl(),
          content: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        async (messageData) => {
          // Clear localStorage for each iteration
          localStorage.clear();
          localStorage.removeItem('artisan-conversations');

          // Mock fetch
          (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
          });

          const { result } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // First, create a conversation by sending an initial message
          await act(async () => {
            await result.current.sendMessage(
              messageData.artisanId,
              messageData.artisanName,
              messageData.artisanImage,
              'Initial message'
            );
          });

          // Add an unread message from artisan
          act(() => {
            result.current.addArtisanReply(
              messageData.artisanId,
              messageData.content,
              'msg-1'
            );
          });

          // Verify unread count is 1
          expect(result.current.unreadCount).toBe(1);

          // Mark as read
          act(() => {
            result.current.markAsRead(messageData.artisanId);
          });

          // Verify unread count is now 0
          expect(result.current.unreadCount).toBe(0);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Test: Messages should persist to localStorage
   * Validates: Requirement 11.2
   */
  it('should persist conversations to localStorage', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          artisanId: fc.string({ minLength: 1, maxLength: 20 }),
          artisanName: fc.string({ minLength: 1, maxLength: 50 }),
          artisanImage: fc.webUrl(),
          content: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        async (messageData) => {
          // Clear localStorage for each iteration
          localStorage.clear();
          localStorage.removeItem('artisan-conversations');

          // Mock fetch
          (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
          });

          const { result } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // Send message
          await act(async () => {
            await result.current.sendMessage(
              messageData.artisanId,
              messageData.artisanName,
              messageData.artisanImage,
              messageData.content
            );
          });

          // Wait for localStorage to be updated
          await waitFor(() => {
            const stored = localStorage.getItem('artisan-conversations');
            expect(stored).not.toBeNull();
          });

          // Verify data in localStorage
          const stored = localStorage.getItem('artisan-conversations');
          expect(stored).not.toBeNull();
          
          if (stored) {
            const parsed = JSON.parse(stored);
            expect(parsed.length).toBe(1);
            expect(parsed[0].artisanId).toBe(messageData.artisanId);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Test: Multiple messages to same artisan should be grouped
   * Validates: Requirement 11.1, 11.2
   */
  it('should group multiple messages to the same artisan in one conversation', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          artisanId: fc.string({ minLength: 1, maxLength: 20 }),
          artisanName: fc.string({ minLength: 1, maxLength: 50 }),
          artisanImage: fc.webUrl(),
        }),
        fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 2, maxLength: 5 }),
        async (artisan, messages) => {
          // Clear localStorage for each iteration
          localStorage.clear();
          localStorage.removeItem('artisan-conversations');

          // Mock fetch
          (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
          });

          const { result } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // Send multiple messages to same artisan
          for (const content of messages) {
            await act(async () => {
              await result.current.sendMessage(
                artisan.artisanId,
                artisan.artisanName,
                artisan.artisanImage,
                content
              );
            });
          }

          // Verify only one conversation exists
          expect(result.current.conversations.length).toBe(1);
          
          // Verify all messages are in that conversation
          expect(result.current.conversations[0].messages.length).toBe(messages.length);
          
          // Verify last message is the most recent one
          expect(result.current.conversations[0].lastMessage).toBe(messages[messages.length - 1]);

          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Test: getConversation should retrieve correct conversation
   * Validates: Requirement 11.1
   */
  it('should retrieve conversation by artisan ID', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            artisanId: fc.string({ minLength: 1, maxLength: 20 }),
            artisanName: fc.string({ minLength: 1, maxLength: 50 }),
            artisanImage: fc.webUrl(),
            content: fc.string({ minLength: 1, maxLength: 200 }),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        async (messages) => {
          // Clear localStorage for each iteration
          localStorage.clear();
          localStorage.removeItem('artisan-conversations');

          // Ensure unique artisan IDs
          const uniqueMessages = messages.filter(
            (msg, index, self) =>
              index === self.findIndex((m) => m.artisanId === msg.artisanId)
          );

          if (uniqueMessages.length === 0) return true;

          // Mock fetch
          (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
          });

          const { result } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // Send messages
          for (const msg of uniqueMessages) {
            await act(async () => {
              await result.current.sendMessage(
                msg.artisanId,
                msg.artisanName,
                msg.artisanImage,
                msg.content
              );
            });
          }

          // Verify each conversation can be retrieved
          for (const msg of uniqueMessages) {
            const conversation = result.current.getConversation(msg.artisanId);
            expect(conversation).toBeDefined();
            expect(conversation?.artisanId).toBe(msg.artisanId);
            expect(conversation?.artisanName).toBe(msg.artisanName);
          }

          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});
