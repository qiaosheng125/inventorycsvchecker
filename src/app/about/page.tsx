export const metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <main className="plainPage">
      <section>
        <p className="eyebrow">ABOUT</p>
        <h1>About Shopify Inventory CSV Checker</h1>
        <p>
          Shopify Inventory CSV Checker is a small browser-based tool for
          merchants who edit inventory exports in spreadsheets and want a quick
          pre-import risk report.
        </p>
        <p>
          The first version focuses on SKU, Location, On hand current/new,
          duplicate rows, missing rows, new rows, and large stock changes. It is
          not a Shopify app, not an official Shopify product, and not an
          inventory sync system.
        </p>
      </section>
    </main>
  );
}
