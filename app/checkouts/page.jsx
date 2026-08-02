'use client';

/**
 * Hosted checkout (`/checkouts`) — handoff README §Hosted checkout.
 *
 * The external site sends customers here to pay, passing the order in the
 * query string. This page NEVER touches the store cart (no useCart) and gets
 * its stripped-down chrome automatically — `/checkouts` is registered in
 * components/SiteChrome.jsx.
 *
 * ── Inbound URL contract ────────────────────────────────────────────────
 *   amount      required, decimal — the authoritative amount to charge
 *   ref         order reference; falls back to a generated NG-XXXXXX
 *   items       display-only "name:qty:price" list, comma-separated, encoded
 *   email name address city state zip    optional prefill
 *   return_url  http(s) ONLY — anything else (javascript:, data:, //host) is
 *               dropped, and the customer gets the "close this page" line
 *               instead of a RETURN TO STORE button
 *
 *   /checkouts?amount=146.00&ref=NG-EXT-0001
 *     &items=Glow%20Face%20Serum:1:72,Calm%20%2B%20Unwind%20Candle:1:74
 *     &email=jane@example.com&name=Jane&return_url=https://yoursite.com/thank-you
 *
 * Missing/invalid `amount` → the TEST ORDER badge and the spec's sample order.
 * (In production, redirecting to `/` instead is the README's preference.)
 *
 * The query is read from `window.location.search` in an effect — never
 * `useSearchParams`, which forces a client bailout under `output: 'export'`.
 *
 * PAYMENT is <PaymentSection /> — a stub. "PAY" validates the form in full and
 * then shows the success state; no payment is processed and no card details
 * are collected. See components/PaymentSection.jsx for the integration point.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PaymentSection from '@/components/PaymentSection';
import { formatPrice } from '@/lib/products';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shown when no usable order arrives — matches the prototype's sample. */
const SAMPLE_ORDER = {
  live: false,
  amount: 146,
  ref: 'NG-EXT-0001',
  items: [
    { name: 'Glow Face Serum', qty: 1, price: 72 },
    { name: 'Calm + Unwind Candle', qty: 1, price: 74 },
  ],
  returnUrl: '',
};

const EMPTY_PREFILL = {
  email: '',
  first: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

/** `return_url` is only honoured for http(s) — never javascript:/data:/etc. */
function safeReturnUrl(raw) {
  const value = (raw || '').trim();
  // Absolute http(s) only — this drops javascript:, data:, mailto:,
  // scheme-relative //host, and anything relative.
  if (!/^https?:\/\//i.test(value)) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? value : '';
  } catch {
    return '';
  }
}

/** "name:qty:price" pairs → display-only line items. */
function parseItems(raw) {
  return (raw || '')
    .split(',')
    .filter(Boolean)
    .map((entry) => {
      const parts = entry.split(':');
      return {
        name: (parts[0] || 'Item').slice(0, 120),
        qty: parseInt(parts[1], 10) || 1,
        price: parseFloat(parts[2]) || 0,
      };
    });
}

function parseQuery(search) {
  const q = new URLSearchParams(search);

  const prefill = {
    email: q.get('email') || '',
    // The contract passes a single `name`; the prototype drops it in "First".
    first: q.get('name') || '',
    address: q.get('address') || '',
    city: q.get('city') || '',
    state: q.get('state') || '',
    zip: q.get('zip') || '',
  };

  const rawAmount = (q.get('amount') || '').trim();
  const amount = rawAmount === '' ? NaN : Number(rawAmount);

  // No usable amount → test mode with the sample order (prefill still applies).
  if (!Number.isFinite(amount) || amount < 0) {
    return { order: SAMPLE_ORDER, prefill };
  }

  return {
    order: {
      live: true,
      amount,
      ref: (q.get('ref') || `NG-${String(Date.now()).slice(-6)}`).slice(0, 64),
      items: parseItems(q.get('items')),
      returnUrl: safeReturnUrl(q.get('return_url')),
    },
    prefill,
  };
}

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

const focusCss = `
  .ng-field:focus { border-color: var(--ng-ink); }
`;

export default function HostedCheckoutPage() {
  const [state, setState] = useState(null); // { order, prefill } once parsed
  const [error, setError] = useState('');
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    try {
      setState(parseQuery(window.location.search));
    } catch {
      setState({ order: SAMPLE_ORDER, prefill: EMPTY_PREFILL });
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key) => String(data.get(key) ?? '').trim();

    // Same order as /checkout: email → name → address → consent.
    if (!EMAIL_RE.test(value('email'))) {
      return setError('Please enter a valid email address.');
    }
    if (!value('first')) {
      return setError('Please enter your name.');
    }
    if (!value('address') || !value('city') || !value('state') || !value('zip')) {
      return setError('Please complete your shipping address.');
    }
    if (!data.get('agree')) {
      return setError(
        'Please agree to the Terms of Service and Refund Policy to continue.'
      );
    }

    /* NO PAYMENT IS TAKEN HERE — the success state is shown on validation
       alone. A real gateway confirms the charge for `order.amount` at this
       point; see components/PaymentSection.jsx. */
    setError('');
    setPaid(true);
    try {
      window.scrollTo(0, 0);
    } catch {
      /* non-browser environment */
    }
  }

  // Nothing until the query has been read (one effect tick).
  if (!state) return <div style={{ minHeight: 520 }} />;

  const { order, prefill } = state;
  const amountFmt = formatPrice(order.amount);
  const returnHref = order.returnUrl
    ? `${order.returnUrl}${order.returnUrl.includes('?') ? '&' : '?'}status=paid&ref=${encodeURIComponent(order.ref)}`
    : '';

  return (
    <div style={{ padding: '52px var(--ng-gutter) 96px' }}>
      <style>{focusCss}</style>
      <div style={{ maxWidth: 'var(--ng-max-checkout)', margin: '0 auto' }}>
        {!order.live && (
          <div
            style={{
              display: 'inline-block',
              border: '1px solid var(--ng-rule-crumb)',
              padding: '9px 16px',
              fontSize: 'var(--ng-t-10)',
              letterSpacing: 'var(--ng-ls-nav)',
              color: 'var(--ng-muted)',
              marginBottom: 28,
            }}
          >
            TEST ORDER — no live data received. Your other site passes orders
            via /checkouts?amount=…
          </div>
        )}

        {paid ? (
          <div
            style={{
              maxWidth: 560,
              margin: '0 auto',
              textAlign: 'center',
              padding: '48px 0 20px',
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
              ORDER {order.ref}
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
              Payment received.
            </h1>
            <div
              style={{
                fontSize: 'var(--ng-t-135)',
                color: 'var(--ng-muted)',
                fontWeight: 300,
                marginTop: 14,
                lineHeight: 1.8,
              }}
            >
              Thank you — your order is confirmed for {amountFmt}. A receipt is
              on its way to your email, and we&#39;ll send tracking as soon as
              it ships.
            </div>
            {returnHref ? (
              <a
                href={returnHref}
                className="ng-btn"
                style={{
                  padding: '15px 36px',
                  fontSize: 'var(--ng-t-105)',
                  letterSpacing: 'var(--ng-ls-btn)',
                  fontWeight: 500,
                  marginTop: 32,
                }}
              >
                RETURN TO STORE
              </a>
            ) : (
              <div
                style={{
                  fontSize: 'var(--ng-t-115)',
                  color: 'var(--ng-muted)',
                  fontWeight: 300,
                  marginTop: 32,
                }}
              >
                You can safely close this page.
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
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
              <div
                style={{
                  fontSize: 'var(--ng-t-125)',
                  color: 'var(--ng-muted)',
                  fontWeight: 300,
                  marginTop: 8,
                }}
              >
                Completing order{' '}
                <span style={{ color: 'var(--ng-ink)', fontWeight: 400 }}>
                  {order.ref}
                </span>
              </div>

              <div style={{ marginTop: 32 }}>
                <div style={sectionLabel}>CONTACT</div>
                <input
                  className="ng-field"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email address"
                  defaultValue={prefill.email}
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
                    defaultValue={prefill.first}
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
                    defaultValue={prefill.address}
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
                    defaultValue={prefill.city}
                    style={inputStyle}
                  />
                  <input
                    className="ng-field"
                    name="state"
                    autoComplete="address-level1"
                    placeholder="State"
                    defaultValue={prefill.state}
                    style={inputStyle}
                  />
                  <input
                    className="ng-field"
                    name="zip"
                    autoComplete="postal-code"
                    placeholder="ZIP"
                    defaultValue={prefill.zip}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* PAYMENT GATEWAY INTEGRATION POINT — see PaymentSection.jsx */}
              <PaymentSection id="payment-element-hosted" />

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
                    style={{
                      borderBottom: '1px solid var(--ng-rule-link-strong)',
                    }}
                  >
                    Terms of Service &amp; Refund Policy
                  </Link>{' '}
                  and the{' '}
                  <Link
                    href="/privacy"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      borderBottom: '1px solid var(--ng-rule-link-strong)',
                    }}
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
                PAY {amountFmt}
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
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
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
                <div
                  style={{
                    fontSize: 'var(--ng-t-105)',
                    color: 'var(--ng-muted)',
                  }}
                >
                  {order.ref}
                </div>
              </div>

              {order.items.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      style={{
                        display: 'flex',
                        gap: 14,
                        alignItems: 'center',
                        padding: '14px 0',
                        borderBottom: '1px solid rgba(28, 27, 24, .1)',
                      }}
                    >
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
                        style={{
                          fontSize: 'var(--ng-t-125)',
                          fontWeight: 500,
                        }}
                      >
                        {formatPrice(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ ...summaryRow, padding: '18px 0 6px' }}>
                <span style={{ color: 'var(--ng-muted)' }}>Shipping</span>
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
                  ...summaryRow,
                  padding: '16px 0 4px',
                  borderTop: '1px solid var(--ng-rule)',
                  marginTop: 12,
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                <span>Amount due</span>
                <span>{amountFmt}</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
