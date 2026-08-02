/**
 * Site footer — 4-column grid (brand / SHOP / SUPPORT / LEGAL) over a bottom
 * bar carrying the copyright line and the FDA disclaimer. Rendered on every
 * page, including the minimal-chrome /checkouts route.
 */

import Link from 'next/link';
import { Logo } from '@/components/Header';

const CONTACT = 'hello@naturalglowboutique.com';

const COLUMNS = [
  {
    heading: 'SHOP',
    links: [
      { label: 'Shop All', href: '/shop' },
      { label: 'Face', href: '/shop?category=face' },
      { label: 'Body', href: '/shop?category=body' },
      { label: 'Wellness', href: '/shop?category=wellness' },
      { label: 'Home Fragrance', href: '/shop?category=home' },
    ],
  },
  {
    heading: 'SUPPORT',
    links: [
      { label: 'Contact', href: `mailto:${CONTACT}`, external: true },
      { label: 'Shipping', href: '/terms' },
      { label: 'Refund Policy', href: '/terms' },
    ],
  },
  {
    heading: 'LEGAL',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

const headingStyle = {
  fontSize: 'var(--ng-t-95)',
  letterSpacing: 'var(--ng-ls-eyebrow)',
  color: 'var(--ng-muted)',
  fontWeight: 500,
  marginBottom: 4,
};

const linkStyle = { fontSize: 'var(--ng-t-12)' };

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--ng-rule)',
        background: 'var(--ng-bg)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: 'var(--ng-gap-footer)',
          padding: '56px var(--ng-gutter) 44px',
        }}
      >
        <div>
          <Logo size="footer" />
          <div
            style={{
              fontSize: 'var(--ng-t-12)',
              lineHeight: 1.8,
              color: 'var(--ng-muted)',
              fontWeight: 300,
              maxWidth: 260,
              marginTop: 18,
            }}
          >
            Small-batch botanical skincare, body care, and home fragrance — made
            by hand, kind to skin.
          </div>
          <a
            href={`mailto:${CONTACT}`}
            style={{
              display: 'inline-block',
              fontSize: 'var(--ng-t-11)',
              letterSpacing: 'var(--ng-ls-mail)',
              borderBottom: '1px solid var(--ng-rule-link)',
              marginTop: 16,
              paddingBottom: 2,
            }}
          >
            {CONTACT}
          </a>
        </div>

        {COLUMNS.map((column) => (
          <div
            key={column.heading}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={headingStyle}>{column.heading}</div>
            {column.links.map((link) =>
              link.external ? (
                <a key={link.label} href={link.href} style={linkStyle}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} style={linkStyle}>
                  {link.label}
                </Link>
              )
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '22px var(--ng-gutter) 34px',
          borderTop: '1px solid var(--ng-rule-soft)',
        }}
      >
        <div
          style={{
            fontSize: 'var(--ng-t-105)',
            color: 'var(--ng-muted)',
            fontWeight: 300,
          }}
        >
          © 2026 Natural Glow Boutique · naturalglowboutique.com
        </div>
        <div
          style={{
            fontSize: 'var(--ng-t-10)',
            lineHeight: 1.7,
            color: 'var(--ng-faint)',
            fontWeight: 300,
            marginTop: 8,
            maxWidth: 640,
          }}
        >
          †These statements have not been evaluated by the Food and Drug
          Administration. Our wellness products are not intended to diagnose,
          treat, cure, or prevent any disease.
        </div>
      </div>
    </footer>
  );
}
