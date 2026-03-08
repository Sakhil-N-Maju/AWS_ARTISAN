/**
 * Property-Based Test: State Management Persistence
 * Feature: frontend-migration
 * Property 14: State Management Persistence
 * 
 * **Validates: Requirements 2.2, 2.3, 11.2**
 * 
 * This test verifies that Cart and Messages contexts:
 * 1. Automatically persist state changes to localStorage
 * 2. Restore state from localStorage on initialization
 * 3. Handle localStorage round-trip correctly (save → load → verify)
 * 4. Maintain data integrity across browser sessions
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import { CartProvider, useCart } from '../cart-context';
import { MessageProvider, useMessages } from '../message-context';

describe('Property 14: State Management Persistence', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Also clear any specific keys we use
    localStorage.removeItem('artisan-cart');
    localStorage.removeItem('artisan-conversations');
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    localStorage.removeItem('artisan-cart');
    localStorage.removeItem('artisan-conversations');
  });

  /**
   * Property: Cart state should persist to localStorage and restore on init
   * 
   * For any cart state changes, the state should be automatically saved to
   * localStorage and correctly restored when the provider is re-initialized.
   */
  it('should persist cart state to localStorage and restore on initialization', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 1, max: 100000 }),
            image: fc.webUrl(),
            artisan: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (cartItems) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          // Phase 1: Add items to cart
          const { result: result1, unmount: unmount1 } = renderHook(() => useCart(), {
            wrapper: CartProvider,
          });

          act(() => {
            cartItems.forEach((item) => {
              result1.current.addToCart(item, 1);
            });
          });

          // Calculate expected values accounting for duplicate IDs
          const uniqueIds = new Set(cartItems.map(item => item.id));
          const expectedItemCount = uniqueIds.size;
          
          // Calculate expected total quantity (items with same ID get merged)
          const idCounts = new Map<string, number>();
          cartItems.forEach(item => {
            idCounts.set(item.id, (idCounts.get(item.id) || 0) + 1);
          });
          const expectedTotalQuantity = Array.from(idCounts.values()).reduce((sum, count) => sum + count, 0);

          // Calculate expected total price (use last price for each ID since items get merged)
          const idPrices = new Map<string, number>();
          cartItems.forEach(item => {
            idPrices.set(item.id, item.price);
          });
          let expectedTotalPrice = 0;
          idCounts.forEach((count, id) => {
            expectedTotalPrice += (idPrices.get(id) || 0) * count;
          });

          // Verify items were added
          expect(result1.current.items.length).toBe(expectedItemCount);
          expect(result1.current.totalItems).toBe(expectedTotalQuantity);
          expect(result1.current.totalPrice).toBe(expectedTotalPrice);

          // Unmount to simulate closing the app
          unmount1();

          // Phase 2: Re-initialize provider and verify state is restored
          const { result: result2 } = renderHook(() => useCart(), {
            wrapper: CartProvider,
          });

          // Verify all items were restored from localStorage
          expect(result2.current.items.length).toBe(expectedItemCount);
          expect(result2.current.totalItems).toBe(expectedTotalQuantity);
          expect(result2.current.totalPrice).toBe(expectedTotalPrice);

          // Verify each unique item's data is intact
          uniqueIds.forEach((id) => {
            const restoredItem = result2.current.items.find(item => item.id === id);
            expect(restoredItem).toBeDefined();
            expect(restoredItem?.quantity).toBe(idCounts.get(id));
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Cart updates should persist incrementally
   * 
   * For any sequence of cart operations (add, remove, update), each change
   * should be persisted to localStorage immediately.
   */
  it('should persist cart updates incrementally to localStorage', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          price: fc.integer({ min: 1, max: 100000 }),
          image: fc.webUrl(),
        }),
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 1, max: 20 }),
        (cartItem, initialQuantity, updatedQuantity) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          const { result, unmount } = renderHook(() => useCart(), {
            wrapper: CartProvider,
          });

          // Add item with initial quantity
          act(() => {
            result.current.addToCart(cartItem, initialQuantity);
          });

          expect(result.current.items.length).toBe(1);
          expect(result.current.items[0].quantity).toBe(initialQuantity);
          expect(result.current.totalItems).toBe(initialQuantity);

          // Update quantity
          act(() => {
            result.current.updateQuantity(cartItem.id, updatedQuantity);
          });

          expect(result.current.items[0].quantity).toBe(updatedQuantity);
          expect(result.current.totalItems).toBe(updatedQuantity);

          unmount();

          // Verify updated quantity was persisted
          const { result: result2 } = renderHook(() => useCart(), {
            wrapper: CartProvider,
          });

          expect(result2.current.items.length).toBe(1);
          expect(result2.current.items[0].quantity).toBe(updatedQuantity);
          expect(result2.current.totalItems).toBe(updatedQuantity);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Cart removal should persist to localStorage
   * 
   * When items are removed from cart, the removal should be persisted
   * to localStorage immediately.
   */
  it('should persist cart item removal to localStorage', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 1, max: 100000 }),
            image: fc.webUrl(),
          }),
          { minLength: 2, maxLength: 10 }
        ),
        fc.integer({ min: 0, max: 9 }),
        (cartItems, removeIndex) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          // Ensure unique IDs to avoid merging
          const uniqueItems = cartItems.map((item, idx) => ({
            ...item,
            id: `${item.id}-${idx}` // Make IDs unique
          }));

          const validRemoveIndex = removeIndex % uniqueItems.length;
          const itemToRemove = uniqueItems[validRemoveIndex];

          const { result, unmount } = renderHook(() => useCart(), {
            wrapper: CartProvider,
          });

          // Add all items
          act(() => {
            uniqueItems.forEach((item) => {
              result.current.addToCart(item, 1);
            });
          });

          expect(result.current.items.length).toBe(uniqueItems.length);

          // Remove one item
          act(() => {
            result.current.removeFromCart(itemToRemove.id);
          });

          expect(result.current.items.length).toBe(uniqueItems.length - 1);
          expect(result.current.items.find(item => item.id === itemToRemove.id)).toBeUndefined();

          unmount();

          // Verify removal was persisted
          const { result: result2 } = renderHook(() => useCart(), {
            wrapper: CartProvider,
          });

          expect(result2.current.items.length).toBe(uniqueItems.length - 1);
          expect(result2.current.items.find(item => item.id === itemToRemove.id)).toBeUndefined();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Cart clear should persist to localStorage
   * 
   * When the cart is cleared, the empty state should be persisted
   * to localStorage.
   */
  it('should persist cart clear operation to localStorage', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 1, max: 100000 }),
            image: fc.webUrl(),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (cartItems) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          const { result, unmount } = renderHook(() => useCart(), {
            wrapper: CartProvider,
          });

          // Add items
          act(() => {
            cartItems.forEach((item) => {
              result.current.addToCart(item, 1);
            });
          });

          // Verify items were added (accounting for duplicates)
          expect(result.current.items.length).toBeGreaterThan(0);

          // Clear cart
          act(() => {
            result.current.clearCart();
          });

          expect(result.current.items.length).toBe(0);
          expect(result.current.totalItems).toBe(0);
          expect(result.current.totalPrice).toBe(0);

          unmount();

          // Verify empty cart was persisted
          const { result: result2 } = renderHook(() => useCart(), {
            wrapper: CartProvider,
          });

          expect(result2.current.items.length).toBe(0);
          expect(result2.current.totalItems).toBe(0);
          expect(result2.current.totalPrice).toBe(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Messages state should persist to localStorage and restore on init
   * 
   * For any message conversations, the state should be automatically saved to
   * localStorage and correctly restored when the provider is re-initialized.
   */
  it('should persist messages state to localStorage and restore on initialization', () => {
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
          // Phase 1: Send messages
          const { result: result1, unmount: unmount1 } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // Send all messages
          await act(async () => {
            for (const msg of messages) {
              await result1.current.sendMessage(
                msg.artisanId,
                msg.artisanName,
                msg.artisanImage,
                msg.content
              );
            }
          });

          // Verify messages were added
          expect(result1.current.conversations.length).toBe(messages.length);

          // Verify each conversation
          messages.forEach((msg) => {
            const conversation = result1.current.getConversation(msg.artisanId);
            expect(conversation).toBeDefined();
            expect(conversation?.artisanName).toBe(msg.artisanName);
            expect(conversation?.lastMessage).toBe(msg.content);
            expect(conversation?.messages.length).toBeGreaterThan(0);
          });

          // Unmount to simulate closing the app
          unmount1();

          // Phase 2: Re-initialize provider and verify state is restored
          const { result: result2 } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // Verify all conversations were restored from localStorage
          expect(result2.current.conversations.length).toBe(messages.length);

          // Verify each conversation's data is intact
          messages.forEach((msg) => {
            const conversation = result2.current.getConversation(msg.artisanId);
            expect(conversation).toBeDefined();
            expect(conversation?.artisanName).toBe(msg.artisanName);
            expect(conversation?.lastMessage).toBe(msg.content);
            expect(conversation?.messages.length).toBeGreaterThan(0);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Message read status should persist to localStorage
   * 
   * When messages are marked as read, the updated read status should be
   * persisted to localStorage.
   */
  it('should persist message read status to localStorage', () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          artisanId: fc.string({ minLength: 1, maxLength: 20 }),
          artisanName: fc.string({ minLength: 1, maxLength: 50 }),
          artisanImage: fc.webUrl(),
          content: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        async (messageData) => {
          const { result, unmount } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // Send a message
          await act(async () => {
            await result.current.sendMessage(
              messageData.artisanId,
              messageData.artisanName,
              messageData.artisanImage,
              messageData.content
            );
          });

          // Add an artisan reply (which creates unread messages)
          act(() => {
            result.current.addArtisanReply(
              messageData.artisanId,
              'Reply from artisan',
              'reply-1'
            );
          });

          expect(result.current.unreadCount).toBe(1);

          // Mark as read
          act(() => {
            result.current.markAsRead(messageData.artisanId);
          });

          expect(result.current.unreadCount).toBe(0);

          unmount();

          // Verify read status was persisted
          const { result: result2 } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          expect(result2.current.unreadCount).toBe(0);
          const conversation = result2.current.getConversation(messageData.artisanId);
          expect(conversation?.unreadCount).toBe(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Multiple conversations should persist independently
   * 
   * When multiple conversations exist, each should be persisted and restored
   * independently without data corruption.
   */
  it('should persist multiple conversations independently to localStorage', () => {
    fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            artisanId: fc.string({ minLength: 1, maxLength: 20 }),
            artisanName: fc.string({ minLength: 1, maxLength: 50 }),
            artisanImage: fc.webUrl(),
            messages: fc.array(
              fc.string({ minLength: 1, maxLength: 200 }),
              { minLength: 1, maxLength: 3 }
            ),
          }),
          { minLength: 2, maxLength: 5 }
        ),
        async (conversations) => {
          const { result, unmount } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          // Send messages for each conversation
          await act(async () => {
            for (const conv of conversations) {
              for (const content of conv.messages) {
                await result.current.sendMessage(
                  conv.artisanId,
                  conv.artisanName,
                  conv.artisanImage,
                  content
                );
              }
            }
          });

          // Verify all conversations exist
          expect(result.current.conversations.length).toBe(conversations.length);

          // Verify each conversation has correct message count
          conversations.forEach((conv) => {
            const conversation = result.current.getConversation(conv.artisanId);
            expect(conversation).toBeDefined();
            expect(conversation?.messages.length).toBe(conv.messages.length);
            expect(conversation?.lastMessage).toBe(conv.messages[conv.messages.length - 1]);
          });

          unmount();

          // Verify all conversations were restored correctly
          const { result: result2 } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          expect(result2.current.conversations.length).toBe(conversations.length);

          conversations.forEach((conv) => {
            const conversation = result2.current.getConversation(conv.artisanId);
            expect(conversation).toBeDefined();
            expect(conversation?.messages.length).toBe(conv.messages.length);
            expect(conversation?.lastMessage).toBe(conv.messages[conv.messages.length - 1]);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Date objects should be correctly serialized and deserialized
   * 
   * When state containing Date objects is persisted to localStorage,
   * the dates should be correctly restored as Date objects (not strings).
   */
  it('should correctly serialize and deserialize Date objects in localStorage', () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          artisanId: fc.string({ minLength: 1, maxLength: 20 }),
          artisanName: fc.string({ minLength: 1, maxLength: 50 }),
          artisanImage: fc.webUrl(),
          content: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        async (messageData) => {
          const { result, unmount } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          const beforeSend = Date.now();

          // Send a message
          await act(async () => {
            await result.current.sendMessage(
              messageData.artisanId,
              messageData.artisanName,
              messageData.artisanImage,
              messageData.content
            );
          });

          const afterSend = Date.now();

          const conversation1 = result.current.getConversation(messageData.artisanId);
          expect(conversation1?.lastMessageTime).toBeInstanceOf(Date);
          expect(conversation1?.lastMessageTime.getTime()).toBeGreaterThanOrEqual(beforeSend);
          expect(conversation1?.lastMessageTime.getTime()).toBeLessThanOrEqual(afterSend);

          unmount();

          // Verify Date objects are restored correctly
          const { result: result2 } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          const conversation2 = result2.current.getConversation(messageData.artisanId);
          expect(conversation2?.lastMessageTime).toBeInstanceOf(Date);
          expect(conversation2?.lastMessageTime.getTime()).toBeGreaterThanOrEqual(beforeSend);
          expect(conversation2?.lastMessageTime.getTime()).toBeLessThanOrEqual(afterSend);

          // Verify message timestamps are also Date objects
          expect(conversation2?.messages[0].timestamp).toBeInstanceOf(Date);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: localStorage corruption should not crash the application
   * 
   * When localStorage contains invalid JSON or corrupted data, the provider
   * should gracefully handle the error and initialize with default state.
   */
  it('should handle corrupted localStorage data gracefully', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'invalid json',
          '{incomplete',
          '{"items": [}',
          'null',
          'undefined',
          '[]',
          '{}'
        ),
        (corruptedData) => {
          // Corrupt the localStorage
          localStorage.setItem('cart', corruptedData);
          localStorage.setItem('artisan-conversations', corruptedData);

          // Cart should initialize with default state despite corruption
          const { result: cartResult } = renderHook(() => useCart(), {
            wrapper: CartProvider,
          });

          expect(cartResult.current.items).toEqual([]);
          expect(cartResult.current.totalItems).toBe(0);
          expect(cartResult.current.totalPrice).toBe(0);

          // Messages should initialize with default state despite corruption
          const { result: messageResult } = renderHook(() => useMessages(), {
            wrapper: MessageProvider,
          });

          expect(messageResult.current.conversations).toEqual([]);
          expect(messageResult.current.unreadCount).toBe(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
