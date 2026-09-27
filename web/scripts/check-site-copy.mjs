#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CATALOG_PATH = fileURLToPath(
  new URL("../src/content/site-copy.generated.json", import.meta.url)
);
const VALID_STATUSES = new Set(["aprovado", "revisar", "decidir"]);
const KEY_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

function fail(message) {
  throw new Error(message);
}

const catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
if (catalog.schemaVersion !== 1) fail("schemaVersion do catálogo deve ser 1.");
if (!catalog.entries || typeof catalog.entries !== "object") fail("entries ausente.");

const entries = Object.entries(catalog.entries);
if (catalog.source?.entryCount !== entries.length) {
  fail(`entryCount declara ${catalog.source?.entryCount}, mas há ${entries.length} entradas.`);
}

const statuses = {};
for (const [key, entry] of entries) {
  if (!KEY_PATTERN.test(key)) fail(`Key inválida: ${key}.`);
  for (const locale of ["en", "pt"]) {
    if (typeof entry[locale] !== "string" || !entry[locale]) {
      fail(`Copy ${locale} ausente em ${key}.`);
    }
  }
  if (!VALID_STATUSES.has(entry.status)) fail(`Status inválido em ${key}: ${entry.status}.`);
  statuses[entry.status] = (statuses[entry.status] || 0) + 1;
}

console.log(`Copy estruturalmente íntegro: ${entries.length} entradas com paridade EN/PT.`);
console.log(
  `Estado editorial: ${Object.entries(statuses)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([status, count]) => `${status}: ${count}`)
    .join(", ")}.`
);
