/**
 * Property-Based Test: Context Initialization
 * Feature: frontend-migration
 * Task: 16.3 Write property test for context initialization
 * 
 * **Property 23: Context Initialization**
 * **Validates: Requirements 22.3**
 * 
 * This property test verifies that for all context providers:
 * - Initialization completes without errors
 * - Default state is properly set
 * - All context methods are callable without throwing exceptions
 * 
 * The test uses fast-check to generate random sequences of operations
 * and verifies that contexts remain in valid states throughout.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import fc from 'fast-check';
import { AuthProvider, useAuth } from '../auth-context';
import { CartProvider, useCart } from '../cart-context';
import { MessageProvider, useMessages } from '../message-context';

describe('Property 23: Context Initialization', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('AuthContext Properties', () => {
    it('should initialize without errors for any initial localStorage state', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(null),
            fc.constant('customer'),
            fc.constant('artisan')
          ),
          (initialRole) => {
            // Setup localStorage
            if (initialRole !== null) {
              localStorage.setItem('artisans-active-role', initialRole);
            }

            // Should not throw during initialization
            const { result } = renderHook(() => useAuth(), {
              wrapper: AuthProvider,
            });

            // Context should be defined
            expect(result.current).toBeDefined();
            expect(result.current.login).toBeInstanceOf(Function);
            expect(result.current.logout).toBeInstanceOf(Function);
            
            // Role should be valid or null
            expect(['customer', 'artisan', null]).toContain(result.current.role);
            
            // isAuthenticated should match role state
            expect(result.current.isAuthenticated).toBe(result.current.role !== null);

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle any sequence of login/logout operations without errors', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              fc.record({ action: fc.constant('login'), role: fc.constantFrom('customer', 'artisan') }),
              fc.record({ action: fc.constant('logout') })
            ),
            { maxLength: 20 }
          ),
          (operations) => {
            const { result } = renderHook(() => useAuth(), {
              wrapper: AuthProvider,
            });

            // Execute all operations - none should throw
            operations.forEach((op) => {
              act(() => {
                if (op.action === 'login') {
                  result.current.login(op.role as 'customer' | 'artisan');
                } else {
                  result.current.logout();
                }
              });

              // After each operation, context should be in valid state
              expect(result.current).toBeDefined();
              expect(['customer', 'artisan', null]).toContain(result.current.role);
              expect(result.current.isAuthenticated).toBe(result.current.role !== null);
            });

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain localStorage consistency after any operation sequence', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              fc.record({ action: fc.constant('login'), role: fc.constantFrom('customer', 'artisan') }),
              fc.record({ action: fc.constant('logout') })
            ),
            { maxLength: 10 }
          ),
          (operations) => {
            const { result } = renderHook(() => useAuth(), {
              wrapper: AuthProvider,
            });

            operations.forEach((op) => {
              act(() => {
                if (op.action === 'login') {
                  result.current.login(op.role as 'customer' | 'artisan');
                } else {
                  result.current.logout();
                }
              });
            });

            // localStorage should match context state
            const storedRole = localStorage.getItem('artisans-active-role');
            if (result.current.role === null) {
              expect(storedRole).toBeNull();
            } else {
              expect(storedRole).toBe(result.current.role);
            }

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('CartContext Properties', () => {
    const cartItemArbitrary = fc.record({
      id: fc.string({ minLength: 1 }),
      name: fc.string({ minLength: 1 }),
      price: fc.nat({ max: 100000 }),
      image: fc.string(),
      artisan: fc.option(fc.string(), { nil: undefined }),
    });

    it('should initialize without errors for any initial localStorage state', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(null),
            fc.array(cartItemArbitrary.map(item => ({ ...item, quantity: 1 })), { maxLength: 10 }),
            fc.constant('invalid json'), // Corrupted data
            fc.constant('[]')
          ),
          (initialCart) => {
            // Setup localStorage
            if (initialCart !== null) {
              if (typeof initialCart === 'string') {
                localStorage.setItem('artisan-cart', initialCart);
              } else {
                localStorage.setItem('artisan-cart', JSON.stringify(initialCart));
              }
            }

            // Should not throw during initialization
            const { result } = renderHook(() => useCart(), {
              wrapper: CartProvider,
            });

            // Context should be defined with all methods
            expect(result.current).toBeDefined();
            expect(result.current.addToCart).toBeInstanceOf(Function);
            expect(result.current.removeFromCart).toBeInstanceOf(Function);
            expect(result.current.updateQuantity).toBeInstanceOf(Function);
            expect(result.current.clearCart).toBeInstanceOf(Function);
            
            // Items should be an array
            expect(Array.isArray(result.current.items)).toBe(true);
            
            // Totals should be non-negative numbers
            expect(result.current.totalItems).toBeGreaterThanOrEqual(0);
            expect(result.current.totalPrice).toBeGreaterThanOrEqual(0);

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle any sequence of cart operations without errors', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.oneof(
              fc.record({ 
                action: fc.constant('add'), 
                item: cartItemArbitrary,
                quantity: fc.nat({ max: 10 }).map(n => n + 1)
              }),
              fc.record({ 
                action: fc.constant('remove'), 
                id: fc.string({ minLength: 1 })
              }),
              fc.record({ 
                action: fc.constant('update'), 
                id: fc.string({ minLength: 1 }),
                quantity: fc.nat({ max: 10 })
              }),
              fc.record({ action: fc.constant('clear') })
            ),
            { maxLength: 20 }
          ),
          async (operations) => {
            const { result } = renderHook(() => useCart(), {
              wrapper: CartProvider,
            });

            // Execute all operations - none should throw
            for (const op of operations) {
              await act(async () => {
                if (op.action === 'add') {
                  result.current.addToCart(op.item, op.quantity);
                } else if (op.action === 'remove') {
                  result.current.removeFromCart(op.id);
                } else if (op.action === 'update') {
                  result.current.updateQuantity(op.id, op.quantity);
                } else if (op.action === 'clear') {
                  result.current.clearCart();
                }
              });

              // After each operation, context should be in valid state
              expect(result.current).toBeDefined();
              expect(Array.isArray(result.current.items)).toBe(true);
              expect(result.current.totalItems).toBeGreaterThanOrEqual(0);
              expect(result.current.totalPrice).toBeGreaterThanOrEqual(0);
              
              // All items should have positive quantities
              result.current.items.forEach(item => {
                expect(item.quantity).toBeGreaterThan(0);
              });
            }

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain correct totals after any operation sequence', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({ 
              item: cartItemArbitrary,
              quantity: fc.nat({ max: 5 }).map(n => n + 1)
            }),
            { minLength: 1, maxLength: 10 }
          ),
          async (itemsToAdd) => {
            const { result } = renderHook(() => useCart(), {
              wrapper: CartProvider,
            });

            // Add all items
            for (const { item, quantity } of itemsToAdd) {
              await act(async () => {
                result.current.addToCart(item, quantity);
              });
            }

            // Wait for state to settle
            await waitFor(() => {
              expect(result.current.items.length).toBeGreaterThan(0);
            });

            // Calculate expected totals
            const expectedTotalItems = result.current.items.reduce(
              (sum, item) => sum + item.quantity, 
              0
            );
            const expectedTotalPrice = result.current.items.reduce(
              (sum, item) => sum + item.price * item.quantity, 
              0
            );

            // Verify totals match
            expect(result.current.totalItems).toBe(expectedTotalItems);
            expect(result.current.totalPrice).toBe(expectedTotalPrice);

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('MessageContext Properties', () => {
    const messageArbitrary = fc.record({
      id: fc.string({ minLength: 1 }),
      artisanId: fc.string({ minLength: 1 }),
      artisanName: fc.string({ minLength: 1 }),
      artisanImage: fc.string(),
      content: fc.string({ minLength: 1 }),
      timestamp: fc.date(),
      sender: fc.constantFrom('user', 'artisan'),
      read: fc.boolean(),
    });

    const conversationArbitrary = fc.record({
      artisanId: fc.string({ minLength: 1 }),
      artisanName: fc.string({ minLength: 1 }),
      artisanImage: fc.string(),
      lastMessage: fc.string({ minLength: 1 }),
      lastMessageTime: fc.date(),
      unreadCount: fc.nat({ max: 10 }),
      messages: fc.array(messageArbitrary, { maxLength: 5 }),
    });

    it('should initialize without errors for any initial localStorage state', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(null),
            fc.array(conversationArbitrary, { maxLength: 10 }),
            fc.constant('invalid json'), // Corrupted data
            fc.constant('[]'),
            fc.constant('{}')
          ),
          (initialConversations) => {
            // Setup localStorage
            if (initialConversations !== null) {
              if (typeof initialConversations === 'string') {
                localStorage.setItem('artisan-conversations', initialConversations);
              } else {
                localStorage.setItem('artisan-conversations', JSON.stringify(initialConversations));
              }
            }

            // Should not throw during initialization
            const { result } = renderHook(() => useMessages(), {
              wrapper: MessageProvider,
            });

            // Context should be defined with all methods
            expect(result.current).toBeDefined();
            expect(result.current.sendMessage).toBeInstanceOf(Function);
            expect(result.current.markAsRead).toBeInstanceOf(Function);
            expect(result.current.getConversation).toBeInstanceOf(Function);
            expect(result.current.addArtisanReply).toBeInstanceOf(Function);
            
            // Conversations should be an array
            expect(Array.isArray(result.current.conversations)).toBe(true);
            
            // Unread count should be non-negative
            expect(result.current.unreadCount).toBeGreaterThanOrEqual(0);

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle any sequence of message operations without errors', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.oneof(
              fc.record({ 
                action: fc.constant('send'),
                artisanId: fc.string({ minLength: 1 }),
                artisanName: fc.string({ minLength: 1 }),
                artisanImage: fc.string(),
                content: fc.string({ minLength: 1 })
              }),
              fc.record({ 
                action: fc.constant('markRead'),
                artisanId: fc.string({ minLength: 1 })
              }),
              fc.record({ 
                action: fc.constant('addReply'),
                artisanId: fc.string({ minLength: 1 }),
                content: fc.string({ minLength: 1 }),
                messageId: fc.string({ minLength: 1 })
              })
            ),
            { maxLength: 15 }
          ),
          async (operations) => {
            const { result } = renderHook(() => useMessages(), {
              wrapper: MessageProvider,
            });

            // Execute all operations - none should throw
            for (const op of operations) {
              await act(async () => {
                if (op.action === 'send') {
                  await result.current.sendMessage(
                    op.artisanId,
                    op.artisanName,
                    op.artisanImage,
                    op.content
                  );
                } else if (op.action === 'markRead') {
                  result.current.markAsRead(op.artisanId);
                } else if (op.action === 'addReply') {
                  result.current.addArtisanReply(op.artisanId, op.content, op.messageId);
                }
              });

              // After each operation, context should be in valid state
              expect(result.current).toBeDefined();
              expect(Array.isArray(result.current.conversations)).toBe(true);
              expect(result.current.unreadCount).toBeGreaterThanOrEqual(0);
              
              // All conversations should have valid structure
              result.current.conversations.forEach(conv => {
                expect(conv.artisanId).toBeTruthy();
                expect(conv.artisanName).toBeTruthy();
                expect(Array.isArray(conv.messages)).toBe(true);
                expect(conv.unreadCount).toBeGreaterThanOrEqual(0);
                expect(conv.lastMessageTime).toBeInstanceOf(Date);
              });
            }

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain correct unread count after any operation sequence', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              artisanId: fc.string({ minLength: 1 }),
              artisanName: fc.string({ minLength: 1 }),
              artisanImage: fc.string(),
              content: fc.string({ minLength: 1 })
            }),
            { minLength: 1, maxLength: 5 }
          ),
          fc.array(fc.string({ minLength: 1 }), { maxLength: 3 }),
          async (messagesToSend, artisanIdsToMarkRead) => {
            const { result } = renderHook(() => useMessages(), {
              wrapper: MessageProvider,
            });

            // Send messages
            for (const msg of messagesToSend) {
              await act(async () => {
                await result.current.sendMessage(
                  msg.artisanId,
                  msg.artisanName,
                  msg.artisanImage,
                  msg.content
                );
              });
            }

            // Add some artisan replies (which create unread messages)
            for (const msg of messagesToSend.slice(0, 2)) {
              await act(async () => {
                result.current.addArtisanReply(
                  msg.artisanId,
                  'Reply content',
                  `reply-${Date.now()}`
                );
              });
            }

            // Mark some as read
            for (const artisanId of artisanIdsToMarkRead) {
              await act(async () => {
                result.current.markAsRead(artisanId);
              });
            }

            // Calculate expected unread count
            const expectedUnreadCount = result.current.conversations.reduce(
              (sum, conv) => sum + conv.unreadCount,
              0
            );

            // Verify unread count matches
            expect(result.current.unreadCount).toBe(expectedUnreadCount);

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Combined Context Properties', () => {
    it('should initialize all contexts without errors when nested', () => {
      fc.assert(
        fc.property(
          fc.record({
            authRole: fc.option(fc.constantFrom('customer', 'artisan'), { nil: null }),
            cartItems: fc.array(
              fc.record({
                id: fc.string({ minLength: 1 }),
                name: fc.string({ minLength: 1 }),
                price: fc.nat({ max: 10000 }),
                quantity: fc.nat({ max: 10 }).map(n => n + 1),
                image: fc.string(),
              }),
              { maxLength: 5 }
            ),
            conversations: fc.array(
              fc.record({
                artisanId: fc.string({ minLength: 1 }),
                artisanName: fc.string({ minLength: 1 }),
                artisanImage: fc.string(),
                lastMessage: fc.string({ minLength: 1 }),
                lastMessageTime: fc.date(),
                unreadCount: fc.nat({ max: 5 }),
                messages: fc.array(
                  fc.record({
                    id: fc.string({ minLength: 1 }),
                    artisanId: fc.string({ minLength: 1 }),
                    artisanName: fc.string({ minLength: 1 }),
                    artisanImage: fc.string(),
                    content: fc.string({ minLength: 1 }),
                    timestamp: fc.date(),
                    sender: fc.constantFrom('user', 'artisan'),
                    read: fc.boolean(),
                  }),
                  { maxLength: 3 }
                ),
              }),
              { maxLength: 3 }
            ),
          }),
          (initialState) => {
            // Setup localStorage for all contexts
            if (initialState.authRole) {
              localStorage.setItem('artisans-active-role', initialState.authRole);
            }
            if (initialState.cartItems.length > 0) {
              localStorage.setItem('artisan-cart', JSON.stringify(initialState.cartItems));
            }
            if (initialState.conversations.length > 0) {
              localStorage.setItem('artisan-conversations', JSON.stringify(initialState.conversations));
            }

            const AllProviders = ({ children }: { children: React.ReactNode }) => (
              <AuthProvider>
                <CartProvider>
                  <MessageProvider>{children}</MessageProvider>
                </CartProvider>
              </AuthProvider>
            );

            // Should not throw during initialization
            const { result } = renderHook(
              () => ({
                auth: useAuth(),
                cart: useCart(),
                messages: useMessages(),
              }),
              { wrapper: AllProviders }
            );

            // All contexts should be defined and functional
            expect(result.current.auth).toBeDefined();
            expect(result.current.cart).toBeDefined();
            expect(result.current.messages).toBeDefined();

            // All methods should be callable
            expect(result.current.auth.login).toBeInstanceOf(Function);
            expect(result.current.auth.logout).toBeInstanceOf(Function);
            expect(result.current.cart.addToCart).toBeInstanceOf(Function);
            expect(result.current.cart.clearCart).toBeInstanceOf(Function);
            expect(result.current.messages.sendMessage).toBeInstanceOf(Function);
            expect(result.current.messages.markAsRead).toBeInstanceOf(Function);

            // All state should be valid
            expect(['customer', 'artisan', null]).toContain(result.current.auth.role);
            expect(Array.isArray(result.current.cart.items)).toBe(true);
            expect(Array.isArray(result.current.messages.conversations)).toBe(true);

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain independent state across all contexts', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            authOps: fc.array(
              fc.oneof(
                fc.record({ action: fc.constant('login'), role: fc.constantFrom('customer', 'artisan') }),
                fc.record({ action: fc.constant('logout') })
              ),
              { maxLength: 5 }
            ),
            cartOps: fc.array(
              fc.record({
                action: fc.constant('add'),
                item: fc.record({
                  id: fc.string({ minLength: 1 }),
                  name: fc.string({ minLength: 1 }),
                  price: fc.nat({ max: 1000 }),
                  image: fc.string(),
                }),
                quantity: fc.nat({ max: 3 }).map(n => n + 1),
              }),
              { maxLength: 5 }
            ),
            messageOps: fc.array(
              fc.record({
                artisanId: fc.string({ minLength: 1 }),
                artisanName: fc.string({ minLength: 1 }),
                artisanImage: fc.string(),
                content: fc.string({ minLength: 1 }),
              }),
              { maxLength: 5 }
            ),
          }),
          async (operations) => {
            const AllProviders = ({ children }: { children: React.ReactNode }) => (
              <AuthProvider>
                <CartProvider>
                  <MessageProvider>{children}</MessageProvider>
                </CartProvider>
              </AuthProvider>
            );

            const { result } = renderHook(
              () => ({
                auth: useAuth(),
                cart: useCart(),
                messages: useMessages(),
              }),
              { wrapper: AllProviders }
            );

            // Execute auth operations
            for (const op of operations.authOps) {
              await act(async () => {
                if (op.action === 'login') {
                  result.current.auth.login(op.role);
                } else {
                  result.current.auth.logout();
                }
              });
            }

            // Execute cart operations
            for (const op of operations.cartOps) {
              await act(async () => {
                result.current.cart.addToCart(op.item, op.quantity);
              });
            }

            // Execute message operations
            for (const op of operations.messageOps) {
              await act(async () => {
                await result.current.messages.sendMessage(
                  op.artisanId,
                  op.artisanName,
                  op.artisanImage,
                  op.content
                );
              });
            }

            // All contexts should maintain valid independent state
            expect(result.current.auth).toBeDefined();
            expect(result.current.cart).toBeDefined();
            expect(result.current.messages).toBeDefined();

            // Verify each context has independent localStorage keys
            const authKey = localStorage.getItem('artisans-active-role');
            const cartKey = localStorage.getItem('artisan-cart');
            const messagesKey = localStorage.getItem('artisan-conversations');

            // Keys should be independent (not equal to each other)
            if (authKey && cartKey) expect(authKey).not.toBe(cartKey);
            if (authKey && messagesKey) expect(authKey).not.toBe(messagesKey);
            if (cartKey && messagesKey) expect(cartKey).not.toBe(messagesKey);

            localStorage.clear();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
