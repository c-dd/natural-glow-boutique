import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart';
import { ToastProvider } from '@/components/Toast';
import SiteChrome from '@/components/SiteChrome';

/* Display face — headings, product names, pull-quotes. */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

/* UI face — body copy, micro-labels, buttons. */
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Natural Glow Boutique',
  description:
    'Small-batch botanical skincare, body care, wellness, and home fragrance — cold-pressed, blended by hand, and kind to skin.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>
        <CartProvider>
          <ToastProvider>
            <SiteChrome>{children}</SiteChrome>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
