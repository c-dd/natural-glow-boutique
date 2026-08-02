'use client';

/**
 * Shop (handoff README §Shop, prototype screen "Shop").
 *
 * Title / count / grid all derive from one `filter` value, which mirrors the
 * `?category=` query string.
 *
 * Why no `useSearchParams()`: under `output: 'export'` it forces a client
 * bailout and the page stops prerendering (see the repo README §Conventions).
 * So the query string is read from `window.location.search` in an effect, and
 * tab clicks write it back with `history.replaceState` — same URL contract,
 * no bailout. Deep links (`/shop/?category=wellness`) land filtered: the static
 * HTML paints "Shop All" for a frame, then the effect applies the category.
 *
 * The subscription covers three ways the URL can change under us:
 *   · back / forward            → `popstate`
 *   · a tab click here          → our own `replaceState`
 *   · a header nav link while
 *     already on /shop          → Next's router `pushState` (same pathname, so
 *                                 the page never remounts and a bare mount
 *                                 effect would miss it)
 * The last one is why `history.pushState` / `replaceState` are wrapped to emit
 * an event — idempotently, and only to notify; behaviour is untouched.
 */

import { useCallback, useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { byCategory, categoryTitle, shopFilters } from '@/lib/products';

const LOCATION_EVENT = 'ngb:locationchange';

/** Wrap a history method once so same-document URL changes are observable. */
function announceHistory(method) {
  const current = window.history[method];
  if (!current || current.__ngbAnnounces) return;
  const wrapped = function ngbHistory(...args) {
    const result = current.apply(this, args);
    window.dispatchEvent(new Event(LOCATION_EVENT));
    return result;
  };
  wrapped.__ngbAnnounces = true;
  window.history[method] = wrapped;
}

/** The `?category=` value, normalised to a known filter (default `all`). */
function categoryFromLocation() {
  const value = new URLSearchParams(window.location.search).get('category');
  return shopFilters.some((f) => f.value === value) ? value : 'all';
}

export default function ShopPage() {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const sync = () => setFilter(categoryFromLocation());

    announceHistory('pushState');
    announceHistory('replaceState');
    sync();

    window.addEventListener('popstate', sync);
    window.addEventListener(LOCATION_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(LOCATION_EVENT, sync);
    };
  }, []);

  /** Tab click: update state and keep the URL shareable / back-navigable. */
  const selectFilter = useCallback((value) => {
    setFilter(value);
    const url =
      value === 'all'
        ? window.location.pathname
        : `${window.location.pathname}?category=${value}`;
    window.history.replaceState(window.history.state, '', url);
  }, []);

  const filtered = byCategory(filter);
  const count = `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`;

  return (
    <div style={{ padding: '56px var(--ng-gutter) 88px' }}>
      <h1
        style={{
          fontFamily: 'var(--ng-font-display)',
          fontSize: 'var(--ng-d-38)',
          fontWeight: 500,
          margin: 0,
        }}
      >
        {categoryTitle(filter)}
      </h1>
      <div
        style={{
          fontSize: 'var(--ng-t-115)',
          color: 'var(--ng-muted)',
          marginTop: 6,
        }}
      >
        {count}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 26,
          borderBottom: '1px solid var(--ng-rule)',
          margin: '26px 0 36px',
        }}
      >
        {shopFilters.map((tab) => {
          const active = tab.value === filter;
          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(tab.value)}
              style={{
                padding: '10px 2px',
                fontSize: 'var(--ng-t-105)',
                letterSpacing: 'var(--ng-ls-btn)',
                fontWeight: 500,
                cursor: 'pointer',
                /* Overlaps the row's baseline hairline by 1px. */
                borderBottom: `1px solid ${active ? 'var(--ng-ink)' : 'transparent'}`,
                marginBottom: -1,
                color: active ? 'var(--ng-ink)' : 'var(--ng-muted)',
              }}
            >
              {tab.filterLabel}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--ng-gap-grid)',
        }}
      >
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} variant="shop" />
        ))}
      </div>
    </div>
  );
}
