/**
 * Property-Based Test: Context Provider Integration
 * Feature: frontend-migration
 * Property 6: Context Provider Integration
 * 
 * **Validates: Requirements 2.4, 2.5, 2.6**
 * 
 * This test verifies that all migrated context providers (Auth, Cart, Message) are:
 * 1. Properly nested in the correct order (Auth → Cart → Message)
 * 2. All hooks (useAuth, useCart, useMessages) are exported and accessible
 * 3. Context providers initialize correctly and provide expected functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import { AuthProvider, useAuth } from '../auth-context';
import { CartProvider, useCart } from '../cart-context';
import { MessageProvider, useMessages } from '../message-context';

describe('Property 6: Context Provider Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    localStorage.removeItem('artisan-cart');
    localStorage.removeItem('artisan-conversations');
    localStorage.removeItem('artisan-role');
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    localStorage.removeItem('artisan-cart');
    localStorage.removeItem('artisan-conversations');
    localStorage.removeItem('artisan-role');
  });

  /**
   * Property: All context providers should be properly nested and accessible
   * 
   * This test verifies that when providers are nested in the correct order
   * (Auth → Cart → Message), all hooks are accessible and functional.
   */
  it('should allow all context hooks to be accessible when providers are properly nested', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('customer' as const, 'artisan' as const),
        (role) => {
          // Create the properly nested provider structure
          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>
                  {children}
                </MessageProvider>
              </CartProvider>
            </AuthProvider>
          );

          // Test that all hooks are accessible
          const { result: authResult } = renderHook(() => useAuth(), {
            wrapper: AllProviders,
          });

          const { result: cartResult } = renderHook(() => useCart(), {
            wrapper: AllProviders,
          });

          const { result: messageResult } = renderHook(() => useMessages(), {
            wrapper: AllProviders,
          });

          // Verify all hooks return valid context objects
          expect(authResult.current).toBeDefined();
          expect(authResult.current.login).toBeInstanceOf(Function);
          expect(authResult.current.logout).toBeInstanceOf(Function);

          expect(cartResult.current).toBeDefined();
          expect(cartResult.current.addToCart).toBeInstanceOf(Function);
          expect(cartResult.current.removeFromCart).toBeInstanceOf(Function);

          expect(messageResult.current).toBeDefined();
          expect(messageResult.current.sendMessage).toBeInstanceOf(Function);
          expect(messageResult.current.markAsRead).toBeInstanceOf(Function);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Context providers should maintain correct nesting order
   * 
   * This test verifies that the nesting order Auth → Cart → Message
   * allows each provider to function independently without interference.
   */
  it('should maintain independent state across all providers in correct nesting order', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('customer' as const, 'artisan' as const),
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          price: fc.integer({ min: 1, max: 100000 }),
          image: fc.webUrl(),
        }),
        fc.record({
          artisanId: fc.string({ minLength: 1, maxLength: 20 }),
          artisanName: fc.string({ minLength: 1, maxLength: 50 }),
          artisanImage: fc.webUrl(),
          content: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        (role, cartItem, messageData) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          localStorage.removeItem('artisan-cart');
          localStorage.removeItem('artisan-conversations');
          localStorage.removeItem('artisan-role');
          
          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>
                  {children}
                </MessageProvider>
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

          // Test Auth context
          act(() => {
            result.current.auth.login(role);
          });
          expect(result.current.auth.isAuthenticated).toBe(true);
          expect(result.current.auth.role).toBe(role);

          // Test Cart context
          act(() => {
            result.current.cart.addToCart(cartItem, 1);
          });
          
          // Cart should have exactly 1 unique item
          expect(result.current.cart.items.length).toBe(1);
          // Total quantity should be 1 (since we added quantity 1)
          expect(result.current.cart.totalItems).toBe(1);
          // Verify the item ID matches
          expect(result.current.cart.items[0].id).toBe(cartItem.id);

          // Test Message context (synchronous check only)
          expect(result.current.messages.conversations.length).toBe(0);
          expect(result.current.messages.unreadCount).toBe(0);

          // Verify all contexts maintain independent state
          expect(result.current.auth.role).toBe(role);
          expect(result.current.cart.items[0].id).toBe(cartItem.id);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All context hooks should throw errors when used outside providers
   * 
   * This test verifies that hooks properly validate they are used within
   * their respective providers.
   */
  it('should throw errors when hooks are used outside their providers', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Test useAuth without provider
        expect(() => {
          renderHook(() => useAuth());
        }).toThrow('useAuth must be used within an AuthProvider');

        // Test useCart without provider
        expect(() => {
          renderHook(() => useCart());
        }).toThrow('useCart must be used within a CartProvider');

        // Test useMessages without provider
        expect(() => {
          renderHook(() => useMessages());
        }).toThrow('useMessages must be used within a MessageProvider');

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Context providers should initialize with correct default state
   * 
   * This test verifies that each provider initializes with the expected
   * default state when no localStorage data exists.
   */
  it('should initialize all providers with correct default state', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const AllProviders = ({ children }: { children: React.ReactNode }) => (
          <AuthProvider>
            <CartProvider>
              <MessageProvider>
                {children}
              </MessageProvider>
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

        // Verify Auth default state
        expect(result.current.auth.role).toBeNull();
        expect(result.current.auth.isAuthenticated).toBe(false);

        // Verify Cart default state
        expect(result.current.cart.items).toEqual([]);
        expect(result.current.cart.totalItems).toBe(0);
        expect(result.current.cart.totalPrice).toBe(0);

        // Verify Message default state
        expect(result.current.messages.conversations).toEqual([]);
        expect(result.current.messages.unreadCount).toBe(0);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Context providers should work correctly regardless of nesting depth
   * 
   * This test verifies that adding additional wrapper components doesn't
   * break context provider functionality.
   */
  it('should work correctly with additional wrapper components', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('customer' as const, 'artisan' as const),
        (role) => {
          // Add extra wrapper components to test nesting depth
          const ExtraWrapper1 = ({ children }: { children: React.ReactNode }) => (
            <div data-testid="wrapper1">{children}</div>
          );

          const ExtraWrapper2 = ({ children }: { children: React.ReactNode }) => (
            <div data-testid="wrapper2">{children}</div>
          );

          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <ExtraWrapper1>
                <CartProvider>
                  <ExtraWrapper2>
                    <MessageProvider>
                      {children}
                    </MessageProvider>
                  </ExtraWrapper2>
                </CartProvider>
              </ExtraWrapper1>
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

          // Verify all contexts are still accessible
          expect(result.current.auth).toBeDefined();
          expect(result.current.cart).toBeDefined();
          expect(result.current.messages).toBeDefined();

          // Test functionality still works
          act(() => {
            result.current.auth.login(role);
          });
          expect(result.current.auth.isAuthenticated).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Context providers should handle rapid state changes correctly
   * 
   * This test verifies that multiple rapid state changes across different
   * contexts don't cause race conditions or state corruption.
   */
  it('should handle rapid state changes across multiple contexts', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 1, max: 10000 }),
            image: fc.webUrl(),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (cartItems) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();
          localStorage.removeItem('artisan-cart');
          localStorage.removeItem('artisan-conversations');
          localStorage.removeItem('artisan-role');
          
          const AllProviders = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>
              <CartProvider>
                <MessageProvider>
                  {children}
                </MessageProvider>
              </CartProvider>
            </AuthProvider>
          );

          const { result } = renderHook(
            () => ({
              auth: useAuth(),
              cart: useCart(),
            }),
            { wrapper: AllProviders }
          );

          // Perform rapid state changes
          act(() => {
            result.current.auth.login('customer');
            cartItems.forEach((item) => {
              result.current.cart.addToCart(item, 1);
            });
            result.current.auth.logout();
            result.current.auth.login('artisan');
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

          // Verify final state is consistent
          expect(result.current.auth.role).toBe('artisan');
          expect(result.current.cart.items.length).toBe(expectedItemCount);
          expect(result.current.cart.totalItems).toBe(expectedTotalQuantity);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
