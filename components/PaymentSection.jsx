/**
 * Payment section — the bordered PAYMENT slot on both checkout screens
 * (`/checkout` and `/checkouts`).
 *
 * ════════════════════════════════════════════════════════════════════════
 *  PAYMENT GATEWAY INTEGRATION POINT: mount provider element here;
 *  see README §Payments
 * ════════════════════════════════════════════════════════════════════════
 *
 * This is a deliberate STUB. The storefront takes orders without collecting
 * card details — the client is finalising their own payment provider and will
 * integrate it here later. Nothing in the purchase flow talks to a gateway:
 * "PLACE ORDER" / "PAY" run the full form validation and then complete the
 * order, and no card data is collected, stored, or transmitted anywhere.
 *
 * ── How to wire a real gateway ──────────────────────────────────────────
 * 1. Render the provider's element inside <div id={id}> below (it is the
 *    mount target, and is why the id is a prop): Stripe Payment Element,
 *    Square card, Adyen drop-in, PayPal, etc. Both callers pass a distinct
 *    id — `payment-element` on /checkout, `payment-element-hosted` on
 *    /checkouts — so a provider SDK can mount two instances on one site
 *    without colliding.
 * 2. Replace <PendingNote /> with the mounted element (the note is the only
 *    thing that has to go; the box, label, and spacing are the final design).
 * 3. Give the section a way to report readiness/errors upward — e.g. accept
 *    `onReady` / `onError` props, or expose a `confirmPayment()` handle via
 *    ref — and have the page's submit handler await confirmation BEFORE it
 *    builds the order snapshot. The validation the pages already run
 *    (email → name → address → consent) should stay in front of it.
 * 4. Both pages need an authoritative amount at that point:
 *      /checkout   — total = cart subtotal + delivery (computed in the page)
 *      /checkouts  — the `amount` query param (authoritative per the handoff)
 *    A production integration must re-derive/verify that amount server-side
 *    rather than trusting the client.
 * 5. Update the payment-processor sentences in app/terms/page.jsx and
 *    app/privacy/page.jsx (both carry a `PAYMENT PROCESSOR — update when
 *    gateway chosen` comment) and the README §Payments section.
 *
 * Static export note: this site builds with `output: 'export'` and has no API
 * routes, so any gateway needing a server (payment intents, webhooks) also
 * needs a hosting change — a function/route handler alongside the static site.
 */

/** The quiet placeholder that occupies the payment box until a gateway lands. */
function PendingNote() {
  return (
    <div
      style={{
        fontSize: 'var(--ng-t-11)',
        lineHeight: 1.7,
        color: 'var(--ng-muted)',
        fontWeight: 300,
        letterSpacing: '.04em',
      }}
    >
      Payment details are collected at dispatch — our payment provider
      integration is being finalized.
    </div>
  );
}

export default function PaymentSection({
  id = 'payment-element',
  label = 'PAYMENT',
  style,
}) {
  return (
    <div style={{ marginTop: 30, ...style }}>
      <div
        style={{
          fontSize: 'var(--ng-t-95)',
          letterSpacing: 'var(--ng-ls-eyebrow)',
          color: 'var(--ng-muted)',
          fontWeight: 500,
          marginBottom: 14,
        }}
      >
        {label}
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          PAYMENT GATEWAY INTEGRATION POINT: mount provider element here;
          see README §Payments
          ───────────────────────────────────────────────────────────────── */}
      <div
        id={id}
        style={{
          border: '1px solid var(--ng-rule-input)',
          padding: 20,
        }}
      >
        <PendingNote />
      </div>
    </div>
  );
}
