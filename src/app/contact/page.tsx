export const metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <main className="plainPage">
      <section>
        <p className="eyebrow">CONTACT</p>
        <h1>Contact</h1>
        <p>
          For feedback about the checker, report the issue type, the column
          names in your CSV, and what result you expected. Do not send real store
          inventory unless you intentionally remove sensitive data first.
        </p>
        <p>
          Email:{" "}
          <a href="mailto:support@inventorycsvchecker.com">
            support@inventorycsvchecker.com
          </a>
        </p>
      </section>
    </main>
  );
}
