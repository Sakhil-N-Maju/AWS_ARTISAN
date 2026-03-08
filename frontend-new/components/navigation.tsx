'use client';

import Link from 'next/link';
import { Menu, X, Search, Heart, ShoppingCart, User, MessageCircle, Box } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useMessages } from '@/lib/message-context';
import { useAuth } from '@/lib/auth-context';

interface NavigationProps {
  scrolled: boolean;
}

export function Navigation({ scrolled }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { unreadCount } = useMessages();
  const { role, isAuthenticated, logout } = useAuth();

  const isArtisan = role === 'artisan';

  const desktopLinks = isArtisan
    ? [
        { href: '/artisans', label: 'Artisans' },
        { href: '/artisans/products', label: 'My Products' },
        { href: '/features', label: 'Features' },
        { href: '/admin', label: 'Admin' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/profile', label: 'Profile' },
      ]
    : [
        { href: '/shop', label: 'Shop' },
        { href: '/artisans', label: 'Artisans' },
        { href: '/features', label: 'Features' },
        { href: '/admin', label: 'Admin' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/about', label: 'About' },
      ];

  const mobileLinks = isArtisan
    ? [
        { href: '/artisans', label: 'Artisans' },
        { href: '/artisans/products', label: 'My Products' },
        { href: '/messages', label: unreadCount > 0 ? `Messages (${unreadCount})` : 'Messages' },
        { href: '/features', label: 'Features' },
        { href: '/admin', label: 'Admin' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/profile', label: 'Profile' },
      ]
    : [
        { href: '/shop', label: 'Shop' },
        { href: '/artisans', label: 'Artisans' },
        { href: '/story-hub', label: 'Stories' },
        { href: '/workshops', label: 'Workshops' },
        { href: '/market', label: 'Market' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/roadmap', label: 'Roadmap' },
        { href: '/about', label: 'About' },
        { href: '/favorites', label: 'Favorites' },
        { href: '/messages', label: unreadCount > 0 ? `Messages (${unreadCount})` : 'Messages' },
        { href: '/cart', label: 'Cart' },
        { href: '/profile', label: 'Profile' },
      ];

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-40 bg-[#FFFBF4] transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <span className="font-serif text-lg font-bold text-white">꿀</span>
            </div>
            <Link
              href="/"
              className="text-warm-charcoal hidden font-serif text-2xl font-bold sm:block"
            >
              Artisans of India
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-warm-charcoal hover:text-primary text-sm font-medium transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {!isArtisan && (
              <button className="hover:bg-warm-sand hidden rounded-lg p-2 transition sm:block">
                <Search className="text-warm-charcoal h-5 w-5" />
              </button>
            )}
            {!isArtisan && (
              <Link
                href="/favorites"
                className="hover:bg-warm-sand hidden rounded-lg p-2 transition sm:flex"
              >
                <Heart className="text-warm-charcoal h-5 w-5" />
              </Link>
            )}
            <Link
              href="/messages"
              className="hover:bg-warm-sand relative hidden rounded-lg p-2 transition sm:block"
            >
              <MessageCircle className="text-warm-charcoal h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            {!isArtisan && (
              <Link
                href="/cart"
                className="hover:bg-warm-sand relative hidden rounded-lg p-2 transition sm:block"
              >
                <ShoppingCart className="text-warm-charcoal h-5 w-5" />
                {totalItems > 0 && (
                  <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
            )}
            <Link
              href="/profile"
              className="hover:bg-warm-sand hidden rounded-lg p-2 transition sm:block"
            >
              <User className="text-warm-charcoal h-5 w-5" />
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-warm-sand hover:bg-warm-sand/70 hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition sm:flex"
              >
                <Box className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-primary hover:bg-warm-rust hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition sm:flex"
              >
                <Box className="h-4 w-4" />
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hover:bg-warm-sand rounded-lg p-2 transition md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-border space-y-2 border-t pb-4 md:hidden">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:bg-warm-sand block rounded px-4 py-2 text-sm transition"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-warm-charcoal hover:bg-warm-sand w-full rounded px-4 py-2 text-left text-sm font-semibold transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-primary hover:bg-warm-sand block rounded px-4 py-2 text-sm font-semibold transition"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
