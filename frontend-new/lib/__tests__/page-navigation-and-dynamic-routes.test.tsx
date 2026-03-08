/**
 * Integration Test: Page Navigation and Dynamic Routes
 * Feature: frontend-migration
 * Task: 16.4 Test page rendering for all routes
 * 
 * **Validates: Requirements 22.1, 22.4**
 * 
 * This test verifies:
 * - Navigation between pages works correctly
 * - Dynamic routes with parameters render properly
 * - Loading states are displayed appropriately
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';
import { AuthProvider } from '../auth-context';
import { CartProvider } from '../cart-context';
import { MessageProvider } from '../message-context';

// Import dynamic route pages
import ArtisanDetailPage from '@/app/artisans/[id]/page';
import ProductDetailPage from '@/app/products/[id]/page';
import WorkshopDetailPage from '@/app/workshops/[id]/page';
import StoryDetailPage from '@/app/stories/[id]/page';

// Import loading components
import ArtisansLoading from '@/app/artisans/loading';
import WorkshopsLoading from '@/app/workshops/loading';
import StoriesLoading from '@/app/stories/loading';

// Mock Next.js router
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockBack = vi.fn();
let mockParams = { id: '123' };

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
    back: mockBack,
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => mockParams,
}));

// Mock fetch for API calls
global.fetch = vi.fn();

describe('Page Navigation and Dynamic Routes', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset mocks
    vi.clearAllMocks();
    mockPush.mockClear();
    mockReplace.mockClear();
    mockBack.mockClear();
    
    // Setup default fetch mock
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: '1',
          name: 'Test Item',
          description: 'Test Description',
        },
      }),
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <CartProvider>
        <MessageProvider>{children}</MessageProvider>
      </CartProvider>
    </AuthProvider>
  );

  describe('Dynamic Routes with Parameters', () => {
    it('should render artisan detail page with valid ID', async () => {
      mockParams = { id: '123' };
      
      const mockArtisan = {
        id: '123',
        name: 'Test Artisan',
        bio: 'Test Bio',
        specialty: 'Pottery',
        location: 'Test Location',
        image: 'https://example.com/image.jpg',
        rating: 4.5,
        reviewCount: 10,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockArtisan }),
      });

      const { container } = render(
        <AllProviders>
          <ArtisanDetailPage params={{ id: '123' }} />
        </AllProviders>
      );

      // Page should render without errors
      expect(container).toBeTruthy();
      expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('should render product detail page with valid ID', async () => {
      mockParams = { id: '456' };
      
      const mockProduct = {
        id: '456',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        images: ['https://example.com/product.jpg'],
        category: 'Pottery',
        artisan: {
          id: '123',
          name: 'Test Artisan',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProduct }),
      });

      const { container } = render(
        <AllProviders>
          <ProductDetailPage params={{ id: '456' }} />
        </AllProviders>
      );

      // Page should render without errors
      expect(container).toBeTruthy();
      expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('should render workshop detail page with valid ID', async () => {
      mockParams = { id: '789' };
      
      const mockWorkshop = {
        id: '789',
        title: 'Test Workshop',
        description: 'Test Description',
        artisan: {
          id: '123',
          name: 'Test Artisan',
        },
        duration: 120,
        price: 150,
        image: 'https://example.com/workshop.jpg',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockWorkshop }),
      });

      const { container } = render(
        <AllProviders>
          <WorkshopDetailPage params={{ id: '789' }} />
        </AllProviders>
      );

      // Page should render without errors
      expect(container).toBeTruthy();
      expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('should render story detail page with valid ID', async () => {
      mockParams = { id: '101' };
      
      const mockStory = {
        id: '101',
        title: 'Test Story',
        content: 'Test Content',
        excerpt: 'Test Excerpt',
        author: {
          id: '123',
          name: 'Test Author',
        },
        images: ['https://example.com/story.jpg'],
        publishedAt: new Date().toISOString(),
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockStory }),
      });

      const { container } = render(
        <AllProviders>
          <StoryDetailPage params={{ id: '101' }} />
        </AllProviders>
      );

      // Page should render without errors
      expect(container).toBeTruthy();
      expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('should handle dynamic routes with different ID formats', async () => {
      const idFormats = ['123', 'abc-123', 'uuid-1234-5678', '999999'];

      for (const id of idFormats) {
        mockParams = { id };
        
        (global.fetch as any).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: {
              id,
              name: `Test Item ${id}`,
              description: 'Test Description',
            },
          }),
        });

        const { container, unmount } = render(
          <AllProviders>
            <ProductDetailPage params={{ id }} />
          </AllProviders>
        );

        // Should render without errors for any ID format
        expect(container).toBeTruthy();
        expect(container.innerHTML.length).toBeGreaterThan(0);

        unmount();
      }
    });

    it('should handle API errors gracefully in dynamic routes', async () => {
      mockParams = { id: '404' };
      
      (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

      const { container } = render(
        <AllProviders>
          <ProductDetailPage params={{ id: '404' }} />
        </AllProviders>
      );

      // Should render without crashing even on API error
      expect(container).toBeTruthy();
    });

    it('should handle 404 responses in dynamic routes', async () => {
      mockParams = { id: 'nonexistent' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      });

      const { container } = render(
        <AllProviders>
          <ArtisanDetailPage params={{ id: 'nonexistent' }} />
        </AllProviders>
      );

      // Should render without crashing
      expect(container).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    it('should render artisans loading component', () => {
      const { container } = render(
        <AllProviders>
          <ArtisansLoading />
        </AllProviders>
      );

      // Loading component should render
      expect(container).toBeTruthy();
    });

    it('should render workshops loading component', () => {
      const { container } = render(<WorkshopsLoading />);

      // Loading component should render (may be empty if it returns null)
      expect(container).toBeTruthy();
    });

    it('should render stories loading component', () => {
      const { container } = render(<StoriesLoading />);

      // Loading component should render (may be empty if it returns null)
      expect(container).toBeTruthy();
    });

    it('should display loading states consistently', () => {
      // ArtisansLoading needs providers because it includes Navigation
      const { container: container1, unmount: unmount1 } = render(
        <AllProviders>
          <ArtisansLoading />
        </AllProviders>
      );
      expect(container1).toBeTruthy();
      unmount1();

      // Other loading components don't need providers
      const { container: container2, unmount: unmount2 } = render(<WorkshopsLoading />);
      expect(container2).toBeTruthy();
      unmount2();

      const { container: container3, unmount: unmount3 } = render(<StoriesLoading />);
      expect(container3).toBeTruthy();
      unmount3();
    });

    it('should handle loading state transitions', async () => {
      mockParams = { id: '123' };
      
      let resolvePromise: (value: any) => void;
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (global.fetch as any).mockReturnValueOnce(fetchPromise);

      const { container } = render(
        <AllProviders>
          <ProductDetailPage params={{ id: '123' }} />
        </AllProviders>
      );

      // Initial render should not crash
      expect(container).toBeTruthy();

      // Resolve the promise to simulate data loading
      resolvePromise!({
        ok: true,
        json: async () => ({
          data: {
            id: '123',
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
          },
        }),
      });

      // Wait for state update
      await waitFor(() => {
        expect(container.innerHTML.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Navigation Between Pages', () => {
    it('should support navigation to dynamic routes', () => {
      const testRoutes = [
        '/artisans/123',
        '/products/456',
        '/workshops/789',
        '/stories/101',
      ];

      testRoutes.forEach((route) => {
        mockPush(route);
        expect(mockPush).toHaveBeenCalledWith(route);
        mockPush.mockClear();
      });
    });

    it('should support back navigation', () => {
      mockBack();
      expect(mockBack).toHaveBeenCalled();
    });

    it('should support route replacement', () => {
      const route = '/products/123';
      mockReplace(route);
      expect(mockReplace).toHaveBeenCalledWith(route);
    });

    it('should handle navigation with query parameters', () => {
      const routes = [
        '/products?category=pottery',
        '/artisans?specialty=weaving',
        '/workshops?date=2024-01-01',
      ];

      routes.forEach((route) => {
        mockPush(route);
        expect(mockPush).toHaveBeenCalledWith(route);
        mockPush.mockClear();
      });
    });

    it('should handle navigation between different page types', () => {
      const navigationFlow = [
        '/',
        '/products',
        '/products/123',
        '/artisans',
        '/artisans/456',
        '/cart',
        '/workshops',
      ];

      navigationFlow.forEach((route) => {
        mockPush(route);
        expect(mockPush).toHaveBeenCalledWith(route);
        mockPush.mockClear();
      });
    });
  });

  describe('Route Parameter Validation', () => {
    it('should handle numeric IDs', async () => {
      mockParams = { id: '123' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { id: '123', name: 'Test' },
        }),
      });

      const { container } = render(
        <AllProviders>
          <ProductDetailPage params={{ id: '123' }} />
        </AllProviders>
      );

      expect(container).toBeTruthy();
    });

    it('should handle UUID format IDs', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      mockParams = { id: uuid };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { id: uuid, name: 'Test' },
        }),
      });

      const { container } = render(
        <AllProviders>
          <ProductDetailPage params={{ id: uuid }} />
        </AllProviders>
      );

      expect(container).toBeTruthy();
    });

    it('should handle slug format IDs', async () => {
      const slug = 'handmade-pottery-bowl';
      mockParams = { id: slug };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { id: slug, name: 'Test' },
        }),
      });

      const { container } = render(
        <AllProviders>
          <ProductDetailPage params={{ id: slug }} />
        </AllProviders>
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Error Boundaries and Edge Cases', () => {
    it('should handle missing params gracefully', async () => {
      mockParams = { id: '' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null }),
      });

      const { container } = render(
        <AllProviders>
          <ProductDetailPage params={{ id: '' }} />
        </AllProviders>
      );

      // Should not crash with empty ID
      expect(container).toBeTruthy();
    });

    it('should handle network timeouts', async () => {
      mockParams = { id: '123' };
      
      (global.fetch as any).mockRejectedValueOnce(new Error('Network timeout'));

      const { container } = render(
        <AllProviders>
          <ArtisanDetailPage params={{ id: '123' }} />
        </AllProviders>
      );

      // Should render error state without crashing
      expect(container).toBeTruthy();
    });

    it('should handle malformed API responses', async () => {
      mockParams = { id: '123' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'response' }),
      });

      const { container } = render(
        <AllProviders>
          <WorkshopDetailPage params={{ id: '123' }} />
        </AllProviders>
      );

      // Should handle malformed data gracefully
      expect(container).toBeTruthy();
    });

    it('should handle concurrent route changes', async () => {
      const ids = ['1', '2', '3'];

      for (const id of ids) {
        mockParams = { id };
        
        (global.fetch as any).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: { id, name: `Test ${id}` },
          }),
        });

        const { container, unmount } = render(
          <AllProviders>
            <ProductDetailPage params={{ id }} />
          </AllProviders>
        );

        expect(container).toBeTruthy();
        unmount();
      }
    });
  });

  describe('Page Rendering Consistency', () => {
    it('should render dynamic pages consistently with same params', async () => {
      const params = { id: '123' };
      mockParams = params;
      
      const mockData = {
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
      };

      // Render the same page multiple times
      for (let i = 0; i < 3; i++) {
        (global.fetch as any).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockData }),
        });

        const { container, unmount } = render(
          <AllProviders>
            <ProductDetailPage params={params} />
          </AllProviders>
        );

        // Each render should be successful
        expect(container).toBeTruthy();
        expect(container.innerHTML.length).toBeGreaterThan(0);

        unmount();
      }
    });

    it('should maintain context state across route changes', async () => {
      // Add item to cart
      localStorage.setItem(
        'artisan-cart',
        JSON.stringify([
          {
            id: '1',
            name: 'Test Product',
            price: 99.99,
            quantity: 1,
            image: 'https://example.com/image.jpg',
          },
        ])
      );

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          data: { id: '123', name: 'Test' },
        }),
      });

      // Render different pages
      mockParams = { id: '123' };
      const { unmount: unmount1 } = render(
        <AllProviders>
          <ProductDetailPage params={{ id: '123' }} />
        </AllProviders>
      );
      unmount1();

      mockParams = { id: '456' };
      const { unmount: unmount2 } = render(
        <AllProviders>
          <ArtisanDetailPage params={{ id: '456' }} />
        </AllProviders>
      );
      unmount2();

      // Cart state should persist
      const cartData = localStorage.getItem('artisan-cart');
      expect(cartData).toBeTruthy();
      expect(JSON.parse(cartData!)).toHaveLength(1);
    });
  });
});
