"use strict";
var StacklyPlanningInvoice = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // lib/planningInvoiceHtml.ts
  var planningInvoiceHtml_exports = {};
  __export(planningInvoiceHtml_exports, {
    billingHistoryEntryToInvoicePayload: () => billingHistoryEntryToInvoicePayload,
    buildPaymentInfoRows: () => buildPaymentInfoRows,
    buildPlanningInvoiceHtmlDocument: () => buildPlanningInvoiceHtmlDocument,
    downloadPlanningInvoiceForEntry: () => downloadPlanningInvoiceForEntry,
    downloadPlanningInvoiceHtml: () => downloadPlanningInvoiceHtml,
    escapeHtml: () => escapeHtml,
    formatUsd: () => formatUsd,
    parseUsdAmount: () => parseUsdAmount,
    resolveInvoiceLogoDataUrl: () => resolveInvoiceLogoDataUrl
  });
  var BRAND = "#002147";
  var INVOICE_TITLE = "#6495ed";
  var MUTED = "#64748b";
  var ROW_ALT = "#f2f2f2";
  var SIGN_BLUE = "#6aacff";
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function parseUsdAmount(amount) {
    const n = Number.parseFloat(amount.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  function formatUsd(n) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  }
  function buildPaymentInfoRows(entry) {
    const amountNum = parseUsdAmount(entry.amount);
    if (entry.status === "Free" || amountNum === 0) {
      return [{ label: "Billing", value: "Complimentary plan \u2014 no payment collected." }];
    }
    const method = (entry.paymentMethodLabel ?? "").trim();
    const detail = (entry.paymentDetail ?? "").trim();
    const methodL = method.toLowerCase();
    const detailL = detail.toLowerCase();
    if (methodL.includes("credit") || methodL.includes("debit") || detailL.includes("card payment")) {
      const rows2 = [
        { label: "Payment method", value: method || "Credit / Debit card" }
      ];
      const lastM = detail.match(/\*{4}(\d{4})/);
      const expM = detail.match(/exp\s+([\d/]+)/i);
      if (lastM) rows2.push({ label: "Card (last digits)", value: `****${lastM[1]}` });
      if (expM) rows2.push({ label: "Expiry (MM/YY)", value: expM[1] });
      if (!lastM && !expM && detail) rows2.push({ label: "Card details", value: detail });
      return rows2;
    }
    if (methodL.includes("paypal") || detailL.includes("paypal")) {
      const rows2 = [{ label: "Payment method", value: "PayPal" }];
      const m = detail.match(/PayPal\s*·\s*(.+)/i);
      rows2.push({ label: "PayPal account", value: (m ? m[1] : detail.replace(/^PayPal\s*/i, "")).trim() || "\u2014" });
      return rows2;
    }
    if (methodL.includes("upi") || methodL.includes("wallet") || detailL.includes("upi")) {
      const rows2 = [
        { label: "Payment method", value: method || "UPI / Wallet" }
      ];
      if (detail.includes("Google Pay")) rows2.push({ label: "Wallet", value: "Google Pay" });
      if (detail.includes("PhonePe")) rows2.push({ label: "Wallet", value: "PhonePe" });
      const um = detail.match(/UPI\s+(\S+)/i);
      if (um) rows2.push({ label: "UPI ID", value: um[1] });
      else if (detail) rows2.push({ label: "Payment details", value: detail });
      return rows2;
    }
    if (methodL.includes("net") || detailL.includes("net banking")) {
      const bank = detail.replace(/^Net banking\s*·\s*/i, "").trim() || detail;
      return [
        { label: "Payment method", value: "Net banking" },
        { label: "Bank / account", value: bank || "\u2014" }
      ];
    }
    const rows = [];
    if (method) rows.push({ label: "Payment method", value: method });
    if (detail) rows.push({ label: "Transaction details", value: detail });
    return rows.length > 0 ? rows : [{ label: "Payment", value: "Paid \u2014 see your statement for the descriptor." }];
  }
  function billingHistoryEntryToInvoicePayload(entry, defaults, logoSrc = null) {
    const amountNum = parseUsdAmount(entry.amount);
    const website = entry.websiteLabel ?? "Stackly workspace subscription";
    const planCol = entry.planTier ?? entry.planName ?? (entry.status === "Free" ? "Free" : "Pro");
    const currencyLine = formatUsd(amountNum);
    const lines = [
      { si: 1, website, price: currencyLine, plan: planCol, total: currencyLine }
    ];
    let generatedAtDisplay;
    if (entry.generatedAt) {
      const d = new Date(entry.generatedAt);
      generatedAtDisplay = Number.isNaN(d.getTime()) ? (/* @__PURE__ */ new Date()).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    } else {
      generatedAtDisplay = (/* @__PURE__ */ new Date()).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    }
    const dm = /^(\w+\s+\d+)\s+(\d{4})$/.exec(entry.date.trim());
    const invoiceDateDisplay = dm ? `${dm[1]}, ${dm[2]}` : entry.date;
    return {
      invoiceId: entry.invoiceId,
      invoiceDateDisplay,
      generatedAtDisplay,
      customerName: entry.buyerName ?? defaults.displayName,
      customerEmail: entry.buyerEmail ?? defaults.email,
      customerPhone: entry.buyerPhone ?? defaults.phone,
      customerAddress: entry.buyerAddress ?? defaults.address,
      status: entry.status,
      lines,
      subtotal: currencyLine,
      taxPercent: 0,
      total: currencyLine,
      paymentInfoRows: buildPaymentInfoRows(entry),
      logoSrc
    };
  }
  function renderLogoBlock(logoSrc) {
    if (logoSrc) {
      return `<img class="logo-img" src="${escapeHtml(logoSrc)}" alt="Stackly" width="132" height="36" />`;
    }
    return `<div class="logo-fallback" aria-hidden="true">
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="${BRAND}"/>
      <text x="20" y="27" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-size="19" font-weight="700">S</text>
    </svg>
    <span class="brand-name">STACKLY</span>
  </div>`;
  }
  function buildPlanningInvoiceHtmlDocument(p) {
    const rowsHtml = p.lines.map(
      (row, i) => `
      <tr class="${i % 2 === 1 ? "alt" : ""}">
        <td>${row.si}</td>
        <td>${escapeHtml(row.website)}</td>
        <td class="num">${escapeHtml(row.price)}</td>
        <td>${escapeHtml(row.plan)}</td>
        <td class="num">${escapeHtml(row.total)}</td>
      </tr>`
    ).join("");
    const paymentInfoHtml = p.paymentInfoRows.map(
      (r) => `<p class="pay-row"><span class="pay-label">${escapeHtml(r.label)} :</span> <span class="pay-val">${escapeHtml(r.value)}</span></p>`
    ).join("");
    const taxLine = `${p.taxPercent.toFixed(2)}%`;
    const logoBlock = renderLogoBlock(p.logoSrc);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(p.invoiceId)} \u2014 Stackly Invoice</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 44px 48px 36px;
      font-family: Inter, Roboto, "Segoe UI", Arial, Helvetica, sans-serif;
      font-size: 13px;
      color: #1a1a1a;
      background: #fff;
      line-height: 1.5;
    }
    .doc-head {
      margin-bottom: 0;
    }
    .brand-row {
      margin-bottom: 4px;
    }
    .logo-img {
      height: 34px;
      width: auto;
      max-width: 170px;
      object-fit: contain;
      display: block;
    }
    .logo-fallback {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-fallback .brand-name {
      font-size: 21px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: ${BRAND};
    }
    .tagline {
      font-size: 10.5px;
      color: #8a94a6;
      margin: 0 0 16px;
      line-height: 1.4;
      letter-spacing: 0.02em;
    }
    /* Full-width navy bar interrupted by \u201CINVOICE\u201D in the gap */
    .bar-broken {
      display: flex;
      align-items: center;
      width: 100%;
      margin: 0;
    }
    .bar-broken__left {
      flex: 1 1 50%;
      height: 30px;
      background: ${BRAND};
      min-width: 64px;
    }
    .bar-broken__title {
      flex: 0 0 auto;
      margin: 0;
      padding: 0 22px 0 26px;
      font-size: 38px;
      font-weight: 800;
      color: ${INVOICE_TITLE};
      letter-spacing: 0.14em;
      line-height: 1;
      text-transform: uppercase;
      font-family: Arial Black, "Arial Narrow", Arial, Helvetica, sans-serif;
    }
    .bar-broken__right {
      flex: 0 1 22%;
      height: 30px;
      background: ${BRAND};
      min-width: 72px;
      max-width: 220px;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 32px;
      margin: 22px 0 28px;
      flex-wrap: wrap;
    }
    .meta-left h2 {
      font-size: 17px;
      color: ${BRAND};
      margin: 0 0 10px;
      font-weight: 800;
      letter-spacing: 0.01em;
    }
    .meta-left .name {
      font-size: 15px;
      font-weight: 400;
      color: ${BRAND};
      line-height: 1.35;
    }
    .meta-right {
      margin-left: auto;
    }
    .meta-table {
      border-collapse: collapse;
      margin-left: auto;
    }
    .meta-table td {
      padding: 0 0 8px;
      vertical-align: baseline;
      font-size: 13px;
      color: ${BRAND};
    }
    .meta-table tr:last-child td {
      padding-bottom: 0;
    }
    .meta-table .meta-lbl {
      text-align: right;
      font-weight: 700;
      white-space: nowrap;
      padding-right: 2px;
    }
    .meta-table .meta-col {
      text-align: center;
      font-weight: 700;
      padding: 0 8px 0 4px;
    }
    .meta-table .meta-val {
      text-align: left;
      font-weight: 500;
    }
    table.inv {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #d0d0d0;
      margin-bottom: 30px;
    }
    table.inv thead th {
      background: ${BRAND};
      color: #fff;
      font-weight: 700;
      font-size: 12px;
      padding: 13px 11px;
      text-align: left;
      border: 1px solid ${BRAND};
    }
    table.inv thead th:nth-child(1) { width: 44px; text-align: center; }
    table.inv thead th:nth-child(3),
    table.inv thead th:nth-child(5) { text-align: right; }
    table.inv td {
      padding: 12px 11px;
      border: 1px solid #e4e4e4;
      font-size: 13px;
      color: #222;
    }
    table.inv td:nth-child(1) { text-align: center; }
    table.inv tr.alt td { background: ${ROW_ALT}; }
    table.inv td.num { text-align: right; font-variant-numeric: tabular-nums; }
    .lower {
      display: flex;
      justify-content: space-between;
      gap: 36px;
      align-items: flex-start;
      flex-wrap: wrap;
      margin-bottom: 26px;
    }
    .lower-left { flex: 1; min-width: 240px; max-width: 440px; }
    .lower-left h3 {
      color: ${BRAND};
      font-size: 19px;
      margin: 0 0 16px;
      font-weight: 700;
    }
    .lower-left h4 {
      color: ${BRAND};
      font-size: 16px;
      margin: 0 0 12px;
      font-weight: 700;
    }
    .pay-row { margin: 0 0 8px; font-size: 12.5px; line-height: 1.45; }
    .pay-label { font-weight: 600; color: ${BRAND}; }
    .pay-val { color: #222; }
    .gen-line {
      margin-top: 14px;
      font-size: 10.5px;
      color: ${MUTED};
    }
    .lower-right { min-width: 210px; text-align: right; }
    .lower-right .row { margin-bottom: 7px; font-size: 13px; color: #222; }
    .total-bar {
      margin-top: 12px;
      background: ${BRAND};
      color: #fff;
      font-weight: 800;
      font-size: 15px;
      padding: 13px 18px;
      text-align: right;
      border-radius: 1px;
    }
    .footer-wrap {
      border-top: 2px solid ${BRAND};
      border-bottom: 1px solid ${BRAND};
      padding: 16px 0 12px;
      margin-top: 4px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
      font-size: 14px;
      line-height: 1.55;
      color: #333;
    }
    .footer h5 { margin: 0 0 9px; font-size: 16px; color: ${BRAND}; font-weight: 700; }
    .sign {
      color: ${SIGN_BLUE};
      text-decoration: underline;
      font-weight: 600;
      align-self: flex-end;
      font-size: 12px;
    }
    .fineprint {
      text-align: center;
      font-size: 10px;
      color: ${MUTED};
      margin-top: 16px;
    }
    @media print {
      body { padding: 12mm; }
    }
  </style>
</head>
<body>
  <header class="doc-head">
    <div class="brand-row">${logoBlock}</div>
    <p class="tagline">Empowering businesses with cutting-edge solutions.</p>
    <div class="bar-broken" role="presentation">
      <div class="bar-broken__left" aria-hidden="true"></div>
      <h1 class="bar-broken__title">INVOICE</h1>
      <div class="bar-broken__right" aria-hidden="true"></div>
    </div>
  </header>

  <div class="meta">
    <div class="meta-left">
      <h2>Invoice details :</h2>
      <div class="name">${escapeHtml(p.customerName)}</div>
    </div>
    <div class="meta-right">
      <table class="meta-table" role="presentation">
        <tr>
          <td class="meta-lbl">Invoice Id</td>
          <td class="meta-col">:</td>
          <td class="meta-val">${escapeHtml(p.invoiceId)}</td>
        </tr>
        <tr>
          <td class="meta-lbl">Date</td>
          <td class="meta-col">:</td>
          <td class="meta-val">${escapeHtml(p.invoiceDateDisplay)}</td>
        </tr>
      </table>
    </div>
  </div>

  <table class="inv" role="table">
    <thead>
      <tr>
        <th>S.I.</th>
        <th>Website</th>
        <th>Price</th>
        <th>Plan</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="lower">
    <div class="lower-left">
      <h3>Thank you for your business</h3>
      <h4>Payment Info :</h4>
      ${paymentInfoHtml}
      <p class="gen-line">Invoice generated: ${escapeHtml(p.generatedAtDisplay)}</p>
    </div>
    <div class="lower-right">
      <div class="row"><strong>Sub Total :</strong> ${escapeHtml(p.subtotal)}</div>
      <div class="row"><strong>Tax :</strong> ${escapeHtml(taxLine)}</div>
      <div class="total-bar">Total : ${escapeHtml(p.total)}</div>
    </div>
  </div>

  <div class="footer-wrap">
    <div class="footer">
      <div>
        <h5>Terms &amp; Conditions</h5>
        <p>For billing-related issues, users can contact customer support through email, chat, or help center.</p>
      </div>
      <div class="sign">Authorised Sign</div>
    </div>
  </div>
  <p class="fineprint">Your invoice has been generated successfully.</p>
</body>
</html>`;
  }
  async function resolveInvoiceLogoDataUrl() {
    if (typeof window === "undefined") return null;
    try {
      const href = new URL("/stackly-logo.webp", window.location.origin).href;
      const res = await fetch(href, { cache: "force-cache" });
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(typeof r.result === "string" ? r.result : null);
        r.onerror = () => resolve(null);
        r.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }
  function downloadPlanningInvoiceHtml(filenameBase, html) {
    if (typeof window === "undefined") return;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filenameBase.replace(/[^a-zA-Z0-9-_]/g, "_")}.html`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  async function downloadPlanningInvoiceForEntry(entry, defaults, filenameBase) {
    const logo = await resolveInvoiceLogoDataUrl();
    const payload = billingHistoryEntryToInvoicePayload(entry, defaults, logo);
    const html = buildPlanningInvoiceHtmlDocument(payload);
    downloadPlanningInvoiceHtml(filenameBase, html);
  }
  return __toCommonJS(planningInvoiceHtml_exports);
})();
