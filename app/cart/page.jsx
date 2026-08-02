'use client';

/**
 * Cart (`/cart`) — handoff README §Cart.
 *
 * Centered 720px column: title with live count, empty state, line items with a
 * mini qty stepper (decrementing at 1 removes the row), totals, CHECKOUT.
 *
 * The cart provider hydrates from localStorage in an effect, so `hydrated`
 * gates the body — without it a saved cart would flash "Your cart is empty."
 * for a frame on every load.
 */

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/products';

const rowLabel = { fontSize: 'var(--ng-t-13)', color: 'var(--ng-muted)' };

/** −  n  + — the small bordered stepper on each line (prototype: .25 hairline). */
function Stepper({ item, setQty }) {
  const step = {
    padding: '6px 12px',
    cursor: 'pointer',
    userSelect: 'none',
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid var(--ng-rule-crumb)',
        marginTop: 12,
        fontSize: 'var(--ng-t-12)',
      }}
    >
      <button
        type="button"
        aria-label={`Decrease quantity of ${item.name}`}
        // At qty 1 the "−" removes the row (setQty(id, 0) drops it).
        onClick={() => setQty(item.id, item.qty - 1)}
        style={step}
      >
        &#8722;
      </button>
      <span
        aria-label={`Quantity: ${item.qty}`}
        style={{
          padding: '6px 4px',
          fontWeight: 500,
          minWidth: 14,
          textAlign: 'center',
        }}
      >
        {item.qty}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity of ${item.name}`}
        onClick={() => setQty(item.id, item.qty + 1)}
        style={step}
      >
        +
      </button>
    </div>
  );
}

function LineItem({ item, setQty, remove }) {
  const href = `/products/${item.slug}`;

  return (
    <div
      style={{
        display: 'flex',
        gap: 22,
        alignItems: 'center',
        padding: '28px 0',
        borderBottom: '1px solid var(--ng-rule)',
      }}
    >
      <Link
        href={href}
        style={{
          width: 84,
          height: 104,
          flex: 'none',
          background: 'var(--ng-img-placeholder)',
        }}
      >
        <div
          role="img"
          aria-label={item.name}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--ng-img-placeholder)',
            backgroundImage: `url('${item.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Link>

      <div style={{ flex: 1 }}>
        <Link
          href={href}
          style={{
            fontFamily: 'var(--ng-font-display)',
            fontSize: 'var(--ng-d-19)',
          }}
        >
          {item.name}
        </Link>
        <div
          style={{
            fontSize: 'var(--ng-t-11)',
            color: 'var(--ng-muted)',
            marginTop: 4,
          }}
        >
          {item.size}
        </div>
        <Stepper item={item} setQty={setQty} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
        }}
      >
        <div style={{ fontSize: 'var(--ng-t-135)', fontWeight: 500 }}>
          {formatPrice(item.line)}
        </div>
        <button
          type="button"
          onClick={() => remove(item.id)}
          style={{
            fontSize: 'var(--ng-t-10)',
            letterSpacing: '.1em',
            color: 'var(--ng-muted)',
            borderBottom: '1px solid var(--ng-rule-link)',
          }}
        >
          REMOVE
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { lines, count, subtotal, hydrated, setQty, remove } = useCart();

  return (
    <div style={{ padding: '64px var(--ng-gutter) 96px' }}>
      <div style={{ maxWidth: 'var(--ng-max-cart)', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: 'var(--ng-font-display)',
            fontSize: 'var(--ng-d-38)',
            fontWeight: 500,
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Your cart{' '}
          <span style={{ fontSize: 'var(--ng-d-20)', color: 'var(--ng-muted)' }}>
            ({count})
          </span>
        </h1>

        {/* Nothing below the title until localStorage has been read. */}
        {!hydrated ? (
          <div style={{ minHeight: 280 }} />
        ) : lines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 0 12px' }}>
            <div
              style={{
                fontFamily: 'var(--ng-font-display)',
                fontStyle: 'italic',
                fontSize: 'var(--ng-d-20)',
                color: 'var(--ng-muted)',
              }}
            >
              Your cart is empty.
            </div>
            <Link
              href="/shop"
              className="ng-btn"
              style={{
                padding: '15px 36px',
                fontSize: 'var(--ng-t-105)',
                letterSpacing: 'var(--ng-ls-btn)',
                fontWeight: 500,
                marginTop: 28,
              }}
            >
              SHOP THE COLLECTION
            </Link>
          </div>
        ) : (
          <div style={{ marginTop: 20 }}>
            {lines.map((item) => (
              <LineItem
                key={item.id}
                item={item}
                setQty={setQty}
                remove={remove}
              />
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '26px 0 8px',
                fontSize: 'var(--ng-t-13)',
              }}
            >
              <span style={rowLabel}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>{formatPrice(subtotal)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                fontSize: 'var(--ng-t-13)',
              }}
            >
              <span style={rowLabel}>Shipping</span>
              <span
                style={{
                  fontFamily: 'var(--ng-font-display)',
                  fontStyle: 'italic',
                }}
              >
                Complimentary
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '18px 0 26px',
                borderTop: '1px solid var(--ng-rule)',
                marginTop: 14,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="ng-btn"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: 17,
                fontSize: 'var(--ng-t-11)',
                letterSpacing: 'var(--ng-ls-secure)',
                fontWeight: 500,
              }}
            >
              CHECKOUT
            </Link>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Link
                href="/shop"
                style={{
                  fontSize: 'var(--ng-t-105)',
                  letterSpacing: 'var(--ng-ls-toast-link)',
                  borderBottom: '1px solid var(--ng-rule-link)',
                }}
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
