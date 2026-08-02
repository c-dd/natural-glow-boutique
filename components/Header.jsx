'use client';

/**
 * Site header — 3-column grid: nav / centered logo lockup / live cart count.
 * `minimal` renders the /checkouts variant: no nav, no cart, right-aligned
 * "SECURE CHECKOUT" label instead.
 */

import Link from 'next/link';
import { useCart } from '@/lib/cart';

const NAV = [
  { label: 'SHOP', href: '/shop' },
  { label: 'BODY', href: '/shop?category=body' },
  { label: 'HOME FRAGRANCE', href: '/shop?category=home' },
];

const headerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  padding: '20px var(--ng-gutter)',
  borderBottom: '1px solid var(--ng-rule)',
  background: 'var(--ng-bg)',
};

export function Logo({ size = 'header' }) {
  const header = size === 'header';
  return (
    <>
      <div
        style={{
          fontFamily: 'var(--ng-font-display)',
          fontSize: header ? 'var(--ng-d-22)' : 'var(--ng-d-18)',
          letterSpacing: header ? 'var(--ng-ls-lockup)' : 'var(--ng-ls-lockup-sm)',
          fontWeight: 500,
        }}
      >
        NATURAL GLOW
      </div>
      <div
        style={{
          fontSize: 'var(--ng-t-8)',
          letterSpacing: header
            ? 'var(--ng-ls-boutique)'
            : 'var(--ng-ls-boutique-sm)',
          color: 'var(--ng-muted)',
          marginTop: header ? 2 : 3,
        }}
      >
        BOUTIQUE
      </div>
    </>
  );
}

export default function Header({ minimal = false }) {
  const { count } = useCart();

  return (
    <header style={headerStyle}>
      {minimal ? (
        <div />
      ) : (
        <nav
          style={{
            display: 'flex',
            gap: 30,
            fontSize: 'var(--ng-t-11)',
            letterSpacing: 'var(--ng-ls-nav)',
            fontWeight: 500,
          }}
        >
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className="ng-hover">
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <Link href="/" style={{ textAlign: 'center' }}>
        <Logo size="header" />
      </Link>

      {minimal ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: 'var(--ng-t-10)',
            letterSpacing: 'var(--ng-ls-secure)',
            color: 'var(--ng-muted)',
            fontWeight: 500,
          }}
        >
          SECURE CHECKOUT
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            href="/cart"
            className="ng-hover"
            style={{
              fontSize: 'var(--ng-t-11)',
              letterSpacing: 'var(--ng-ls-nav)',
              fontWeight: 500,
            }}
          >
            CART&nbsp;({count})
          </Link>
        </div>
      )}
    </header>
  );
}
