'use client';

/**
 * Product detail — the interactive half of `/products/[slug]`.
 *
 * Three pieces of state, all from the handoff (§Product detail / §State):
 *   qty      quantity to add, minimum 1; drives the button's live price
 *   added    1.5s "ADDED TO CART" flash after a successful add
 *   openAcc  index of the open accordion — exclusive, 0 means all closed
 */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAddToCart } from '@/components/Toast';
import { formatPrice, formatPriceWhole } from '@/lib/products';

const ADDED_FLASH_MS = 1500;

/** Supplement-only FDA line (singular — the footer's covers the whole shelf). */
const SUPPLEMENT_DISCLAIMER =
  '†These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.';

const accordionRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '16px 2px',
  borderBottom: '1px solid var(--ng-rule)',
  fontSize: 'var(--ng-t-105)',
  letterSpacing: 'var(--ng-ls-nav)',
  fontWeight: 500,
  cursor: 'pointer',
  width: '100%',
};

const accordionBodyStyle = {
  fontSize: 'var(--ng-t-13)',
  lineHeight: 1.8,
  color: 'var(--ng-body)',
  fontWeight: 300,
  padding: '4px 2px 18px',
  borderBottom: '1px solid var(--ng-rule)',
};

const stepperButtonStyle = {
  padding: '14px 18px',
  cursor: 'pointer',
  fontSize: 14,
  userSelect: 'none',
};

export default function ProductDetail({ product, related }) {
  const addToCart = useAddToCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAcc, setOpenAcc] = useState(0);
  const flash = useRef(null);

  useEffect(() => () => flash.current && clearTimeout(flash.current), []);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    if (flash.current) clearTimeout(flash.current);
    flash.current = setTimeout(() => setAdded(false), ADDED_FLASH_MS);
  };

  const toggle = (index) => setOpenAcc((open) => (open === index ? 0 : index));

  const accordions = [
    { index: 1, label: 'FULL INGREDIENTS', body: product.ingredients },
    { index: 2, label: 'HOW TO USE', body: product.howToUse },
    {
      index: 3,
      label: 'SHIPPING & RETURNS',
      body: (
        <>
          Orders ship within 2&ndash;3 business days with complimentary standard
          shipping. Once an order has shipped it is no longer eligible for a
          refund — see our full{' '}
          <Link
            href="/terms"
            style={{ borderBottom: '1px solid var(--ng-rule-link)' }}
          >
            Refund Policy
          </Link>
          .
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* ── Photo ──────────────────────────────────────────────────────── */}
        <div
          style={{
            background: 'var(--ng-img-placeholder)',
            minHeight: 680,
            overflow: 'hidden',
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

        {/* ── Detail column ──────────────────────────────────────────────── */}
        <div style={{ padding: '64px 72px 56px 64px' }}>
          <div
            style={{
              fontSize: 'var(--ng-t-10)',
              letterSpacing: 'var(--ng-ls-nav)',
              color: 'var(--ng-muted)',
            }}
          >
            <Link
              href="/shop"
              style={{
                color: 'inherit',
                borderBottom: '1px solid var(--ng-rule-crumb)',
              }}
            >
              SHOP
            </Link>
            &nbsp;&nbsp;/&nbsp;&nbsp;{product.catLabel}
          </div>

          <h1
            style={{
              fontFamily: 'var(--ng-font-display)',
              fontSize: 'var(--ng-d-44)',
              fontWeight: 500,
              margin: '18px 0 0',
              lineHeight: 1.1,
            }}
          >
            {product.name}
          </h1>

          <div
            style={{
              fontFamily: 'var(--ng-font-display)',
              fontStyle: 'italic',
              fontSize: 'var(--ng-d-18)',
              color: 'var(--ng-muted)',
              marginTop: 8,
            }}
          >
            {product.tagline}
          </div>

          <div style={{ fontSize: 15, fontWeight: 500, marginTop: 14 }}>
            {formatPriceWhole(product.price)}{' '}
            <span
              style={{
                color: 'var(--ng-muted)',
                fontWeight: 300,
                fontSize: 'var(--ng-t-12)',
                marginLeft: 8,
              }}
            >
              {product.size}
            </span>
          </div>

          <p
            style={{
              fontSize: 'var(--ng-t-14)',
              lineHeight: 1.75,
              color: 'var(--ng-body)',
              fontWeight: 300,
              margin: '22px 0 0',
              maxWidth: 430,
            }}
          >
            {product.description}
          </p>

          <div style={{ marginTop: 26 }}>
            <div
              style={{
                fontSize: 'var(--ng-t-95)',
                letterSpacing: 'var(--ng-ls-toast)',
                color: 'var(--ng-muted)',
                fontWeight: 500,
              }}
            >
              KEY INGREDIENTS
            </div>
            <div
              style={{
                fontFamily: 'var(--ng-font-display)',
                fontStyle: 'italic',
                fontSize: 'var(--ng-d-17)',
                marginTop: 8,
              }}
            >
              {product.actives}
            </div>
          </div>

          {/* ── Buy row ──────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 14, marginTop: 30 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--ng-rule-input)',
              }}
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                style={stepperButtonStyle}
              >
                &#8722;
              </button>
              <div
                aria-live="polite"
                style={{
                  padding: '14px 6px',
                  fontSize: 'var(--ng-t-13)',
                  fontWeight: 500,
                  minWidth: 16,
                  textAlign: 'center',
                }}
              >
                {qty}
              </div>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((n) => n + 1)}
                style={stepperButtonStyle}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="ng-btn"
              onClick={handleAdd}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--ng-t-11)',
                letterSpacing: 'var(--ng-ls-btn)',
                fontWeight: 500,
              }}
            >
              {added
                ? 'ADDED TO CART'
                : `ADD TO CART — ${formatPrice(product.price * qty)}`}
            </button>
          </div>

          {product.supplement && (
            <p
              style={{
                fontSize: 'var(--ng-t-105)',
                lineHeight: 1.7,
                color: 'var(--ng-muted)',
                fontWeight: 300,
                margin: '18px 0 0',
              }}
            >
              {SUPPLEMENT_DISCLAIMER}
            </p>
          )}

          {/* ── Accordions (exclusive) ───────────────────────────────────── */}
          <div style={{ marginTop: 32, borderTop: '1px solid var(--ng-rule)' }}>
            {accordions.map(({ index, label, body }) => (
              <div key={label}>
                <button
                  type="button"
                  aria-expanded={openAcc === index}
                  onClick={() => toggle(index)}
                  style={accordionRowStyle}
                >
                  {label}
                  <span aria-hidden="true">+</span>
                </button>
                {openAcc === index && <div style={accordionBodyStyle}>{body}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── You may also like ────────────────────────────────────────────── */}
      <section
        style={{
          padding: '64px var(--ng-gutter) 88px',
          borderTop: '1px solid var(--ng-rule)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--ng-font-display)',
            fontSize: 'var(--ng-d-26)',
            fontWeight: 500,
            margin: '0 0 30px',
          }}
        >
          You may also like
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--ng-gap-grid)',
          }}
        >
          {related.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  aspectRatio: '4 / 5',
                  background: 'var(--ng-img-placeholder)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
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
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--ng-font-display)',
                    fontSize: 'var(--ng-d-18)',
                  }}
                >
                  {item.name}
                </div>
                <div style={{ fontSize: 'var(--ng-t-125)', fontWeight: 500 }}>
                  {formatPriceWhole(item.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
