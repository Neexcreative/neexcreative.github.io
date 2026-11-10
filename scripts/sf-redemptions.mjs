#!/usr/bin/env node
/**
 * Small Forever: list voucher redemption acceptances (the append-only log).
 *
 * Runs on your own computer only. Reads the Upstash credentials from the
 * environment or .env.local (KV_REST_API_URL / KV_REST_API_TOKEN, or the
 * UPSTASH_REDIS_REST_* names). Only send a family their private upload link
 * after their acceptance appears here.
 *
 * Usage (from the Website folder):
 *   node scripts/sf-redemptions.mjs                 # newest first, as a table
 *   node scripts/sf-redemptions.mjs --csv > redemptions.csv
 *   node scripts/sf-redemptions.mjs --code SF-STO-K7M2P
 */
import fs from "node:fs";
import { Redis } from "@upstash/redis";

const env = { ...process.env };
try {
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !env[m[1]]) env[m[1]] = m[2].trim();
  }
} catch {
  /* no .env.local */
}

const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) {
  console.error("No Upstash credentials (KV_REST_API_URL / KV_REST_API_TOKEN) in the environment or .env.local.");
  process.exit(1);
}

const redis = new Redis({ url, token });
const entries = await redis.xrevrange("sf:acceptances", "+", "-", 1000);
const code = process.argv.includes("--code") ? process.argv[process.argv.indexOf("--code") + 1]?.toUpperCase() : null;

const rows = Object.entries(entries)
  .map(([id, f]) => ({ id, ...f }))
  .filter((r) => !code || r.voucher_id === code);

if (process.argv.includes("--csv")) {
  const cols = ["id", "type", "voucher_id", "email", "accepted_at", "terms_version", "privacy_version", "wording"];
  const csv = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  console.log(cols.join(","));
  for (const r of rows) console.log(cols.map((c) => csv(r[c])).join(","));
} else {
  for (const r of rows) {
    console.log(`${r.accepted_at}  ${String(r.voucher_id).padEnd(14)} ${String(r.email).padEnd(32)} terms ${r.terms_version} · privacy ${r.privacy_version}`);
  }
  console.error(`\n${rows.length} record(s)`);
}
