'use client';

/**
 * Product card — shared by Home "Bestsellers" and the Shop grid.
 *
 * The two grids use the same markup with two deliberate differences carried
 * over from the prototype (handoff §Home / §Shop):
 *
 *   variant="home"   name 19px · sub = the hard-coded bestseller line
 *                    (`cardSub`) · price 12.5px
 *   variant="shop"   name 20px · sub = `${tagline} · ${size}` · price 13px
 *
 * The whole card is a link to the product page. "ADD" is a quick-add: it stops
 * the click from reaching the anchor (both React propagation and the anchor's
 * default activation), adds one unit to the cart, and fires the toast — the
 * shopper never leaves the grid.
 */

import Link from 'next/link';
import { useAddToCart } from '@/components/Toast';
import { formatPriceWhole } from '@/lib/products';

const VARIANTS = {
  home: { name: 'var(--ng-d-19)', price: 'var(--ng-t-125)' },
  shop: { name: 'var(--ng-d-20)', price: 'var(--ng-t-13)' },
};

export default function ProductCard({ product, variant = 'home' }) {
  const addToCart = useAddToCart();
  const { name: nameSize, price: priceSize } = VARIANTS[variant] ?? VARIANTS.home;
  const sub =
    variant === 'shop' ? `${product.tagline} · ${product.size}` : product.cardSub;

  const quickAdd = (event) => {
    // stopPropagation keeps the card's React handlers out of it; preventDefault
    // keeps the surrounding <a> from navigating on the bubbled click.
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="ng-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 13,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          aspectRatio: '4 / 5',
          overflow: 'hidden',
          background: 'var(--ng-img-placeholder)',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      <div>
        <div style={{ fontFamily: 'var(--ng-font-display)', fontSize: nameSize }}>
          {product.name}
        </div>
        <div
          style={{
            fontSize: 'var(--ng-t-11)',
            color: 'var(--ng-muted)',
            marginTop: 3,
          }}
        >
          {sub}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: priceSize, fontWeight: 500 }}>
          {formatPriceWhole(product.price)}
        </div>
        <button
          type="button"
          onClick={quickAdd}
          aria-label={`Add ${product.name} to cart`}
          style={{
            fontSize: 'var(--ng-t-10)',
            letterSpacing: 'var(--ng-ls-nav)',
            borderBottom: '1px solid var(--ng-ink)',
            paddingBottom: 2,
          }}
        >
          ADD
        </button>
      </div>
    </Link>
  );
}
