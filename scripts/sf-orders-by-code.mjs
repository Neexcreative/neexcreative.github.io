#!/usr/bin/env node
/**
 * Small Forever: paid orders by referral (influencer) code, as CSV.
 *
 * Runs on your own computer only, with your Stripe secret key. There is no
 * admin page on the website, so there is nothing for anyone else to reach.
 *
 * Usage (from the Website folder):
 *   node scripts/sf-orders-by-code.mjs                         # all paid orders
 *   node scripts/sf-orders-by-code.mjs --from 2026-11-01       # since a date
 *   node scripts/sf-orders-by-code.mjs --from 2026-11-01 --to 2026-12-31 > orders.csv
 *
 * Reads STRIPE_SECRET_KEY from the environment or from .env.local.
 * Use the LIVE key for real commissions. The CSV has no names or emails:
 * only date, plan, order type, amount, code and campaign labels.
 */
import fs from "node:fs";
import Stripe from "stripe";

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function secretKey() {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY.trim();
  try {
    const line = fs
      .readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .find((l) => l.startsWith("STRIPE_SECRET_KEY="));
    return line?.slice("STRIPE_SECRET_KEY=".length).trim();
  } catch {
    return undefined;
  }
}

const key = secretKey();
if (!key) {
  console.error("No STRIPE_SECRET_KEY found (environment or .env.local).");
  process.exit(1);
}

const toUnix = (iso, endOfDay = false) => {
  if (!iso) return undefined;
  const ms = Date.parse(`${iso}T${endOfDay ? "23:59:59" : "00:00:00"}Z`);
  if (Number.isNaN(ms)) {
    console.error(`Invalid date: ${iso} (use YYYY-MM-DD)`);
    process.exit(1);
  }
  return Math.floor(ms / 1000);
};

const created = {};
const from = toUnix(arg("from"));
const to = toUnix(arg("to"), true);
if (from) created.gte = from;
if (to) created.lte = to;

const stripe = new Stripe(key);
const csv = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const rows = [["date_utc", "plan", "order_type", "amount_eur", "ref_code", "utm_source", "utm_medium", "utm_campaign", "order_ref"]];
const totals = new Map();

for await (const s of stripe.checkout.sessions.list({ limit: 100, ...(from || to ? { created } : {}) })) {
  if (s.metadata?.project !== "small_forever" || s.payment_status !== "paid") continue;
  const m = s.metadata;
  const amount = (s.amount_total ?? 0) / 100;
  const code = m.ref_code || "";
  rows.push([
    new Date(s.created * 1000).toISOString().slice(0, 16).replace("T", " "),
    m.plan,
    m.order_type,
    amount.toFixed(2),
    code,
    m.utm_source,
    m.utm_medium,
    m.utm_campaign,
    `sf_${s.id.slice(-16)}`,
  ]);
  const t = totals.get(code || "(none)") ?? { orders: 0, amount: 0 };
  t.orders += 1;
  t.amount += amount;
  totals.set(code || "(none)", t);
}

process.stdout.write(rows.map((r) => r.map(csv).join(",")).join("\n") + "\n");

// Summary on stderr, so redirecting stdout to a file keeps the CSV clean.
console.error(`\n${rows.length - 1} paid order(s)${key.startsWith("sk_test_") ? " [TEST MODE]" : ""}`);
for (const [code, t] of [...totals].sort((a, b) => b[1].amount - a[1].amount)) {
  console.error(`  ${code.padEnd(16)} ${String(t.orders).padStart(3)} order(s)  €${t.amount.toFixed(2)}`);
}
