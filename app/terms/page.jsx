/**
 * Terms of Service — copy lifted verbatim from the prototype
 * ("Natural Glow Site.dc.html", the `isTerms` screen), with the sole exception
 * of the payment-processor sentences in §3: the prototype named Stripe, which
 * this build does not use. Those are neutral placeholders, flagged inline.
 */

import {
  LegalBody,
  LegalHeading,
  LegalPage,
  LegalStrong,
} from '@/components/Legal';

export const metadata = {
  title: 'Terms of Service — Natural Glow Boutique',
  description:
    'Terms of Service for Natural Glow Boutique, including our shipping timelines and refund policy.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <LegalHeading first>1. Agreement to these Terms</LegalHeading>
      <LegalBody>
        These Terms of Service govern your use of naturalglowboutique.com (the
        “Site”) and your purchase of products from Natural Glow Boutique (“we,”
        “us,” “our”). By using the Site or placing an order, you agree to these
        Terms. If you do not agree, please do not use the Site.
      </LegalBody>

      <LegalHeading>2. Products</LegalHeading>
      <LegalBody>
        Our products are made by hand in small batches, so color, texture, and
        scent may vary slightly between batches. Full ingredient lists are
        published on each product page — please review them carefully before use
        if you have allergies or sensitivities, and discontinue use if
        irritation occurs.
      </LegalBody>

      <LegalHeading>3. Pricing &amp; Payment</LegalHeading>
      {/* PAYMENT PROCESSOR — update when gateway chosen.
          The prototype named Stripe in the first and third sentences below;
          both are neutral placeholders until the gateway is selected. */}
      <LegalBody>
        All prices are listed in U.S. dollars and may change at any time before
        an order is placed. Payments are processed securely by our payment
        provider. We never see or store your full card details. By submitting an
        order, you authorize us (via our payment provider) to charge your
        selected payment method for the order total, including shipping and
        applicable taxes.
      </LegalBody>

      <LegalHeading>4. Shipping</LegalHeading>
      <LegalBody>
        Orders are blended, packed, and shipped within 2–3 business days.
        Standard shipping is complimentary on every order; express options are
        available at checkout. You will receive a tracking link by email the
        moment your order ships. We are not responsible for carrier delays, but
        the timelines in Section 5 protect you if a package goes missing.
      </LegalBody>

      <LegalHeading>5. Refunds &amp; Cancellations</LegalHeading>
      <LegalBody>
        You may cancel an order for a full refund to your original payment
        method at any time <em>before it ships</em>. Because our products are
        personal-care goods made in small batches,{' '}
        <LegalStrong>
          once an order has shipped it is no longer eligible for a refund
        </LegalStrong>{' '}
        — all shipped sales are final.
      </LegalBody>
      <LegalBody>
        If tracking shows your order has not arrived, contact us at
        hello@naturalglowboutique.com within 20 days of the ship date.{' '}
        <LegalStrong>
          An order is considered delivered 20 days after its ship date
        </LegalStrong>
        ; after that point no refund, credit, or reshipment can be issued.
      </LegalBody>

      <LegalHeading>6. Damaged or Incorrect Items</LegalHeading>
      <LegalBody>
        If your order arrives damaged or we sent the wrong item, email us within
        7 days of delivery with your order number and photos. We will send a
        replacement at no cost. Replacements are provided in lieu of refunds.
      </LegalBody>

      <LegalHeading>7. Intellectual Property</LegalHeading>
      <LegalBody>
        All content on the Site — including the Natural Glow Boutique name,
        logo, product names, photography, and copy — is our property and may not
        be reproduced or used without our written permission.
      </LegalBody>

      <LegalHeading>8. Acceptable Use</LegalHeading>
      <LegalBody>
        You agree not to use the Site for any unlawful purpose, to interfere
        with its operation, or to attempt to access systems or data not intended
        for you.
      </LegalBody>

      <LegalHeading>9. Disclaimer &amp; Limitation of Liability</LegalHeading>
      <LegalBody>
        The Site and our products are provided “as is.” To the fullest extent
        permitted by law, our total liability for any claim arising from an
        order is limited to the amount you paid for that order. Nothing in these
        Terms limits rights that cannot be limited under applicable law.
      </LegalBody>

      <LegalHeading>10. Changes &amp; Contact</LegalHeading>
      <LegalBody>
        We may update these Terms from time to time; the version posted here
        applies to your order. Questions? Write to us at
        hello@naturalglowboutique.com.
      </LegalBody>
    </LegalPage>
  );
}
