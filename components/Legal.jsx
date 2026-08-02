/**
 * Legal page frame + type primitives (handoff README §Terms & Privacy).
 * Single column, max 680px; eyebrow LEGAL, Cormorant 42px title, dated rule,
 * Cormorant 21px/600 section headings, 13.5px/1.85 body.
 */

export const LAST_UPDATED = 'Last updated: August 1, 2026';

export function LegalPage({ title, children }) {
  return (
    <div style={{ padding: '64px var(--ng-gutter) 100px' }}>
      <div style={{ maxWidth: 'var(--ng-max-legal)', margin: '0 auto' }}>
        <div
          style={{
            fontSize: 'var(--ng-t-10)',
            letterSpacing: 'var(--ng-ls-legal)',
            color: 'var(--ng-muted)',
            fontWeight: 500,
          }}
        >
          LEGAL
        </div>
        <h1
          style={{
            fontFamily: 'var(--ng-font-display)',
            fontSize: 'var(--ng-d-42)',
            fontWeight: 500,
            margin: '14px 0 0',
          }}
        >
          {title}
        </h1>
        <div
          style={{
            fontSize: 'var(--ng-t-115)',
            color: 'var(--ng-muted)',
            marginTop: 10,
            paddingBottom: 28,
            borderBottom: '1px solid var(--ng-rule)',
          }}
        >
          {LAST_UPDATED}
        </div>
        {children}
      </div>
    </div>
  );
}

/** Section heading. `first` uses the slightly larger 36px top margin. */
export function LegalHeading({ children, first = false }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--ng-font-display)',
        fontSize: 'var(--ng-d-21)',
        fontWeight: 600,
        margin: `${first ? 36 : 32}px 0 0`,
      }}
    >
      {children}
    </h2>
  );
}

/** Body paragraph. `lead` is the standalone intro paragraph (32px top). */
export function LegalBody({ children, lead = false }) {
  return (
    <p
      style={{
        fontSize: 'var(--ng-t-135)',
        lineHeight: 1.85,
        color: 'var(--ng-body-legal)',
        fontWeight: 300,
        margin: `${lead ? 32 : 10}px 0 0`,
      }}
    >
      {children}
    </p>
  );
}

/** Inline emphasis used inside the refund policy. */
export function LegalStrong({ children }) {
  return (
    <strong style={{ fontWeight: 500, color: 'var(--ng-ink)' }}>{children}</strong>
  );
}

/** † FDA footnote that closes the Terms page. */
export function LegalFootnote({ children }) {
  return (
    <div
      style={{
        fontSize: 'var(--ng-t-11)',
        lineHeight: 1.8,
        color: 'var(--ng-muted)',
        fontWeight: 300,
        marginTop: 36,
        paddingTop: 22,
        borderTop: '1px solid var(--ng-rule)',
      }}
    >
      {children}
    </div>
  );
}
