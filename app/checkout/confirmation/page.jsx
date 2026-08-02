'use client';

/**
 * Order confirmation (`/checkout/confirmation`) — handoff README
 * §Order confirmation.
 *
 * Renders the snapshot /checkout wrote to sessionStorage (`ngb-last-order`)
 * just before it cleared the cart. The snapshot is read in an effect — with
 * `output: 'export'` this page is prerendered as static HTML, so there is
 * nothing to read at build time. No snapshot (a direct visit, a new tab, a
 * cleared session) → home.
 *
 * The snapshot is left in place rather than consumed, so a refresh still shows
 * the order the customer just placed.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/products';

/* Written by app/checkout/page.jsx. */
const ORDER_STORAGE_KEY = 'ngb-last-order';

/** Shape check — a half-written / hand-edited snapshot shouldn't render. */
function isOrder(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      value.no &&
      value.name &&
      value.email &&
      Array.isArray(value.items) &&
      value.items.length
  );
}

const cardRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 'var(--ng-t-125)',
};

export default function ConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let stored = null;
    try {
      stored = JSON.parse(
        window.sessionStorage.getItem(ORDER_STORAGE_KEY) || 'null'
      );
    } catch {
      stored = null;
    }
    if (isOrder(stored)) setOrder(stored);
    else router.replace('/');
  }, [router]);

  // Nothing to show until the snapshot is read (or the redirect fires).
  if (!order) return <div style={{ minHeight: 420 }} />;

  const shipping = Number(order.shipping) || 0;

  return (
    <div style={{ padding: '80px var(--ng-gutter) 110px' }}>
      <div
        style={{
          maxWidth: 'var(--ng-max-confirm)',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 'var(--ng-t-10)',
            letterSpacing: 'var(--ng-ls-legal)',
            color: 'var(--ng-muted)',
            fontWeight: 500,
          }}
        >
          ORDER {order.no}
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
          Thank you, {order.name}.
        </h1>

        <div
          style={{
            fontSize: 'var(--ng-t-135)',
            color: 'var(--ng-muted)',
            fontWeight: 300,
            marginTop: 14,
            lineHeight: 1.7,
          }}
        >
          Your order is confirmed. A receipt is on its way to{' '}
          <span style={{ color: 'var(--ng-ink)' }}>{order.email}</span>.
        </div>

        <div
          style={{
            border: '1px solid var(--ng-rule)',
            padding: '6px 28px 22px',
            marginTop: 40,
            textAlign: 'left',
          }}
        >
          {order.items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: '1px solid rgba(28, 27, 24, .1)',
              }}
            >
              <div
                role="img"
                aria-label={item.name}
                style={{
                  width: 52,
                  height: 64,
                  flex: 'none',
                  backgroundColor: 'var(--ng-img-placeholder)',
                  backgroundImage: `url('${item.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'var(--ng-font-display)',
                    fontSize: 'var(--ng-d-155)',
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontSize: 'var(--ng-t-105)',
                    color: 'var(--ng-muted)',
                    marginTop: 2,
                  }}
                >
                  Qty {item.qty}
                </div>
              </div>
              <div style={{ fontSize: 'var(--ng-t-125)', fontWeight: 500 }}>
                {formatPrice(item.line)}
              </div>
            </div>
          ))}

          <div style={{ ...cardRow, padding: '16px 0 4px' }}>
            <span style={{ color: 'var(--ng-muted)' }}>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div style={{ ...cardRow, padding: '4px 0' }}>
            <span style={{ color: 'var(--ng-muted)' }}>Shipping</span>
            {shipping ? (
              <span>{formatPrice(shipping)}</span>
            ) : (
              <span
                style={{
                  fontFamily: 'var(--ng-font-display)',
                  fontStyle: 'italic',
                }}
              >
                Complimentary
              </span>
            )}
          </div>
          <div
            style={{
              ...cardRow,
              padding: '14px 0 0',
              borderTop: '1px solid var(--ng-rule)',
              marginTop: 10,
              fontSize: 14.5,
              fontWeight: 500,
            }}
          >
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 'var(--ng-t-125)',
            color: 'var(--ng-muted)',
            fontWeight: 300,
            lineHeight: 1.8,
            marginTop: 28,
            maxWidth: 440,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Your order will be blended and packed within 2–3 business days. We'll
          email tracking the moment it ships.
        </div>

        <Link
          href="/shop"
          className="ng-btn"
          style={{
            padding: '15px 36px',
            fontSize: 'var(--ng-t-105)',
            letterSpacing: 'var(--ng-ls-btn)',
            fontWeight: 500,
            marginTop: 30,
          }}
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
