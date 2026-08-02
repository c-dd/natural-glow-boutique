'use client';

/**
 * Checkout (`/checkout`) — handoff README §Checkout.
 *
 * 2-col 1.15fr/.85fr: the form on the left, a sticky ORDER SUMMARY on the
 * right. Fields are uncontrolled and read with FormData on submit (the spec
 * allows it, and it keeps every keystroke out of React state); only `delivery`
 * is stateful because the PLACE ORDER label and the summary total track it.
 *
 * PAYMENT is <PaymentSection /> — a stub. No gateway is wired: validation runs
 * in full, then the order completes without any payment being processed. See
 * components/PaymentSection.jsx for the integration point.
 *
 * On success the order snapshot goes to sessionStorage under `ngb-last-order`,
 * the cart is cleared, and we navigate to /checkout/confirmation.
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import PaymentSection from '@/components/PaymentSection';
import { useCart } from '@/lib/cart';
import { EXPRESS_SHIPPING, formatPrice } from '@/lib/products';

/* Where the confirmation page picks the finished order up. Deliberately a
   local const rather than a shared export: app/ page files only export what
   Next.js expects of a page. */
const ORDER_STORAGE_KEY = 'ngb-last-order';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputStyle = {
  width: '100%',
  border: '1px solid var(--ng-rule-input)',
  padding: '13px 14px',
  fontSize: 'var(--ng-t-13)',
  outline: 'none',
};

const sectionLabel = {
  fontSize: 'var(--ng-t-95)',
  letterSpacing: 'var(--ng-ls-eyebrow)',
  color: 'var(--ng-muted)',
  fontWeight: 500,
  marginBottom: 14,
};

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 'var(--ng-t-125)',
};

/* Focus can't be expressed inline; globals.css owns the shared hover classes,
   so the two checkout screens carry this one rule for their inputs. */
const focusCss = `
  .ng-field:focus { border-color: var(--ng-ink); }
`;

function DeliveryOption({ selected, onSelect, name, eta, price }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 18px',
        width: '100%',
        border: selected
          ? '1px solid var(--ng-ink)'
          : '1px solid var(--ng-rule-option)',
        background: selected ? 'var(--ng-selected)' : 'transparent',
        cursor: 'pointer',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 14,
          height: 14,
          // The one round corner in the whole system — inline, so it beats the
          // `* { border-radius: var(--ng-radius) }` reset in globals.css.
          borderRadius: '50%',
          border: '1px solid var(--ng-ink)',
          background: selected ? 'var(--ng-ink)' : 'transparent',
          boxShadow: selected ? 'inset 0 0 0 3px var(--ng-bg)' : 'none',
          flex: 'none',
        }}
      />
      <span style={{ flex: 1, textAlign: 'left' }}>
        <span
          style={{
            display: 'block',
            fontSize: 'var(--ng-t-13)',
            fontWeight: 500,
          }}
        >
          {name}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 'var(--ng-t-115)',
            color: 'var(--ng-muted)',
            marginTop: 2,
          }}
        >
          {eta}
        </span>
      </span>
      {price}
    </button>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, hydrated, clear } = useCart();
  const [delivery, setDelivery] = useState('standard');
  const [error, setError] = useState('');
  /* Set the moment an order is placed: clear() empties the cart, and without
     this the "empty cart → /cart" guard below would race the confirmation. */
  const placed = useRef(false);

  const shipping = delivery === 'express' ? EXPRESS_SHIPPING : 0;
  const total = subtotal + shipping;

  // Nothing to check out — send them back to the cart (after hydration only).
  useEffect(() => {
    if (placed.current || !hydrated) return;
    if (lines.length === 0) router.replace('/cart');
  }, [hydrated, lines.length, router]);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key) => String(data.get(key) ?? '').trim();

    const email = value('email');
    const first = value('first');
    const last = value('last');
    const address = value('address');
    const city = value('city');
    const state = value('state');
    const zip = value('zip');

    // Validation order is specified: email → names → address → consent.
    if (!EMAIL_RE.test(email)) {
      return setError('Please enter a valid email address.');
    }
    if (!first || !last) {
      return setError('Please enter your first and last name.');
    }
    if (!address || !city || !state || !zip) {
      return setError('Please complete your shipping address.');
    }
    if (!data.get('agree')) {
      return setError(
        'Please agree to the Terms of Service and Refund Policy to continue.'
      );
    }
    if (lines.length === 0) {
      return setError('Your cart is empty — add something lovely first.');
    }

    setError('');

    /* NO PAYMENT IS TAKEN HERE. The order completes on validation alone —
       see components/PaymentSection.jsx (PAYMENT GATEWAY INTEGRATION POINT):
       a real gateway confirms payment at this point, before the snapshot. */
    const order = {
      no: `NG-${String(Date.now()).slice(-6)}`,
      name: first,
      email,
      items: lines.map((item) => ({
        name: item.name,
        image: item.image,
        qty: item.qty,
        line: item.line,
      })),
      subtotal,
      shipping,
      total,
      delivery,
    };

    placed.current = true;
    try {
      window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch {
      /* session storage unavailable — confirmation will bounce to home */
    }
    clear();
    router.push('/checkout/confirmation');
  }

  // Pre-hydration (and while the empty-cart redirect runs) render nothing.
  if (!hydrated || lines.length === 0) return <div style={{ minHeight: 420 }} />;

  return (
    <div style={{ padding: '56px var(--ng-gutter) 96px' }}>
      <style>{focusCss}</style>
      <div
        style={{
          maxWidth: 'var(--ng-max-checkout)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.15fr .85fr',
          gap: 'var(--ng-gap-checkout)',
          alignItems: 'start',
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <h1
            style={{
              fontFamily: 'var(--ng-font-display)',
              fontSize: 'var(--ng-d-36)',
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Checkout
          </h1>

          <div style={{ marginTop: 34 }}>
            <div style={sectionLabel}>CONTACT</div>
            <input
              className="ng-field"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email address"
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: 30 }}>
            <div style={sectionLabel}>SHIPPING ADDRESS</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <input
                className="ng-field"
                name="first"
                autoComplete="given-name"
                placeholder="First name"
                style={inputStyle}
              />
              <input
                className="ng-field"
                name="last"
                autoComplete="family-name"
                placeholder="Last name"
                style={inputStyle}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginTop: 12,
              }}
            >
              <input
                className="ng-field"
                name="address"
                autoComplete="address-line1"
                placeholder="Street address"
                style={inputStyle}
              />
              <input
                className="ng-field"
                name="apt"
                autoComplete="address-line2"
                placeholder="Apartment, suite, etc. (optional)"
                style={inputStyle}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: 12,
                marginTop: 12,
              }}
            >
              <input
                className="ng-field"
                name="city"
                autoComplete="address-level2"
                placeholder="City"
                style={inputStyle}
              />
              <input
                className="ng-field"
                name="state"
                autoComplete="address-level1"
                placeholder="State"
                style={inputStyle}
              />
              <input
                className="ng-field"
                name="zip"
                autoComplete="postal-code"
                placeholder="ZIP"
                style={inputStyle}
              />
            </div>
            <input
              className="ng-field"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone (optional, for delivery updates)"
              style={{ ...inputStyle, marginTop: 12 }}
            />
          </div>

          <div style={{ marginTop: 30 }}>
            <div style={sectionLabel}>DELIVERY</div>
            <div
              role="radiogroup"
              aria-label="Delivery"
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <DeliveryOption
                selected={delivery === 'standard'}
                onSelect={() => setDelivery('standard')}
                name="Standard"
                eta="5–7 business days"
                price={
                  <span
                    style={{
                      fontFamily: 'var(--ng-font-display)',
                      fontStyle: 'italic',
                      fontSize: 'var(--ng-t-14)',
                    }}
                  >
                    Complimentary
                  </span>
                }
              />
              <DeliveryOption
                selected={delivery === 'express'}
                onSelect={() => setDelivery('express')}
                name="Express"
                eta="2–3 business days"
                price={
                  <span
                    style={{ fontSize: 'var(--ng-t-13)', fontWeight: 500 }}
                  >
                    {formatPrice(EXPRESS_SHIPPING)}
                  </span>
                }
              />
            </div>
          </div>

          {/* PAYMENT GATEWAY INTEGRATION POINT — see PaymentSection.jsx */}
          <PaymentSection id="payment-element" />

          <label
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              marginTop: 28,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              name="agree"
              style={{ marginTop: 2, accentColor: 'var(--ng-ink)' }}
            />
            <span
              style={{
                fontSize: 'var(--ng-t-12)',
                lineHeight: 1.7,
                color: 'var(--ng-body)',
                fontWeight: 300,
              }}
            >
              I agree to the{' '}
              <Link
                href="/terms"
                onClick={(e) => e.stopPropagation()}
                style={{ borderBottom: '1px solid var(--ng-rule-link-strong)' }}
              >
                Terms of Service &amp; Refund Policy
              </Link>{' '}
              and the{' '}
              <Link
                href="/privacy"
                onClick={(e) => e.stopPropagation()}
                style={{ borderBottom: '1px solid var(--ng-rule-link-strong)' }}
              >
                Privacy Policy
              </Link>
              . I understand that orders cannot be refunded once they have
              shipped.
            </span>
          </label>

          {error && (
            <div
              role="alert"
              style={{
                border: '1px solid var(--ng-error)',
                color: 'var(--ng-error)',
                padding: '13px 16px',
                fontSize: 'var(--ng-t-12)',
                letterSpacing: '.04em',
                marginTop: 20,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="ng-btn"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              padding: 17,
              fontSize: 'var(--ng-t-11)',
              letterSpacing: 'var(--ng-ls-secure)',
              fontWeight: 500,
              marginTop: 24,
            }}
          >
            PLACE ORDER — {formatPrice(total)}
          </button>
        </form>

        <aside
          style={{
            border: '1px solid var(--ng-rule)',
            padding: 30,
            position: 'sticky',
            top: 24,
          }}
        >
          <div
            style={{
              fontSize: 'var(--ng-t-95)',
              letterSpacing: 'var(--ng-ls-eyebrow)',
              color: 'var(--ng-muted)',
              fontWeight: 500,
            }}
          >
            ORDER SUMMARY
          </div>

          <div style={{ marginTop: 8 }}>
            {lines.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  padding: '16px 0',
                  /* the summary's own, lighter divider — no token for .1 */
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
                <div
                  style={{ fontSize: 'var(--ng-t-125)', fontWeight: 500 }}
                >
                  {formatPrice(item.line)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...summaryRow, padding: '18px 0 6px' }}>
            <span style={{ color: 'var(--ng-muted)' }}>Subtotal</span>
            <span style={{ fontWeight: 500 }}>{formatPrice(subtotal)}</span>
          </div>
          <div style={{ ...summaryRow, padding: '6px 0' }}>
            <span style={{ color: 'var(--ng-muted)' }}>Shipping</span>
            <span>{shipping ? formatPrice(shipping) : 'Complimentary'}</span>
          </div>
          <div
            style={{
              ...summaryRow,
              padding: '16px 0 4px',
              borderTop: '1px solid var(--ng-rule)',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
