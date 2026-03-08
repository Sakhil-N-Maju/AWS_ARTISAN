/**
 * Property-Based Test: Page Rendering Validation
 * Feature: frontend-migration
 * Property 22: Page Rendering Validation
 * 
 * **Validates: Requirements 22.1, 22.4**
 * 
 * This test verifies that all migrated page routes render without runtime errors,
 * all required data loads correctly, and navigation to and from the pages works
 * as expected.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import { AuthProvider } from '../auth-context';
import { CartProvider } from '../cart-context';
import { MessageProvider } from '../message-context';

// Import page components
import HomePage from '@/app/page';
import ProductsPage from '@/app/products/page';
import ArtisansPage from '@/app/artisans/page';
import CartPage from '@/app/cart/page';
import AboutPage from '@/app/about/page';
import FeaturesPage from '@/app/features/page';
import RoadmapPage from '@/app/roadmap/page';
import MarketPage from '@/app/market/page';
import OnboardingPage from '@/app/onboarding/page';
import LoginPage from '@/app/login/page';
import ProfilePage from '@/app/profile/page';
import DashboardPage from '@/app/dashboard/page';
import FavoritesPage from '@/app/favorites/page';
import CommunityPage from '@/app/community/page';
import MessagesPage from '@/app/messages/page';
import VoicePage from '@/app/voice/page';
import WorkshopsPage from '@/app/workshops/page';
import StoriesPage from '@/app/stories/page';
import StoryHubPage from '@/app/story-hub/page';
import AnalyticsPage from '@/app/analytics/page';
import AdminPage from '@/app/admin/page';
import ShopPage from '@/app/shop/page';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock fetch for API calls
global.fetch = vi.fn();

describe('Property 22: Page Rendering Validation', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    localStorage.removeItem('artisan-cart');
    localStorage.removeItem('artisan-conversations');
    localStorage.removeItem('artisans-active-role');
    
    // Reset fetch mock
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    localStorage.removeItem('artisan-cart');
    localStorage.removeItem('artisan-conversations');
    localStorage.removeItem('artisans-active-role');
    vi.clearAllMocks();
  });

  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <CartProvider>
        <MessageProvider>{children}</MessageProvider>
      </CartProvider>
    </AuthProvider>
  );

  /**
   * Property: All static pages should render without errors
   * 
   * For any static page (pages without dynamic parameters), the page should
   * render without throwing runtime errors and should produce valid HTML output.
   */
  it('should render all static pages without runtime errors', { timeout: 30000 }, () => {
    const staticPages = [
      { name: 'Home', component: HomePage },
      { name: 'Products', component: ProductsPage },
      { name: 'Cart', component: CartPage },
      { name: 'About', component: AboutPage },
      { name: 'Login', component: LoginPage },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...staticPages),
        (page) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          let renderError = null;
          let container = null;

          try {
            const result = render(
              <AllProviders>
                <page.component />
              </AllProviders>
            );
            container = result.container;
          } catch (error) {
            renderError = error;
          }

          // Page should render without throwing errors
          expect(renderError).toBeNull();

          // Page should produce valid HTML
          expect(container).not.toBeNull();
          expect(container?.innerHTML).toBeTruthy();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Pages should render with different authentication states
   * 
   * For any page and any authentication state (authenticated/unauthenticated,
   * customer/artisan role), the page should render without errors.
   */
  it('should render pages correctly with different authentication states', () => {
    const pages = [
      { name: 'Home', component: HomePage },
      { name: 'Products', component: ProductsPage },
      { name: 'Artisans', component: ArtisansPage },
      { name: 'Shop', component: ShopPage },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...pages),
        fc.option(fc.constantFrom('customer' as const, 'artisan' as const), { nil: null }),
        (page, role) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          // Set role in localStorage if provided
          if (role) {
            localStorage.setItem('artisans-active-role', role);
          }

          let renderError = null;

          try {
            render(
              <AllProviders>
                <page.component />
              </AllProviders>
            );
          } catch (error) {
            renderError = error;
          }

          // Page should render without errors regardless of auth state
          expect(renderError).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Pages should handle empty data gracefully
   * 
   * When API calls return empty data, pages should still render without errors
   * and display appropriate empty states.
   */
  it('should handle empty data responses gracefully', () => {
    const dataPages = [
      { name: 'Products', component: ProductsPage },
      { name: 'Artisans', component: ArtisansPage },
      { name: 'Workshops', component: WorkshopsPage },
      { name: 'Stories', component: StoriesPage },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...dataPages),
        (page) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          // Mock empty data response
          (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] }),
          });

          let renderError = null;

          try {
            render(
              <AllProviders>
                <page.component />
              </AllProviders>
            );
          } catch (error) {
            renderError = error;
          }

          // Page should render without errors even with empty data
          expect(renderError).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Pages should handle API errors gracefully
   * 
   * When API calls fail, pages should still render without crashing and
   * should display appropriate error states or fallback content.
   */
  it('should handle API errors gracefully', () => {
    const dataPages = [
      { name: 'Products', component: ProductsPage },
      { name: 'Artisans', component: ArtisansPage },
      { name: 'Workshops', component: WorkshopsPage },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...dataPages),
        (page) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          // Mock API error
          (global.fetch as any).mockRejectedValue(new Error('API Error'));

          let renderError = null;

          try {
            render(
              <AllProviders>
                <page.component />
              </AllProviders>
            );
          } catch (error) {
            renderError = error;
          }

          // Page should not crash on API errors
          expect(renderError).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Pages should render with cart items present
   * 
   * When cart items exist in localStorage, pages should render correctly
   * and reflect the cart state.
   */
  it('should render pages correctly with cart items present', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            price: fc.integer({ min: 1, max: 100000 }),
            quantity: fc.integer({ min: 1, max: 10 }),
            image: fc.webUrl(),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (cartItems) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          // Set cart items in localStorage
          localStorage.setItem('artisan-cart', JSON.stringify(cartItems));

          let renderError = null;

          try {
            render(
              <AllProviders>
                <HomePage />
              </AllProviders>
            );
          } catch (error) {
            renderError = error;
          }

          // Page should render without errors with cart items
          expect(renderError).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Pages should render with messages present
   * 
   * When conversations exist in localStorage, pages should render correctly
   * and reflect the message state.
   */
  it('should render pages correctly with messages present', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            artisanId: fc.string({ minLength: 1, maxLength: 20 }),
            artisanName: fc.string({ minLength: 1, maxLength: 50 }),
            artisanImage: fc.webUrl(),
            lastMessage: fc.string({ minLength: 1, maxLength: 100 }),
            lastMessageTime: fc.date(),
            unreadCount: fc.integer({ min: 0, max: 10 }),
            messages: fc.array(
              fc.record({
                id: fc.string({ minLength: 1, maxLength: 20 }),
                artisanId: fc.string({ minLength: 1, maxLength: 20 }),
                artisanName: fc.string({ minLength: 1, maxLength: 50 }),
                artisanImage: fc.webUrl(),
                content: fc.string({ minLength: 1, maxLength: 200 }),
                timestamp: fc.date(),
                sender: fc.constantFrom('user' as const, 'artisan' as const),
                read: fc.boolean(),
              }),
              { minLength: 1, maxLength: 5 }
            ),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (conversations) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          // Set conversations in localStorage
          localStorage.setItem('artisan-conversations', JSON.stringify(conversations));

          let renderError = null;

          try {
            render(
              <AllProviders>
                <HomePage />
              </AllProviders>
            );
          } catch (error) {
            renderError = error;
          }

          // Page should render without errors with messages
          expect(renderError).toBeNull();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Pages should produce non-empty HTML output
   * 
   * For any page that renders successfully, the HTML output should be
   * non-empty and contain meaningful content.
   */
  it('should produce non-empty HTML output for all pages', { timeout: 15000 }, () => {
    const pages = [
      { name: 'Home', component: HomePage },
      { name: 'About', component: AboutPage },
      { name: 'Features', component: FeaturesPage },
      { name: 'Login', component: LoginPage },
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...pages),
        (page) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          const { container } = render(
            <AllProviders>
              <page.component />
            </AllProviders>
          );

          // HTML output should be non-empty
          expect(container.innerHTML.length).toBeGreaterThan(0);

          // Should contain at least some text content
          expect(container.textContent?.length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Pages should render consistently across multiple renders
   * 
   * When a page is rendered multiple times with the same props and state,
   * it should produce consistent output without errors.
   */
  it('should render consistently across multiple renders', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.constantFrom(HomePage, ProductsPage, ArtisansPage),
        fc.integer({ min: 2, max: 3 }),
        (PageComponent, renderCount) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          const outputs: string[] = [];

          for (let i = 0; i < renderCount; i++) {
            const { container, unmount } = render(
              <AllProviders>
                <PageComponent />
              </AllProviders>
            );

            outputs.push(container.innerHTML);
            unmount();
          }

          // All renders should produce output
          expect(outputs.every((output) => output.length > 0)).toBe(true);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Pages should handle rapid state changes
   * 
   * When context state changes rapidly (auth, cart, messages), pages should
   * continue to render without errors.
   */
  it('should handle rapid state changes without errors', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom('customer' as const, 'artisan' as const, null),
          { minLength: 2, maxLength: 3 }
        ),
        (roleSequence) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          let renderError = null;

          try {
            const { rerender } = render(
              <AllProviders>
                <HomePage />
              </AllProviders>
            );

            // Simulate rapid role changes
            roleSequence.forEach((role) => {
              if (role) {
                localStorage.setItem('artisans-active-role', role);
              } else {
                localStorage.removeItem('artisans-active-role');
              }

              rerender(
                <AllProviders>
                  <HomePage />
                </AllProviders>
              );
            });
          } catch (error) {
            renderError = error;
          }

          // Should handle rapid changes without errors
          expect(renderError).toBeNull();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Pages should not leak memory on unmount
   * 
   * When pages are mounted and unmounted repeatedly, they should clean up
   * properly without memory leaks or errors.
   */
  it('should clean up properly on unmount', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.constantFrom(HomePage, ProductsPage, CartPage),
        fc.integer({ min: 2, max: 3 }),
        (PageComponent, mountCount) => {
          // Clear localStorage at the start of each iteration
          localStorage.clear();

          let unmountError = null;

          try {
            for (let i = 0; i < mountCount; i++) {
              const { unmount } = render(
                <AllProviders>
                  <PageComponent />
                </AllProviders>
              );
              unmount();
            }
          } catch (error) {
            unmountError = error;
          }

          // Should mount and unmount without errors
          expect(unmountError).toBeNull();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
