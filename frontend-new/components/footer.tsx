'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-warm-charcoal text-warm-sand">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold">Artisans of India</h3>
            <p className="text-warm-sand/70 text-sm">
              Connecting artisans with conscious consumers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Shop</h4>
            <ul className="text-warm-sand/70 space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-primary transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-primary transition">
                  Artisans
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="hover:text-primary transition">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-primary transition">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="text-warm-sand/70 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-primary transition">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-primary transition">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary transition">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="text-warm-sand/70 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:hello@artisansofindia.com"
                  className="hover:text-primary transition"
                >
                  hello@artisansofindia.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+918001234567" className="hover:text-primary transition">
                  +91 800-123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-warm-sand/20 text-warm-sand/70 flex flex-col items-center justify-between border-t pt-8 text-sm sm:flex-row">
          <p>&copy; 2025 Artisans of India. All rights reserved.</p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            <Link href="/about" className="hover:text-primary transition">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-primary transition">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-primary transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
