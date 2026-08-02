/**
 * Announcement bar — full-width ink strip above the header.
 * Shown on every page except the minimal-chrome routes (see SiteChrome).
 */
export default function AnnouncementBar() {
  return (
    <div
      style={{
        background: 'var(--ng-ink)',
        color: 'var(--ng-bg)',
        textAlign: 'center',
        padding: '11px 20px',
        fontSize: 'var(--ng-t-10)',
        letterSpacing: 'var(--ng-ls-announce)',
        fontWeight: 500,
      }}
    >
      COMPLIMENTARY SHIPPING ON EVERY ORDER
    </div>
  );
}
