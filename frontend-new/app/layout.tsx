import type React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { MessageProvider } from '@/lib/message-context';
import { CartNotification } from '@/components/cart-notification';
import { MessageNotification } from '@/components/message-notification';
import './globals.css';

const grandCru = localFont({
  src: '../public/fonts/GrandCru-LightS.otf',
  variable: '--font-serif',
  weight: '300 400',
});
const nunito = localFont({
  src: '../public/fonts/Nunito-VariableFont_wght.ttf',
  variable: '--font-sans',
  weight: '200 900',
});

export const metadata: Metadata = {
  title: 'Artisans of India | Celebrate Handcrafted Heritage',
  description:
    'Discover authentic handmade products from Indian artisans. Experience voice-guided discovery, workshops, and stories of skilled craftspeople.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${grandCru.variable} bg-warm-cream text-warm-charcoal font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <MessageProvider>
              {children}
              <CartNotification />
              <MessageNotification />
            </MessageProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
