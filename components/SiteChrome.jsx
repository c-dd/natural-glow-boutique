'use client';

/**
 * Global chrome wrapper — mounted once in app/layout.jsx around {children}.
 *
 * Two chrome modes:
 *
 *   FULL (default)   announcement bar + full header (nav / logo / cart) + footer
 *   MINIMAL          no announcement bar, no nav, no cart — header is just the
 *                    centered logo with "SECURE CHECKOUT" at the right.
 *                    Footer is unchanged (per handoff README §Hosted checkout).
 *
 * ── Opting a route out of the full chrome ────────────────────────────────
 * Add its path to MINIMAL_CHROME_ROUTES below. Matching is on the pathname
 * and covers nested paths, so '/checkouts' also covers '/checkouts/anything'.
 * `/checkouts` is pre-registered for WS-C — that page needs no further wiring;
 * it renders its own content and gets minimal chrome automatically.
 *
 * This is deliberately path-based rather than a page-level flag: with
 * `output: 'export'` the layout is rendered above the page at build time, so a
 * page cannot tell the layout what chrome it wants without a client round-trip
 * (which would flash the wrong header). `usePathname()` is safe here — unlike
 * `useSearchParams()`, it does not force a client-side bailout during export.
 */

import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/** Routes that render the stripped-down checkout chrome. */
export const MINIMAL_CHROME_ROUTES = ['/checkouts'];

/** True when `pathname` is (or is nested under) a minimal-chrome route. */
export function hasMinimalChrome(pathname) {
  if (!pathname) return false;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return MINIMAL_CHROME_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

export default function SiteChrome({ children }) {
  const minimal = hasMinimalChrome(usePathname());

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ng-bg)',
        color: 'var(--ng-ink)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!minimal && <AnnouncementBar />}
      <Header minimal={minimal} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
