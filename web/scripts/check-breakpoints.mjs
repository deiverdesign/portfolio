#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_ROOT = fileURLToPath(new URL("../src", import.meta.url));
const VALID = new Set(["max:599", "min:600", "max:1023", "min:1024"]);
const LEGACY_ALLOWLIST = new Map([
  ["app/_shared/cases.module.css|max:1024", 1],
  ["app/_shared/home.module.css|max:1024", 1],
  ["app/_shared/home.module.css|max:767", 2],
  ["components/CaseCardLarge/CaseCardLarge.module.css|min:1025", 1],
  ["components/LensBlurGlow/LensBlurGlow.tsx|min:1025", 1],
  ["components/LensBlurGlow/LensBlurGlow.tsx|max:767", 1],
]);
const observedLegacy = new Map();
const violations = [];

function filesUnder(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = resolve(directory, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

for (const path of filesUnder(SOURCE_ROOT)) {
  if (![".css", ".ts", ".tsx"].includes(extname(path))) continue;
  const file = relative(SOURCE_ROOT, path);
  const source = readFileSync(path, "utf8");
  for (const match of source.matchAll(/\((min|max)-width:\s*(\d+)px\)/g)) {
    const rule = `${match[1]}:${match[2]}`;
    if (VALID.has(rule)) continue;
    const allowlistKey = `${file}|${rule}`;
    if (LEGACY_ALLOWLIST.has(allowlistKey)) {
      observedLegacy.set(allowlistKey, (observedLegacy.get(allowlistKey) || 0) + 1);
      continue;
    }
    violations.push(`${file}: ${match[0]}`);
  }
}

for (const [key, expectedCount] of LEGACY_ALLOWLIST) {
  const observedCount = observedLegacy.get(key) || 0;
  if (observedCount !== expectedCount) {
    violations.push(`Allowlist desatualizada: ${key} (esperado ${expectedCount}, observado ${observedCount})`);
  }
}

if (violations.length) {
  console.error("Breakpoints fora do contrato:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Contrato responsivo válido: 0–599, 600–1023 e >=1024.");
console.log(`${LEGACY_ALLOWLIST.size} exceções antigas estão isoladas e não podem proliferar.`);
