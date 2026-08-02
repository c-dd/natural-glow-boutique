/**
 * Privacy Policy — copy lifted verbatim from the prototype
 * ("Natural Glow Site.dc.html", the `isPrivacy` screen), except for the
 * payment-processor references (intro, §1, §3, §5): the prototype named
 * Stripe, which this build does not use. Those are neutral placeholders,
 * flagged inline.
 */

import { LegalBody, LegalHeading, LegalPage } from '@/components/Legal';

export const metadata = {
  title: 'Privacy Policy — Natural Glow Boutique',
  description:
    'How Natural Glow Boutique collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      {/* PAYMENT PROCESSOR — update when gateway chosen (final clause). */}
      <LegalBody lead>
        This policy explains what information Natural Glow Boutique collects
        when you use naturalglowboutique.com, how we use it, and the choices you
        have. The short version: we collect only what we need to fulfill your
        order, we never sell your information, and your card details go directly
        to our payment provider — never to us.
      </LegalBody>

      <LegalHeading>1. Information We Collect</LegalHeading>
      {/* PAYMENT PROCESSOR — update when gateway chosen (second sentence). */}
      <LegalBody>
        When you place an order we collect your name, email address, shipping
        address, phone number (if provided), and the details of your order.
        Payment card information is collected directly by our payment provider
        through their secure payment form — it never touches our servers, and we
        cannot see your full card number.
      </LegalBody>

      <LegalHeading>2. How We Use It</LegalHeading>
      <LegalBody>
        We use your information to process and ship your order, send order
        confirmations and tracking updates, respond to support requests, and
        meet our legal obligations (such as tax records). We send marketing
        email only if you explicitly opt in, and every marketing email includes
        an unsubscribe link.
      </LegalBody>

      <LegalHeading>3. Payment Processing</LegalHeading>
      {/* PAYMENT PROCESSOR — update when gateway chosen (whole section). */}
      <LegalBody>
        Payments are processed securely by our payment provider, a PCI-DSS
        compliant payment processor. Their handling of your payment data is
        governed by their own privacy policy.
      </LegalBody>

      <LegalHeading>4. Cookies &amp; Local Storage</LegalHeading>
      <LegalBody>
        Your shopping cart is stored locally in your own browser so it’s still
        there when you return. We use only essential storage needed for the Site
        to function — no advertising trackers, no third-party analytics cookies.
      </LegalBody>

      <LegalHeading>5. Sharing</LegalHeading>
      {/* PAYMENT PROCESSOR — update when gateway chosen (first sentence). */}
      <LegalBody>
        We share your information only with the partners needed to complete your
        order: shipping carriers receive your name and address, and our payment
        provider processes your payment. We do not sell or rent personal
        information to anyone. We may disclose information if required by law.
      </LegalBody>

      <LegalHeading>6. Retention</LegalHeading>
      <LegalBody>
        We keep order records for as long as required for tax and accounting
        purposes, then delete or anonymize them.
      </LegalBody>

      <LegalHeading>7. Your Rights</LegalHeading>
      <LegalBody>
        You may request a copy of the personal information we hold about you,
        ask us to correct it, or ask us to delete it (subject to legal
        record-keeping requirements) by emailing
        hello@naturalglowboutique.com. Depending on where you live, you may have
        additional rights under laws such as the GDPR or CCPA/CPRA — we honor
        those requests regardless of where you’re writing from.
      </LegalBody>

      <LegalHeading>8. Children</LegalHeading>
      <LegalBody>
        The Site is not directed to children under 13, and we do not knowingly
        collect their information.
      </LegalBody>

      <LegalHeading>9. Changes &amp; Contact</LegalHeading>
      <LegalBody>
        If we change this policy, we’ll post the updated version here with a new
        date. Questions or requests: hello@naturalglowboutique.com.
      </LegalBody>
    </LegalPage>
  );
}
