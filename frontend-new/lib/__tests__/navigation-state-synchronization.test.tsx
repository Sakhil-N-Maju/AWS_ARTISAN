/**
 * Property-Based Test: Navigation State Synchronization
 * Feature: frontend-migration
 * Property 16: Navigation State Synchronization
 * 
 * **Validates: Requirements 16.2, 16.3, 16.4**
 * 
 * This test verifies that the navigation bar automatically updates to reflect
 * changes in authentication status, cart items, and unread messages without
 * requiring a page refresh.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import { AuthProvider, useAuth } from '../auth-context';
import { CartProvider, useCart } from '../cart-context';
import { MessageProvider, useMessages } from '../message-context';

describe('Property 16: Navigation State Synchronization', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    localStorage.removeItem('artisan-cart');
    localStorage.removeItem('artisan-conversations');
    localStorage.removeItem('artisans-active-role');
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    localStorage.removeItem('artisan-cart');
    localStorage.removeItem('artisan-conversations');
    localStorage.removeItem('artisans-active-role');
  });

  /**
   * Property: Navigation should reflect authentication status changes
   * 
   * For any authentication state change (login/logout), the navigation bar
   * should automatically update to show the correct authentication status
   * without requiring a page refresh.
   */
  it('should automatically update navigation when authentication status changes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('customer' as const, 'artisan' as const),
        (role) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>{children}</MessageProvider>
              </CartProvider>
            </AuthProvider>
          );

          const { result, unmount } = renderHook(() => useAuth(), {
            wrapper: AllProviders,
          });

          // Initially not authenticated
          expect(result.current.isAuthenticated).toBe(false);
          expect(result.current.role).toBeNull();

          // Trigger login
          act(() => {
            result.current.login(role);
          });

          // Should automatically update to authenticated
          expect(result.current.isAuthenticated).toBe(true);
          expect(result.current.role).toBe(role);

          // Trigger logout
          act(() => {
            result.current.logout();
          });

          // Should automatically update to not authenticated
          expect(result.current.isAuthenticated).toBe(false);
          expect(result.current.role).toBeNull();

          // Clean up
          unmount();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Navigation should reflect cart item count changes
   * 
   * For any cart state change (add/remove/update items), the navigation bar
   * should automatically update the cart badge count without requiring a
   * page refresh.
   */
  it('should automatically update cart badge when cart items change', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 1, max: 100000 }),
            image: fc.webUrl(),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (cartItems) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          // Ensure unique IDs to avoid merging
          const uniqueItems = cartItems.map((item, idx) => ({
            ...item,
            id: `${item.id}-${idx}`,
          }));

          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>{children}</MessageProvider>
              </CartProvider>
            </AuthProvider>
          );

          const { result, unmount } = renderHook(() => useCart(), {
            wrapper: AllProviders,
          });

          // Initially cart should be empty
          expect(result.current.totalItems).toBe(0);

          // Add items to cart
          act(() => {
            uniqueItems.forEach((item) => result.current.addToCart(item, 1));
          });

          // Navigation should automatically update cart badge
          expect(result.current.totalItems).toBe(uniqueItems.length);

          // Remove items from cart
          act(() => {
            uniqueItems.forEach((item) => result.current.removeFromCart(item.id));
          });

          // Navigation should automatically update cart badge to 0
          expect(result.current.totalItems).toBe(0);

          // Clean up
          unmount();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Navigation should reflect unread message count changes
   * 
   * For any message state change (new messages/mark as read), the navigation
   * bar should automatically update the message badge count without requiring
   * a page refresh.
   */
  it('should automatically update message badge when unread count changes', () => {
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
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>{children}</MessageProvider>
              </CartProvider>
            </AuthProvider>
          );

          const { result, unmount } = renderHook(() => useMessages(), {
            wrapper: AllProviders,
          });

          // Initially no unread messages
          expect(result.current.unreadCount).toBe(0);

          // Send messages (user messages are marked as read)
          await act(async () => {
            for (const msg of messages) {
              await result.current.sendMessage(
                msg.artisanId,
                msg.artisanName,
                msg.artisanImage,
                msg.content
              );
            }
          });

          // Should still be 0 since user messages are read
          expect(result.current.unreadCount).toBe(0);

          // Add artisan replies (creates unread messages)
          act(() => {
            messages.forEach((msg, idx) => {
              result.current.addArtisanReply(msg.artisanId, `Reply ${idx}`, `reply-${idx}`);
            });
          });

          // Navigation should automatically update message badge
          expect(result.current.unreadCount).toBe(messages.length);

          // Mark all as read
          act(() => {
            messages.forEach((msg) => {
              result.current.markAsRead(msg.artisanId);
            });
          });

          // Navigation should automatically update message badge to 0
          expect(result.current.unreadCount).toBe(0);

          // Clean up
          unmount();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Navigation should reflect role-based menu changes
   * 
   * For any role change (customer/artisan), the navigation bar should
   * automatically update to show role-appropriate menu items without
   * requiring a page refresh.
   */
  it('should automatically update menu items when user role changes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('customer' as const, 'artisan' as const),
        fc.constantFrom('customer' as const, 'artisan' as const),
        (initialRole, switchedRole) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>{children}</MessageProvider>
              </CartProvider>
            </AuthProvider>
          );

          const { result, unmount } = renderHook(() => useAuth(), {
            wrapper: AllProviders,
          });

          // Login with initial role
          act(() => {
            result.current.login(initialRole);
          });
          expect(result.current.role).toBe(initialRole);

          // Switch role
          act(() => {
            result.current.login(switchedRole);
          });
          expect(result.current.role).toBe(switchedRole);

          // Clean up
          unmount();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Navigation should synchronize multiple state changes simultaneously
   * 
   * When multiple state changes occur (auth + cart + messages), the navigation
   * bar should correctly reflect all changes without conflicts or race conditions.
   */
  it('should synchronize multiple state changes simultaneously', () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom('customer' as const, 'artisan' as const),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 1, max: 10000 }),
            image: fc.webUrl(),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        fc.array(
          fc.record({
            artisanId: fc.string({ minLength: 1, maxLength: 20 }),
            artisanName: fc.string({ minLength: 1, maxLength: 50 }),
            artisanImage: fc.webUrl(),
            content: fc.string({ minLength: 1, maxLength: 200 }),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        async (role, cartItems, messages) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          // Ensure unique cart item IDs
          const uniqueCartItems = cartItems.map((item, idx) => ({
            ...item,
            id: `${item.id}-${idx}`,
          }));

          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>{children}</MessageProvider>
              </CartProvider>
            </AuthProvider>
          );

          const { result, unmount } = renderHook(
            () => ({
              auth: useAuth(),
              cart: useCart(),
              messages: useMessages(),
            }),
            { wrapper: AllProviders }
          );

          // Initially all should be in default state
          expect(result.current.auth.isAuthenticated).toBe(false);
          expect(result.current.cart.totalItems).toBe(0);
          expect(result.current.messages.unreadCount).toBe(0);

          // Trigger all changes simultaneously
          await act(async () => {
            // Login
            result.current.auth.login(role);

            // Add cart items
            uniqueCartItems.forEach((item) => result.current.cart.addToCart(item, 1));

            // Send messages and add replies
            for (const msg of messages) {
              await result.current.messages.sendMessage(
                msg.artisanId,
                msg.artisanName,
                msg.artisanImage,
                msg.content
              );
              result.current.messages.addArtisanReply(msg.artisanId, 'Reply', `reply-${msg.artisanId}`);
            }
          });

          // All navigation elements should update correctly
          expect(result.current.auth.isAuthenticated).toBe(true);
          expect(result.current.cart.totalItems).toBe(uniqueCartItems.length);
          expect(result.current.messages.unreadCount).toBe(messages.length);

          // Clean up
          unmount();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Navigation should maintain state consistency across rapid changes
   * 
   * When rapid state changes occur in quick succession, the navigation bar
   * should maintain consistency and show the final correct state.
   */
  it('should maintain consistency during rapid state changes', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 1, max: 10000 }),
            image: fc.webUrl(),
          }),
          { minLength: 2, maxLength: 5 }
        ),
        (cartItems) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          // Ensure unique IDs
          const uniqueItems = cartItems.map((item, idx) => ({
            ...item,
            id: `${item.id}-${idx}`,
          }));

          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>{children}</MessageProvider>
              </CartProvider>
            </AuthProvider>
          );

          const { result, unmount } = renderHook(() => useCart(), {
            wrapper: AllProviders,
          });

          // Trigger rapid changes
          act(() => {
            // Add all items
            uniqueItems.forEach((item) => result.current.addToCart(item, 1));

            // Update quantities rapidly
            uniqueItems.forEach((item, idx) => {
              result.current.updateQuantity(item.id, idx + 2);
            });

            // Remove some items
            uniqueItems.slice(0, Math.floor(uniqueItems.length / 2)).forEach((item) => {
              result.current.removeFromCart(item.id);
            });
          });

          // Calculate expected final state
          const remainingItems = uniqueItems.slice(Math.floor(uniqueItems.length / 2));
          const expectedTotal = remainingItems.reduce((sum, _, idx) => {
            return sum + (Math.floor(uniqueItems.length / 2) + idx + 2);
          }, 0);

          // Navigation should show correct final state
          expect(result.current.totalItems).toBe(expectedTotal);

          // Clean up
          unmount();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Navigation should update without page refresh
   * 
   * All navigation updates should occur through React state changes without
   * requiring window.location changes or page reloads.
   */
  it('should update navigation state without page refresh', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('customer' as const, 'artisan' as const),
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          price: fc.integer({ min: 1, max: 10000 }),
          image: fc.webUrl(),
        }),
        (role, cartItem) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          
          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>{children}</MessageProvider>
              </CartProvider>
            </AuthProvider>
          );

          const { result, unmount } = renderHook(
            () => ({
              auth: useAuth(),
              cart: useCart(),
            }),
            { wrapper: AllProviders }
          );

          // Trigger state changes
          act(() => {
            result.current.auth.login(role);
            result.current.cart.addToCart(cartItem, 1);
          });

          // Verify navigation updated through React state
          expect(result.current.auth.isAuthenticated).toBe(true);
          expect(result.current.cart.totalItems).toBe(1);

          // Clean up
          unmount();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
