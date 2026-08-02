/**
 * Home (handoff README §Home, prototype screen "Home").
 *
 * Five sections, top to bottom: hero · value strip · bestsellers · wellness
 * band · story. A server component — the only interactive part is the card's
 * quick-ADD, which lives in the client <ProductCard>.
 */

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { bestsellers } from '@/lib/products';

const VALUE_CELLS = [
  'COLD-PRESSED BOTANICALS',
  'SMALL-BATCH, MADE MONTHLY',
  'PLASTIC-FREE PACKAGING',
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div
          style={{
            padding: '92px 64px 92px var(--ng-gutter)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 26,
          }}
        >
          <div
            style={{
              fontSize: 'var(--ng-t-105)',
              letterSpacing: 'var(--ng-ls-eyebrow)',
              color: 'var(--ng-muted)',
              fontWeight: 500,
            }}
          >
            SMALL-BATCH · BOTANICAL · MADE BY HAND
          </div>

          <h1
            style={{
              fontFamily: 'var(--ng-font-display)',
              fontSize: 'var(--ng-d-60)',
              lineHeight: 1.05,
              fontWeight: 500,
              textWrap: 'pretty',
              margin: 0,
            }}
          >
            Skin, in its <em style={{ fontWeight: 400 }}>element</em>.
          </h1>

          <p
            style={{
              fontSize: 'var(--ng-t-145)',
              lineHeight: 1.7,
              color: 'var(--ng-muted)',
              maxWidth: 410,
              fontWeight: 300,
              margin: 0,
            }}
          >
            Cold-pressed botanicals for skin, body, and home — blended in small
            batches with nothing your skin doesn&rsquo;t need.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              marginTop: 6,
            }}
          >
            <Link
              href="/shop"
              className="ng-btn"
              style={{
                padding: '15px 34px',
                fontSize: 'var(--ng-t-105)',
                letterSpacing: 'var(--ng-ls-btn)',
                fontWeight: 500,
              }}
            >
              SHOP THE COLLECTION
            </Link>
            <Link
              href="/shop?category=wellness"
              className="ng-link-underline"
              style={{
                fontSize: 'var(--ng-t-11)',
                letterSpacing: 'var(--ng-ls-nav)',
              }}
            >
              SHOP WELLNESS
            </Link>
          </div>
        </div>

        <div style={{ minHeight: 600, overflow: 'hidden' }}>
          <img
            src="/products/radiance-facial-oil.png"
            alt="Radiance Facial Oil in amber glass"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </section>

      {/* ── Value strip ──────────────────────────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          borderTop: '1px solid var(--ng-rule)',
          borderBottom: '1px solid var(--ng-rule)',
        }}
      >
        {VALUE_CELLS.map((cell, i) => (
          <div
            key={cell}
            style={{
              padding: 28,
              textAlign: 'center',
              fontSize: 'var(--ng-t-105)',
              letterSpacing: 'var(--ng-ls-nav)',
              fontWeight: 500,
              borderRight:
                i < VALUE_CELLS.length - 1 ? '1px solid var(--ng-rule)' : undefined,
            }}
          >
            {cell}
          </div>
        ))}
      </section>

      {/* ── Bestsellers ──────────────────────────────────────────────────── */}
      <section style={{ padding: '72px var(--ng-gutter) 80px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 34,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--ng-font-display)',
              fontSize: 'var(--ng-d-31)',
              fontWeight: 500,
              margin: 0,
            }}
          >
            Bestsellers
          </h2>
          <Link
            href="/shop"
            className="ng-link-underline"
            style={{
              fontSize: 'var(--ng-t-105)',
              letterSpacing: 'var(--ng-ls-nav)',
            }}
          >
            VIEW ALL
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--ng-gap-card)',
          }}
        >
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} variant="home" />
          ))}
        </div>
      </section>

      {/* ── Wellness band ────────────────────────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--ng-band)',
          borderTop: '1px solid var(--ng-rule)',
          borderBottom: '1px solid var(--ng-rule)',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 480 }}>
          <img
            src="/products/womens-wellness.png"
            alt="Women's Wellness supplement"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        <div
          style={{
            padding: '80px 72px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 'var(--ng-t-105)',
              letterSpacing: 'var(--ng-ls-eyebrow)',
              color: 'var(--ng-muted)',
              fontWeight: 500,
            }}
          >
            NEW — THE WELLNESS SHELF
          </div>
          <h2
            style={{
              fontFamily: 'var(--ng-font-display)',
              fontSize: 'var(--ng-d-42)',
              lineHeight: 1.15,
              fontWeight: 500,
              textWrap: 'pretty',
              margin: 0,
            }}
          >
            Glow, from within.
          </h2>
          <p
            style={{
              fontSize: 'var(--ng-t-14)',
              lineHeight: 1.75,
              color: 'var(--ng-muted)',
              fontWeight: 300,
              maxWidth: 400,
              margin: 0,
            }}
          >
            Daily botanical supplements to support energy, balance, and stronger
            hair, skin, and nails — one capsule at a time.&#8224;
          </p>
          <Link
            href="/shop?category=wellness"
            className="ng-btn-outline"
            style={{
              alignSelf: 'flex-start',
              padding: '14px 32px',
              fontSize: 'var(--ng-t-105)',
              letterSpacing: 'var(--ng-ls-btn)',
              fontWeight: 500,
            }}
          >
            SHOP WELLNESS
          </Link>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '88px var(--ng-gutter)' }}>
        <div
          style={{
            fontSize: 'var(--ng-t-10)',
            letterSpacing: 'var(--ng-ls-eyebrow-lg)',
            color: 'var(--ng-muted)',
            fontWeight: 500,
          }}
        >
          OUR STORY
        </div>
        <p
          style={{
            fontFamily: 'var(--ng-font-display)',
            fontSize: 'var(--ng-d-30)',
            fontWeight: 500,
            fontStyle: 'italic',
            maxWidth: 620,
            margin: '22px auto 0',
            lineHeight: 1.5,
            textWrap: 'pretty',
          }}
        >
          Every bottle is blended, poured, and labeled by hand — in batches small
          enough to sign.
        </p>
        <p
          style={{
            fontSize: 'var(--ng-t-13)',
            color: 'var(--ng-muted)',
            fontWeight: 300,
            maxWidth: 460,
            margin: '18px auto 0',
            lineHeight: 1.7,
          }}
        >
          If it wouldn&rsquo;t go on our own skin, it doesn&rsquo;t go in the jar.
          That has been the whole philosophy since day one.
        </p>
      </section>
    </div>
  );
}
