const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

async function assertOk(path, expectedText) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  const text = await response.text();
  if (expectedText && !text.includes(expectedText)) {
    throw new Error(`${path} did not include expected text: ${expectedText}`);
  }
  return text;
}

async function main() {
  const homepage = await assertOk("/", "Shopify Inventory CSV Checker");
  const checks = [
    "Check stock import risks before CSV upload.",
    "On hand (current)",
    "On hand (new)",
    "Download CSV report",
    "Download change report",
    "Quantity changes by SKU and Location",
    "Not affiliated with Shopify",
    "Files stay in your browser"
  ];

  for (const check of checks) {
    if (!homepage.includes(check)) {
      throw new Error(`Homepage missing: ${check}`);
    }
  }

  await assertOk("/about", "About Shopify Inventory CSV Checker");
  await assertOk("/contact", "Contact");
  await assertOk("/privacy", "Privacy");
  await assertOk("/robots.txt", "https://www.inventorycsvchecker.com/sitemap.xml");
  await assertOk("/sitemap.xml", "https://www.inventorycsvchecker.com/");

  console.log("Smoke check passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
