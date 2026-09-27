#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const FILE_KEY = process.env.FIGMA_FILE_KEY || "zpaQNzgjhG5ZKafe2cxnkm";
const TOKEN = process.env.FIGMA_TOKEN;
const TOKENS_CSS_PATH = fileURLToPath(new URL("../src/styles/tokens.css", import.meta.url));
const CANDIDATE_PATH = fileURLToPath(
  new URL("../tmp/token-sync/tokens.figma.candidate.css", import.meta.url)
);
const COLLECTIONS_TO_EXPORT = ["Primitives", "Semantic", "Spacing", "Font size"];
const RESPONSIVE_COLLECTIONS = new Set(["Spacing", "Font size"]);
const BREAKPOINT_MODES = ["Desktop", "Tablet", "Mobile"];

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

function isDirectRun() {
  return process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
}

function rgbToCss(color) {
  const to255 = (value) => Math.round(value * 255);
  if (color.a !== undefined && color.a < 1) {
    return `rgba(${to255(color.r)}, ${to255(color.g)}, ${to255(color.b)}, ${Number(
      color.a.toFixed(3)
    )})`;
  }
  const toHex = (value) => to255(value).toString(16).padStart(2, "0");
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function cssVarName(variable) {
  const webSyntax = variable.codeSyntax?.WEB;
  const syntaxMatch = webSyntax?.match(/^var\((--[^)]+)\)$/);
  if (syntaxMatch) return syntaxMatch[1].slice(2);
  return variable.name.toLowerCase().replace(/[\s/]+/g, "-");
}

function pxToRem(value) {
  return `${Number((value / 16).toFixed(6))}rem`;
}

function collectionModeId(collection, modeName) {
  return collection.modes.find((mode) => mode.name === modeName)?.modeId;
}

function valueForMode(variable, requestedModeName, collectionsById) {
  const collection = collectionsById[variable.variableCollectionId];
  if (!collection) throw new Error(`Coleção ausente para a variable "${variable.name}".`);

  const equivalentModeId = collectionModeId(collection, requestedModeName);
  if (equivalentModeId && variable.valuesByMode[equivalentModeId] !== undefined) {
    return variable.valuesByMode[equivalentModeId];
  }

  const entries = Object.entries(variable.valuesByMode);
  if (entries.length === 1) return entries[0][1];

  throw new Error(
    `A variable "${variable.name}" não possui um valor inequívoco para o modo ${requestedModeName}.`
  );
}

function resolveValue(variableId, modeName, variablesById, collectionsById, visited = new Set()) {
  if (visited.has(variableId)) {
    throw new Error(`Ciclo de alias detectado na variable ${variableId}.`);
  }
  const variable = variablesById[variableId];
  if (!variable) throw new Error(`Alias aponta para variable inexistente: ${variableId}.`);

  const nextVisited = new Set(visited).add(variableId);
  const value = valueForMode(variable, modeName, collectionsById);
  if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
    return resolveValue(value.id, modeName, variablesById, collectionsById, nextVisited);
  }
  if (value && typeof value === "object" && "r" in value) {
    return { type: "COLOR", css: rgbToCss(value) };
  }
  if (typeof value === "number") return { type: "FLOAT", css: value };
  if (typeof value === "string" || typeof value === "boolean") {
    return { type: typeof value === "string" ? "STRING" : "BOOLEAN", css: String(value) };
  }
  throw new Error(`Tipo de valor não suportado em "${variable.name}" (${modeName}).`);
}

export function validateMeta({ variables, variableCollections }) {
  if (!variables || !variableCollections) {
    throw new Error("A resposta do Figma não contém variables e variableCollections.");
  }

  const collections = Object.values(variableCollections);
  const collectionsByName = new Map(collections.map((collection) => [collection.name, collection]));
  for (const collectionName of COLLECTIONS_TO_EXPORT) {
    const collection = collectionsByName.get(collectionName);
    if (!collection) throw new Error(`Coleção obrigatória ausente: ${collectionName}.`);

    if (RESPONSIVE_COLLECTIONS.has(collectionName)) {
      const modeNames = new Set(collection.modes.map((mode) => mode.name));
      for (const modeName of BREAKPOINT_MODES) {
        if (!modeNames.has(modeName)) {
          throw new Error(`A coleção ${collectionName} não possui o modo obrigatório ${modeName}.`);
        }
      }
    }

    for (const variableId of collection.variableIds) {
      if (!variables[variableId]) {
        throw new Error(`A coleção ${collectionName} referencia variable inexistente: ${variableId}.`);
      }
    }
  }

  const generatedNames = new Map();
  for (const collectionName of COLLECTIONS_TO_EXPORT) {
    const collection = collectionsByName.get(collectionName);
    for (const variableId of collection.variableIds) {
      const variable = variables[variableId];
      const name = cssVarName(variable);
      const previous = generatedNames.get(name);
      if (previous) {
        throw new Error(`Nome CSS duplicado --${name}: "${previous}" e "${variable.name}".`);
      }
      generatedNames.set(name, variable.name);
    }
  }
}

function formatVariable(variableId, modeName, collectionName, variables, collectionsById) {
  const variable = variables[variableId];
  const resolved = resolveValue(variableId, modeName, variables, collectionsById);
  let value = resolved.css;

  if (resolved.type === "FLOAT") {
    if (collectionName === "Font size") value = pxToRem(value);
    else if (collectionName === "Spacing") value = `${value}px`;
    else if (cssVarName(variable).includes("opacity")) value /= 100;
  }

  return `  --${cssVarName(variable)}: ${value};`;
}

export function buildCss(meta) {
  validateMeta(meta);
  const { variables, variableCollections } = meta;
  const collections = Object.values(variableCollections);
  const collectionsByName = new Map(collections.map((collection) => [collection.name, collection]));
  const collectionsById = Object.fromEntries(collections.map((collection) => [collection.id, collection]));
  const blocks = { Desktop: [], Tablet: [], Mobile: [] };

  for (const collectionName of COLLECTIONS_TO_EXPORT) {
    const collection = collectionsByName.get(collectionName);
    if (RESPONSIVE_COLLECTIONS.has(collectionName)) {
      for (const modeName of BREAKPOINT_MODES) {
        for (const variableId of collection.variableIds) {
          blocks[modeName].push(
            formatVariable(variableId, modeName, collectionName, variables, collectionsById)
          );
        }
      }
      continue;
    }

    const defaultModeName = collection.modes[0]?.name;
    if (!defaultModeName) throw new Error(`A coleção ${collectionName} não possui modos.`);
    for (const variableId of collection.variableIds) {
      blocks.Desktop.push(
        formatVariable(variableId, defaultModeName, collectionName, variables, collectionsById)
      );
    }
  }

  return `/* Candidato gerado por scripts/sync-tokens.mjs a partir do Figma. */
/* Não substitui src/styles/tokens.css automaticamente. Revise o drift antes de integrar. */

:root {
${blocks.Desktop.join("\n")}
}

@media (max-width: 1023px) {
  :root {
${blocks.Tablet.join("\n")}
  }
}

@media (max-width: 599px) {
  :root {
${blocks.Mobile.join("\n")}
  }
}
`;
}

function parseResponsiveVariables(css) {
  const rootBlocks = [...css.matchAll(/:root\s*\{([^}]*)\}/g)];
  const modes = ["Desktop", "Tablet", "Mobile"];
  const parsed = {};

  for (let index = 0; index < Math.min(rootBlocks.length, modes.length); index += 1) {
    const declarations = {};
    for (const match of rootBlocks[index][1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      declarations[match[1]] = match[2].trim();
    }
    parsed[modes[index]] = declarations;
  }
  return parsed;
}

export function compareCssVariables(currentCss, candidateCss) {
  const current = parseResponsiveVariables(currentCss);
  const candidate = parseResponsiveVariables(candidateCss);
  const missing = [];
  const changed = [];
  const preserved = [];

  for (const modeName of BREAKPOINT_MODES) {
    const currentMode = current[modeName] || {};
    const candidateMode = candidate[modeName] || {};
    for (const [name, value] of Object.entries(candidateMode)) {
      if (!(name in currentMode)) missing.push({ mode: modeName, name, candidate: value });
      else if (currentMode[name] !== value) {
        changed.push({ mode: modeName, name, current: currentMode[name], candidate: value });
      }
    }
    for (const [name, value] of Object.entries(currentMode)) {
      if (!(name in candidateMode)) preserved.push({ mode: modeName, name, current: value });
    }
  }
  return { missing, changed, preserved };
}

function printDrift(drift) {
  console.log(
    `Drift: ${drift.changed.length} alterado(s), ${drift.missing.length} ausente(s), ` +
      `${drift.preserved.length} extensão(ões) local(is) preservada(s).`
  );
  for (const item of drift.changed.slice(0, 30)) {
    console.log(`  ~ ${item.mode} --${item.name}: ${item.current} → ${item.candidate}`);
  }
  for (const item of drift.missing.slice(0, 30)) {
    console.log(`  + ${item.mode} --${item.name}: ${item.candidate}`);
  }
  if (drift.changed.length > 30 || drift.missing.length > 30) {
    console.log("  … relatório truncado; consulte o candidato completo.");
  }
}

async function fetchVariables() {
  const response = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (response.status === 403) {
    throw new Error(
      "A API de Variables recusou o acesso. O token precisa de file_variables:read e o endpoint " +
        "pode depender do plano do Figma. Se ele não estiver disponível, exporte via Plugin API."
    );
  }
  if (!response.ok) {
    throw new Error(`API do Figma respondeu ${response.status}: ${await response.text()}`);
  }
  const payload = await response.json();
  return payload.meta;
}

async function main() {
  const args = process.argv.slice(2);
  const unknownArgs = args.filter((arg) => arg !== "--check");
  if (unknownArgs.length) throw new Error(`Argumento desconhecido: ${unknownArgs.join(", ")}.`);
  if (!TOKEN) {
    throw new Error(
      "FIGMA_TOKEN não encontrado. Configure-o somente no seu terminal, com o escopo " +
        "file_variables:read; nunca cole o token no chat ou no repositório."
    );
  }

  console.log(`Lendo variables do arquivo ${FILE_KEY}…`);
  const candidateCss = buildCss(await fetchVariables());
  const currentCss = existsSync(TOKENS_CSS_PATH) ? readFileSync(TOKENS_CSS_PATH, "utf8") : "";
  const drift = compareCssVariables(currentCss, candidateCss);
  printDrift(drift);

  if (!args.includes("--check")) {
    mkdirSync(dirname(CANDIDATE_PATH), { recursive: true });
    writeFileSync(CANDIDATE_PATH, candidateCss);
    console.log(`Candidato salvo em ${CANDIDATE_PATH}.`);
    console.log("src/styles/tokens.css não foi alterado; branches e commits também não.");
  }

  if (args.includes("--check") && (drift.changed.length || drift.missing.length)) {
    process.exitCode = 1;
  }
}

if (isDirectRun()) {
  main().catch((error) => fail(error.message));
}
