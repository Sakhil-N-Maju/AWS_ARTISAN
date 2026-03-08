/**
 * Unit Test: Context Provider Initialization
 * Feature: frontend-migration
 * Task: 16.2 Test context provider initialization
 * 
 * **Validates: Requirements 22.3**
 * 
 * This test verifies that all context providers initialize correctly:
 * 1. AuthContext initialization with localStorage persistence
 * 2. CartContext initialization with localStorage persistence
 * 3. MessageContext initialization with localStorage persistence
 * 4. Proper restoration of state from localStorage on initialization
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../auth-context';
import { CartProvider, useCart } from '../cart-context';
import { MessageProvider, useMessages } from '../message-context';

describe('Context Provider Initialization', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('AuthContext Initialization', () => {
    it('should initialize with null role when localStorage is empty', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.role).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should restore role from localStorage on initialization', () => {
      // Pre-populate localStorage
      localStorage.setItem('artisans-active-role', 'customer');

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.role).toBe('customer');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should persist role to localStorage when login is called', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      act(() => {
        result.current.login('artisan');
      });

      expect(localStorage.getItem('artisans-active-role')).toBe('artisan');
      expect(result.current.role).toBe('artisan');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should remove role from localStorage when logout is called', () => {
      localStorage.setItem('artisans-active-role', 'customer');

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      act(() => {
        result.current.logout();
      });

      expect(localStorage.getItem('artisans-active-role')).toBeNull();
      expect(result.current.role).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle role switching with localStorage persistence', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Login as customer
      act(() => {
        result.current.login('customer');
      });
      expect(localStorage.getItem('artisans-active-role')).toBe('customer');

      // Switch to artisan
      act(() => {
        result.current.login('artisan');
      });
      expect(localStorage.getItem('artisans-active-role')).toBe('artisan');
      expect(result.current.role).toBe('artisan');
    });
  });

  describe('CartContext Initialization', () => {
    it('should initialize with empty cart when localStorage is empty', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });

    it('should restore cart items from localStorage on initialization', () => {
      const savedCart = [
        {
          id: '1',
          name: 'Test Product',
          price: 100,
          quantity: 2,
          image: '/test.jpg',
          artisan: 'Test Artisan',
        },
      ];
      localStorage.setItem('artisan-cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.items).toEqual(savedCart);
      expect(result.current.totalItems).toBe(2);
      expect(result.current.totalPrice).toBe(200);
    });

    it('should persist cart to localStorage when items are added', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const newItem = {
        id: '1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        artisan: 'Test Artisan',
      };

      act(() => {
        result.current.addToCart(newItem, 1);
      });

      // Wait for useEffect to run
      await waitFor(() => {
        const savedCart = localStorage.getItem('artisan-cart');
        expect(savedCart).not.toBeNull();
        const parsed = JSON.parse(savedCart!);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].id).toBe('1');
      });
    });

    it('should update localStorage when cart items are modified', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const item = {
        id: '1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
      };

      act(() => {
        result.current.addToCart(item, 1);
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1);
      });

      act(() => {
        result.current.updateQuantity('1', 5);
      });

      await waitFor(() => {
        const savedCart = localStorage.getItem('artisan-cart');
        const parsed = JSON.parse(savedCart!);
        expect(parsed[0].quantity).toBe(5);
      });
    });

    it('should clear localStorage when cart is cleared', async () => {
      const savedCart = [
        {
          id: '1',
          name: 'Test Product',
          price: 100,
          quantity: 2,
          image: '/test.jpg',
        },
      ];
      localStorage.setItem('artisan-cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.clearCart();
      });

      await waitFor(() => {
        const savedCart = localStorage.getItem('artisan-cart');
        const parsed = JSON.parse(savedCart!);
        expect(parsed).toEqual([]);
      });
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('artisan-cart', 'invalid json');

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      // Should fall back to empty cart
      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
    });
  });

  describe('MessageContext Initialization', () => {
    it('should initialize with empty conversations when localStorage is empty', () => {
      const { result } = renderHook(() => useMessages(), {
        wrapper: MessageProvider,
      });

      expect(result.current.conversations).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
    });

    it('should restore conversations from localStorage on initialization', () => {
      const savedConversations = [
        {
          artisanId: '1',
          artisanName: 'Test Artisan',
          artisanImage: '/test.jpg',
          lastMessage: 'Hello',
          lastMessageTime: new Date('2024-01-01').toISOString(),
          unreadCount: 1,
          messages: [
            {
              id: '1',
              artisanId: '1',
              artisanName: 'Test Artisan',
              artisanImage: '/test.jpg',
              content: 'Hello',
              timestamp: new Date('2024-01-01').toISOString(),
              sender: 'artisan',
              read: false,
            },
          ],
        },
      ];
      localStorage.setItem('artisan-conversations', JSON.stringify(savedConversations));

      const { result } = renderHook(() => useMessages(), {
        wrapper: MessageProvider,
      });

      expect(result.current.conversations).toHaveLength(1);
      expect(result.current.conversations[0].artisanId).toBe('1');
      expect(result.current.unreadCount).toBe(1);
      // Verify dates are properly restored as Date objects
      expect(result.current.conversations[0].lastMessageTime).toBeInstanceOf(Date);
      expect(result.current.conversations[0].messages[0].timestamp).toBeInstanceOf(Date);
    });

    it('should persist conversations to localStorage when messages are sent', async () => {
      const { result } = renderHook(() => useMessages(), {
        wrapper: MessageProvider,
      });

      await act(async () => {
        await result.current.sendMessage(
          '1',
          'Test Artisan',
          '/test.jpg',
          'Hello from user'
        );
      });

      await waitFor(() => {
        const saved = localStorage.getItem('artisan-conversations');
        expect(saved).not.toBeNull();
        const parsed = JSON.parse(saved!);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].artisanId).toBe('1');
        expect(parsed[0].lastMessage).toBe('Hello from user');
      });
    });

    it('should update localStorage when messages are marked as read', async () => {
      const savedConversations = [
        {
          artisanId: '1',
          artisanName: 'Test Artisan',
          artisanImage: '/test.jpg',
          lastMessage: 'Hello',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 2,
          messages: [
            {
              id: '1',
              artisanId: '1',
              artisanName: 'Test Artisan',
              artisanImage: '/test.jpg',
              content: 'Hello',
              timestamp: new Date().toISOString(),
              sender: 'artisan',
              read: false,
            },
          ],
        },
      ];
      localStorage.setItem('artisan-conversations', JSON.stringify(savedConversations));

      const { result } = renderHook(() => useMessages(), {
        wrapper: MessageProvider,
      });

      act(() => {
        result.current.markAsRead('1');
      });

      await waitFor(() => {
        const saved = localStorage.getItem('artisan-conversations');
        const parsed = JSON.parse(saved!);
        expect(parsed[0].unreadCount).toBe(0);
        expect(parsed[0].messages[0].read).toBe(true);
      });
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('artisan-conversations', 'invalid json');

      const { result } = renderHook(() => useMessages(), {
        wrapper: MessageProvider,
      });

      // Should fall back to empty conversations
      expect(result.current.conversations).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
    });

    it('should calculate unread count correctly from restored conversations', () => {
      const savedConversations = [
        {
          artisanId: '1',
          artisanName: 'Artisan 1',
          artisanImage: '/test1.jpg',
          lastMessage: 'Hello',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 2,
          messages: [],
        },
        {
          artisanId: '2',
          artisanName: 'Artisan 2',
          artisanImage: '/test2.jpg',
          lastMessage: 'Hi',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 3,
          messages: [],
        },
      ];
      localStorage.setItem('artisan-conversations', JSON.stringify(savedConversations));

      const { result } = renderHook(() => useMessages(), {
        wrapper: MessageProvider,
      });

      expect(result.current.unreadCount).toBe(5); // 2 + 3
    });
  });

  describe('Combined Context Initialization', () => {
    it('should initialize all contexts correctly when nested', () => {
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

      // All contexts should initialize with default state
      expect(result.current.auth.role).toBeNull();
      expect(result.current.cart.items).toEqual([]);
      expect(result.current.messages.conversations).toEqual([]);
    });

    it('should restore all contexts from localStorage when nested', () => {
      // Pre-populate localStorage for all contexts
      localStorage.setItem('artisans-active-role', 'customer');
      localStorage.setItem(
        'artisan-cart',
        JSON.stringify([
          {
            id: '1',
            name: 'Product',
            price: 100,
            quantity: 1,
            image: '/test.jpg',
          },
        ])
      );
      localStorage.setItem(
        'artisan-conversations',
        JSON.stringify([
          {
            artisanId: '1',
            artisanName: 'Artisan',
            artisanImage: '/test.jpg',
            lastMessage: 'Hello',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 1,
            messages: [],
          },
        ])
      );

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

      // All contexts should restore their state
      expect(result.current.auth.role).toBe('customer');
      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.messages.conversations).toHaveLength(1);
    });

    it('should maintain independent localStorage keys for each context', async () => {
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

      // Modify each context
      act(() => {
        result.current.auth.login('artisan');
      });

      act(() => {
        result.current.cart.addToCart(
          {
            id: '1',
            name: 'Product',
            price: 100,
            image: '/test.jpg',
          },
          1
        );
      });

      await act(async () => {
        await result.current.messages.sendMessage(
          '1',
          'Artisan',
          '/test.jpg',
          'Hello'
        );
      });

      // Verify each context has its own localStorage key
      await waitFor(() => {
        expect(localStorage.getItem('artisans-active-role')).toBe('artisan');
        expect(localStorage.getItem('artisan-cart')).not.toBeNull();
        expect(localStorage.getItem('artisan-conversations')).not.toBeNull();
      });

      // Verify keys are independent
      const authKey = localStorage.getItem('artisans-active-role');
      const cartKey = localStorage.getItem('artisan-cart');
      const messagesKey = localStorage.getItem('artisan-conversations');

      expect(authKey).not.toBe(cartKey);
      expect(authKey).not.toBe(messagesKey);
      expect(cartKey).not.toBe(messagesKey);
    });
  });
});
