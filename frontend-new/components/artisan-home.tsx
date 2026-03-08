'use client';

import Link from 'next/link';
import { BarChart3, PackagePlus, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

const quickLinks = [
  {
    href: '/artisans/products',
    title: 'Manage products',
    description: 'Update pricing, photos, and inventory in one place.',
    icon: PackagePlus,
  },
  {
    href: '/messages',
    title: 'Respond to buyers',
    description: 'Stay close to customers with WhatsApp-style messaging.',
    icon: MessageSquare,
  },
  {
    href: '/analytics',
    title: 'Performance analytics',
    description: 'Track sales velocity, repeat customers, and trends.',
    icon: BarChart3,
  },
];

const enablementHighlights = [
  {
    title: 'Admin control center',
    description: 'Access order management, fulfillment, and system tools built for artisan teams.',
  },
  {
    title: 'Feature launches',
    description: 'Preview upcoming marketplace features and opt-in to new discovery modules.',
  },
  {
    title: 'Trust & security',
    description: 'Advanced verification, provenance tracking, and secure checkout for your brand.',
  },
];

export function ArtisanHome() {
  return (
    <div className="space-y-16 pt-24">
      <section className="border-border from-secondary/20 to-primary/10 relative overflow-hidden rounded-3xl border bg-gradient-to-br via-white px-6 py-16 sm:px-10">
        <div className="max-w-3xl space-y-6">
          <span className="text-secondary inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold tracking-widest uppercase">
            <ShieldCheck className="h-4 w-4" />
            Artisan mode
          </span>
          <h1 className="text-warm-charcoal font-serif text-4xl font-bold sm:text-5xl">
            Grow your handcrafted business with confidence
          </h1>
          <p className="text-warm-charcoal/70 text-sm sm:text-base">
            Launch new collections, monitor demand, and collaborate with the marketplace team.
            Everything here is tuned for professional artisans and collectives.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/artisans/products"
              className="bg-primary hover:bg-warm-rust inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition"
            >
              <PackagePlus className="h-4 w-4" />
              Go to product manager
            </Link>
            <Link
              href="/admin"
              className="border-primary text-primary hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition"
            >
              <Sparkles className="h-4 w-4" />
              Open admin suite
            </Link>
          </div>
        </div>

        <div className="bg-primary/20 pointer-events-none absolute top-12 -right-12 hidden h-72 w-72 rounded-full blur-3xl sm:block" />
        <div className="bg-secondary/20 pointer-events-none absolute right-12 -bottom-10 hidden h-64 w-64 rounded-full blur-3xl sm:block" />
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group border-border hover:border-primary flex h-full flex-col justify-between rounded-2xl border bg-white p-6 transition hover:shadow-lg"
              >
                <div className="space-y-4">
                  <span className="bg-primary/10 text-primary group-hover:bg-primary/20 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="text-warm-charcoal font-serif text-xl font-bold">{link.title}</h2>
                  <p className="text-warm-charcoal/70 text-sm">{link.description}</p>
                </div>
                <span className="text-primary group-hover:text-warm-rust mt-6 text-sm font-semibold">
                  Open →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="border-border rounded-3xl border bg-white p-8">
          <p className="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
            Upcoming drops
          </p>
          <h3 className="text-warm-charcoal mb-2 font-serif text-2xl font-bold">
            Plan your next showcase
          </h3>
          <p className="text-warm-charcoal/70 mb-6 text-sm">
            Spotlight launches feature curated campaigns, influencer partnerships, and live
            workshops. Submit your collection to unlock premium placement and storytelling support.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/features"
              className="border-primary text-primary hover:bg-primary/10 rounded-lg border px-4 py-2 text-sm font-semibold transition"
            >
              View feature roadmap
            </Link>
            <Link
              href="/messages"
              className="bg-secondary hover:bg-secondary/80 rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
            >
              Talk to success coach
            </Link>
          </div>
        </div>
        <div className="border-border space-y-4 rounded-3xl border bg-white p-8">
          <p className="text-secondary text-xs font-semibold tracking-widest uppercase">
            Marketplace insights
          </p>
          {enablementHighlights.map((item) => (
            <div key={item.title} className="space-y-1">
              <h4 className="text-warm-charcoal text-base font-semibold">{item.title}</h4>
              <p className="text-warm-charcoal/70 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
