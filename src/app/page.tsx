"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Papa from "papaparse";
import { trackEvent } from "./analytics";

type Severity = "critical" | "warning" | "info";

type CsvData = {
  headers: string[];
  rows: Record<string, string>[];
  errors: string[];
};

type FieldMap = {
  sku?: string;
  location?: string;
  current?: string;
  next?: string;
  handle?: string;
  title?: string;
  binName?: string;
};

type Issue = {
  severity: Severity;
  row: number | "-";
  sku: string;
  location: string;
  issue: string;
  fix: string;
};

type ChangeRow = {
  sku: string;
  location: string;
  oldCurrent: string;
  newCurrent: string;
  newQuantity: string;
  delta: string;
};

const oldSample = `SKU,Location,On hand (current),On hand (new),Title
TSHIRT-BLACK-S,Main Warehouse,120,,Black T-Shirt Small
TSHIRT-BLACK-M,Main Warehouse,80,,Black T-Shirt Medium
MUG-WHITE,Main Warehouse,45,,White Mug
MUG-WHITE,Retail Store,18,,White Mug`;

const newSample = `SKU,Location,On hand (current),On hand (new),Title
TSHIRT-BLACK-S,Main Warehouse,120,95,Black T-Shirt Small
TSHIRT-BLACK-M,Main Warehouse,70,70,Black T-Shirt Medium
MUG-WHITE,Main Warehouse,45,0,White Mug
MUG-WHITE,Retail Store,18,18,White Mug
MUG-WHITE,Retail Store,18,20,White Mug
NEW-HAT,Main Warehouse,,30,New Hat`;

const aliases = {
  sku: ["sku", "variant sku"],
  location: ["location", "location name"],
  current: ["on hand (current)", "on hand current", "on hand"],
  next: ["on hand (new)", "on hand new", "new on hand"],
  handle: ["handle"],
  title: ["title", "product title"],
  binName: ["bin name", "bin"]
};

function parseCsv(input: string): CsvData {
  if (!input.trim()) {
    return { headers: [], rows: [], errors: ["CSV is empty."] };
  }

  const parsed = Papa.parse<Record<string, string>>(input, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim()
  });

  const headers = parsed.meta.fields ?? [];
  const errors = parsed.errors.map((error) =>
    error.row !== undefined
      ? `Row ${error.row + 2}: ${error.message}`
      : error.message
  );

  const duplicateHeaders = headers.filter(
    (header, index) => headers.indexOf(header) !== index
  );
  if (duplicateHeaders.length > 0) {
    errors.push(`Duplicate headers: ${Array.from(new Set(duplicateHeaders)).join(", ")}`);
  }

  return { headers, rows: parsed.data, errors };
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function findHeader(headers: string[], options: string[]): string | undefined {
  return headers.find((header) => options.includes(normalize(header)));
}

function getFieldMap(headers: string[]): FieldMap {
  return {
    sku: findHeader(headers, aliases.sku),
    location: findHeader(headers, aliases.location),
    current: findHeader(headers, aliases.current),
    next: findHeader(headers, aliases.next),
    handle: findHeader(headers, aliases.handle),
    title: findHeader(headers, aliases.title),
    binName: findHeader(headers, aliases.binName)
  };
}

function keyFor(row: Record<string, string>, map: FieldMap): string {
  const sku = map.sku ? row[map.sku] : "";
  const location = map.location ? row[map.location] : "";
  return `${normalize(sku)}::${normalize(location)}`;
}

function getNumber(value: string): number | null {
  if (!/^-?\d+$/.test(value.trim())) {
    return null;
  }
  return Number(value.trim());
}

function toCsvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function analyze(oldText: string, newText: string) {
  const oldCsv = parseCsv(oldText);
  const newCsv = parseCsv(newText);
  const oldMap = getFieldMap(oldCsv.headers);
  const newMap = getFieldMap(newCsv.headers);
  const issues: Issue[] = [];
  const changes: ChangeRow[] = [];

  const addIssue = (
    severity: Severity,
    row: number | "-",
    sku: string,
    location: string,
    issue: string,
    fix: string
  ) => {
    issues.push({ severity, row, sku, location, issue, fix });
  };

  for (const error of oldCsv.errors) {
    addIssue("critical", "-", "-", "-", `Original CSV: ${error}`, "Export the original Shopify inventory CSV again.");
  }
  for (const error of newCsv.errors) {
    addIssue("critical", "-", "-", "-", `Edited CSV: ${error}`, "Fix the CSV structure before importing.");
  }

  const required: Array<[keyof FieldMap, string]> = [
    ["sku", "SKU"],
    ["location", "Location"],
    ["current", "On hand (current)"],
    ["next", "On hand (new)"]
  ];

  for (const [key, label] of required) {
    if (!newMap[key]) {
      addIssue("critical", "-", "-", "-", `Edited CSV is missing ${label}.`, `Add a ${label} column using Shopify's inventory CSV export format.`);
    }
  }

  if (!oldMap.sku || !oldMap.location || !oldMap.current) {
    addIssue(
      "warning",
      "-",
      "-",
      "-",
      "Original CSV is missing SKU, Location, or On hand (current).",
      "Upload the original All states inventory export so the checker can compare current quantities."
    );
  }

  const oldByKey = new Map<string, Record<string, string>>();
  oldCsv.rows.forEach((row) => {
    if (oldMap.sku && oldMap.location) {
      oldByKey.set(keyFor(row, oldMap), row);
    }
  });

  const seen = new Map<string, number>();

  newCsv.rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const sku = newMap.sku ? row[newMap.sku] : "";
    const location = newMap.location ? row[newMap.location] : "";
    const current = newMap.current ? row[newMap.current] : "";
    const next = newMap.next ? row[newMap.next] : "";
    const key = keyFor(row, newMap);
    const oldRow = oldByKey.get(key);
    const oldCurrent = oldRow && oldMap.current ? oldRow[oldMap.current] : "";

    if (!sku) {
      addIssue("critical", rowNumber, "-", location || "-", "SKU is empty.", "Fill SKU or remove this row before import.");
    }
    if (!location) {
      addIssue("critical", rowNumber, sku || "-", "-", "Location is empty.", "Use the exact Shopify inventory location name.");
    }
    if (sku && location) {
      const existing = seen.get(key);
      if (existing) {
        addIssue(
          "critical",
          rowNumber,
          sku,
          location,
          `Duplicate SKU + Location also appears on row ${existing}.`,
          "Keep only one row per SKU and Location before importing."
        );
      } else {
        seen.set(key, rowNumber);
      }
    }

    if (next === "") {
      addIssue("warning", rowNumber, sku || "-", location || "-", "On hand (new) is blank.", "Enter the target quantity or remove the row.");
    } else if (getNumber(next) === null) {
      addIssue("critical", rowNumber, sku || "-", location || "-", "On hand (new) is not a whole number.", "Use a whole number such as 0, 12, or 120.");
    } else if (Number(next) < 0) {
      addIssue("critical", rowNumber, sku || "-", location || "-", "On hand (new) is negative.", "Shopify inventory quantity should not be negative for this import.");
    }

    if (current === "" && next !== "") {
      addIssue(
        "warning",
        rowNumber,
        sku || "-",
        location || "-",
        "On hand (current) is blank while On hand (new) has a value.",
        "Do not clear On hand (current) unless you intentionally want to skip overwrite protection."
      );
    }

    if (!oldRow && sku && location) {
      addIssue(
        "warning",
        rowNumber,
        sku,
        location,
        "This SKU + Location is not in the original CSV.",
        "Confirm that this is a new inventory row and that the Location name is exact."
      );
    }

    if (oldRow && current && oldCurrent && current !== oldCurrent) {
      addIssue(
        "critical",
        rowNumber,
        sku || "-",
        location || "-",
        `On hand (current) changed from ${oldCurrent} to ${current}.`,
        "Use a fresh Shopify export or restore the original current quantity before import."
      );
    }

    const oldQty = getNumber(oldCurrent);
    const newQty = getNumber(next);
    if (oldQty !== null && newQty !== null) {
      const delta = newQty - oldQty;
      changes.push({
        sku: sku || "-",
        location: location || "-",
        oldCurrent,
        newCurrent: current,
        newQuantity: next,
        delta: String(delta)
      });

      if (oldQty > 20 && Math.abs(delta) / oldQty > 0.8) {
        addIssue(
          "warning",
          rowNumber,
          sku || "-",
          location || "-",
          `Large quantity change from ${oldQty} to ${newQty}.`,
          "Double-check this change before importing, especially if it sets stock close to zero."
        );
      }
    }
  });

  oldByKey.forEach((oldRow, key) => {
    if (!seen.has(key)) {
      const sku = oldMap.sku ? oldRow[oldMap.sku] : "-";
      const location = oldMap.location ? oldRow[oldMap.location] : "-";
      addIssue(
        "warning",
        "-",
        sku,
        location,
        "Original CSV row is missing from the edited CSV.",
        "Confirm that removing this row is intentional."
      );
    }
  });

  return { oldCsv, newCsv, oldMap, newMap, issues, changes };
}

function buildReportCsv(issues: Issue[]): string {
  const header = ["severity", "row", "sku", "location", "issue", "suggested_fix"];
  const rows = issues.map((issue) => [
    issue.severity,
    issue.row,
    issue.sku,
    issue.location,
    issue.issue,
    issue.fix
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => toCsvCell(cell)).join(","))
    .join("\n");
}

function buildChangeCsv(changes: ChangeRow[]): string {
  const header = [
    "sku",
    "location",
    "old_current_quantity",
    "new_current_quantity",
    "new_target_quantity",
    "delta"
  ];
  const rows = changes.map((change) => [
    change.sku,
    change.location,
    change.oldCurrent,
    change.newCurrent,
    change.newQuantity,
    change.delta
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => toCsvCell(cell)).join(","))
    .join("\n");
}

function buildAiPrompt(issues: Issue[]): string {
  return `Please help me fix a Shopify inventory CSV before import.

Context:
- This is a Shopify inventory CSV, not a product CSV.
- Pay special attention to SKU, Location, On hand (current), and On hand (new).
- Do not suggest clearing On hand (current) unless skipping overwrite protection is intentional.

Detected issues:
${issues.slice(0, 80).map((issue) => `- ${issue.severity.toUpperCase()} row ${issue.row}: ${issue.issue} Fix: ${issue.fix}`).join("\n") || "- No issues detected."}

Return a concise repair plan and warn me about any stock overwrite risk.`;
}

function downloadText(filename: string, content: string, eventName: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  trackEvent(eventName);
}

function Brand() {
  return (
    <a className="brand" href="/">
      <span className="brandMark" />
      <span>Inventory CSV Checker</span>
    </a>
  );
}

export default function Home() {
  const [oldText, setOldText] = useState(oldSample);
  const [newText, setNewText] = useState(newSample);
  const [copied, setCopied] = useState("");
  const result = useMemo(() => analyze(oldText, newText), [oldText, newText]);
  const critical = result.issues.filter((issue) => issue.severity === "critical");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");
  const newRows = result.issues.filter((issue) => issue.issue.includes("not in the original")).length;
  const missingRows = result.issues.filter((issue) => issue.issue.includes("missing from the edited")).length;
  const reportCsv = buildReportCsv(result.issues);
  const changeCsv = buildChangeCsv(result.changes);
  const aiPrompt = buildAiPrompt(result.issues);

  function copy(value: string, label: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(`${label} copied.`);
      trackEvent("copy_ai_fix_prompt");
      window.setTimeout(() => setCopied(""), 1800);
    });
  }

  function onFile(
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
    eventName: string
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setter(String(reader.result ?? ""));
      trackEvent(eventName, {
        file_size_bucket: file.size < 1024 * 100 ? "under_100kb" : "over_100kb"
      });
    };
    reader.readAsText(file);
  }

  return (
    <main>
      <header className="siteHeader">
        <nav className="nav">
          <Brand />
          <div className="navLinks">
            <a href="#checker">Checker</a>
            <a href="#guide">Guide</a>
            <a href="#faq">FAQ</a>
          </div>
        </nav>
      </header>

      <section className="hero" id="checker">
        <div className="heroText">
          <p className="eyebrow">SHOPIFY INVENTORY CSV CHECKER</p>
          <h1>Check stock import risks before CSV upload.</h1>
          <p>
            Compare an original Shopify inventory export with your edited CSV.
            Find SKU, Location, On hand current/new, duplicate rows, and overwrite
            risks before importing.
          </p>
        </div>

        <section className="toolShell" aria-label="Shopify inventory CSV checker">
          <div className="csvPanel">
            <div className="panelHeader">
              <div>
                <h2>Original inventory export</h2>
                <p>Upload or paste the CSV you exported from Shopify before editing.</p>
              </div>
              <label className="fileButton">
                Upload old CSV
                <input type="file" accept=".csv,text/csv,text/plain" onChange={(event) => onFile(event, setOldText, "upload_original_csv")} />
              </label>
            </div>
            <textarea value={oldText} onChange={(event) => setOldText(event.target.value)} spellCheck={false} aria-label="Original Shopify inventory CSV" />
          </div>

          <div className="csvPanel">
            <div className="panelHeader">
              <div>
                <h2>Edited CSV ready to import</h2>
                <p>Paste the file you plan to import back into Shopify.</p>
              </div>
              <label className="fileButton">
                Upload new CSV
                <input type="file" accept=".csv,text/csv,text/plain" onChange={(event) => onFile(event, setNewText, "upload_edited_csv")} />
              </label>
            </div>
            <textarea value={newText} onChange={(event) => setNewText(event.target.value)} spellCheck={false} aria-label="Edited Shopify inventory CSV" />
          </div>
        </section>

        <div className="trustLine">
          <span>Files stay in your browser.</span>
          <span>Not affiliated with Shopify.</span>
          <span>No OAuth. No store connection.</span>
        </div>
      </section>

      <section className="resultsBand" aria-label="Inventory CSV risk report">
        <div className="summaryGrid">
          <div className="metric critical">
            <span>Critical</span>
            <strong>{critical.length}</strong>
          </div>
          <div className="metric warning">
            <span>Warnings</span>
            <strong>{warnings.length}</strong>
          </div>
          <div className="metric">
            <span>Changed rows</span>
            <strong>{result.changes.length}</strong>
          </div>
          <div className="metric">
            <span>New / missing</span>
            <strong>{newRows + missingRows}</strong>
          </div>
        </div>

        <div className="sectionHeader">
          <div>
            <p className="eyebrow">RISK REPORT</p>
            <h2>Import issues and overwrite risks</h2>
          </div>
          <div className="reportActions">
            <button type="button" onClick={() => downloadText("shopify-inventory-csv-report.csv", reportCsv, "download_issue_report")}>
              Download CSV report
            </button>
            <button type="button" onClick={() => downloadText("shopify-inventory-change-report.csv", changeCsv, "download_change_report")}>
              Download change report
            </button>
            <button type="button" onClick={() => copy(aiPrompt, "AI prompt")}>
              Copy AI fix prompt
            </button>
          </div>
        </div>

        {copied ? <p className="copyNotice">{copied}</p> : null}

        <div className="issueTableWrap">
          <table className="issueTable">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Row</th>
                <th>SKU</th>
                <th>Location</th>
                <th>Issue</th>
                <th>Suggested fix</th>
              </tr>
            </thead>
            <tbody>
              {result.issues.map((issue, index) => (
                <tr key={`${issue.row}-${issue.issue}-${index}`}>
                  <td><span className={`pill ${issue.severity}`}>{issue.severity}</span></td>
                  <td>{issue.row}</td>
                  <td>{issue.sku}</td>
                  <td>{issue.location}</td>
                  <td>{issue.issue}</td>
                  <td>{issue.fix}</td>
                </tr>
              ))}
              {result.issues.length === 0 ? (
                <tr>
                  <td colSpan={6}>No issues detected in the sample rules. Still review your file before import.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="resultsBand" aria-label="Inventory CSV change report">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">CHANGE REPORT</p>
            <h2>Quantity changes by SKU and Location</h2>
          </div>
        </div>

        <div className="issueTableWrap">
          <table className="issueTable">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Location</th>
                <th>Old current</th>
                <th>New current</th>
                <th>New target</th>
                <th>Delta</th>
              </tr>
            </thead>
            <tbody>
              {result.changes.map((change, index) => (
                <tr key={`${change.sku}-${change.location}-${index}`}>
                  <td>{change.sku}</td>
                  <td>{change.location}</td>
                  <td>{change.oldCurrent}</td>
                  <td>{change.newCurrent}</td>
                  <td>{change.newQuantity}</td>
                  <td className={Number(change.delta) < 0 ? "negativeDelta" : "positiveDelta"}>
                    {Number(change.delta) > 0 ? `+${change.delta}` : change.delta}
                  </td>
                </tr>
              ))}
              {result.changes.length === 0 ? (
                <tr>
                  <td colSpan={6}>No comparable quantity changes found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="contentBand" id="guide">
        <div className="contentGrid">
          <article>
            <h2>Why check On hand current and new?</h2>
            <p>
              Shopify inventory CSV exports can include <code>On hand (current)</code>
              and <code>On hand (new)</code>. The current value acts like a safety
              check: if real stock changed after export, importing an old file can
              overwrite newer inventory.
            </p>
            <p>
              This checker compares your original export with the edited file so
              changed current values, blank current values, and large stock deltas
              are visible before import.
            </p>
          </article>
          <article>
            <h2>Built for pre-import review</h2>
            <p>
              This is not a Shopify inventory app. It does not connect to your
              store, sync stock, or modify quantities. It is a preflight report for
              merchants who edit CSV files in spreadsheets.
            </p>
            <p>
              Use it when you want a quick risk report before uploading a CSV to
              Shopify Admin.
            </p>
          </article>
        </div>
      </section>

      <section className="faqBand" id="faq">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2>Inventory CSV questions</h2>
          </div>
        </div>
        <div className="faqGrid">
          <article>
            <h3>Is this an official Shopify tool?</h3>
            <p>No. This site is not affiliated with Shopify. Always check Shopify's official documentation before importing important inventory data.</p>
          </article>
          <article>
            <h3>Do you upload my CSV files?</h3>
            <p>No. The checker runs in your browser. The first version does not send CSV content to a server.</p>
          </article>
          <article>
            <h3>Can it read my live Shopify stock?</h3>
            <p>No. It compares the CSV files you provide. It cannot read live store inventory because it does not use Shopify OAuth or API access.</p>
          </article>
          <article>
            <h3>Does it support Product CSV?</h3>
            <p>No. The first version is intentionally focused on Shopify Inventory CSV import risk, not product catalog validation.</p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <Brand />
        <div>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
