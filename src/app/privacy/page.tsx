export const metadata = {
  title: "Privacy"
};

export default function PrivacyPage() {
  return (
    <main className="plainPage">
      <section>
        <p className="eyebrow">PRIVACY</p>
        <h1>Privacy</h1>
        <p>
          The checker is designed to process CSV text in your browser. The first
          version does not upload inventory CSV content to a server, does not
          connect to Shopify, and does not request Shopify OAuth access.
        </p>
        <p>
          If analytics IDs are configured, analytics may collect basic page usage
          data such as page views and interaction events. CSV file contents are
          not intentionally sent to analytics.
        </p>
      </section>
    </main>
  );
}
