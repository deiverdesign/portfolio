#!/usr/bin/env node
// Pipeline 5 (embrionário): busca os tokens direto da API do Figma, regenera
// tokens.css, e — se algo mudou — cria uma branch + commit local sozinho.
//
// O que este script NÃO faz de propósito: push pro GitHub, abrir Pull Request.
// Essas duas ações ficam manuais (rodar os comandos que o script imprime no
// final), porque são ações que afetam o repositório compartilhado — não é
// algo que deveria acontecer sem alguém decidir isso na hora.
//
// Como rodar:
//   1. Gere um token pessoal em figma.com -> Settings -> Security -> Personal access tokens
//   2. export FIGMA_TOKEN="seu-token-aqui"   (no terminal, nunca commitado)
//   3. node scripts/sync-tokens.mjs

import { readFileSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const FILE_KEY = process.env.FIGMA_FILE_KEY || "zpaQNzgjhG5ZKafe2cxnkm";
const TOKEN = process.env.FIGMA_TOKEN;
const TOKENS_CSS_PATH = fileURLToPath(new URL("../src/styles/tokens.css", import.meta.url));
const COLLECTIONS_TO_EXPORT = ["Primitives", "Semantic", "Spacing", "Font size"];
const BREAKPOINT_MODES = ["Desktop", "Tablet", "Mobile"];

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

const isMain = import.meta.url === `file://${process.argv[1]}`;

if (isMain && !TOKEN) {
  fail(
    [
      "FIGMA_TOKEN não encontrado.",
      "",
      "Gere um token pessoal em figma.com -> Settings -> Security -> Personal access tokens,",
      "depois rode (no seu terminal, nunca aqui no chat):",
      "",
      '  export FIGMA_TOKEN="seu-token-aqui"',
      "  node scripts/sync-tokens.mjs",
    ].join("\n")
  );
}

async function fetchVariables() {
  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) {
    fail(`API do Figma respondeu ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.meta;
}

function rgbToCss(c) {
  const to255 = (v) => Math.round(v * 255);
  if (c.a !== undefined && c.a < 1) {
    return `rgba(${to255(c.r)},${to255(c.g)},${to255(c.b)},${Math.round(c.a * 100) / 100})`;
  }
  const toHex = (v) => to255(v).toString(16).padStart(2, "0");
  return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
}

function cssVarName(variable) {
  // Code Syntax é o contrato explícito entre Figma e código. O fallback só
  // atende coleções antigas que ainda não receberam esse metadado.
  const webSyntax = variable.codeSyntax?.WEB;
  const syntaxMatch = webSyntax?.match(/^var\((--[^)]+)\)$/);
  if (syntaxMatch) return syntaxMatch[1].slice(2);
  return variable.name.toLowerCase().replace(/[\s/]+/g, "-");
}

function resolveValue(variableId, modeId, variablesById, visited = new Set()) {
  if (visited.has(variableId)) return null; // proteção contra ciclo de alias
  visited.add(variableId);

  const variable = variablesById[variableId];
  if (!variable) return null;

  const value = variable.valuesByMode[modeId] ?? Object.values(variable.valuesByMode)[0];
  if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
    return resolveValue(value.id, modeId, variablesById, visited);
  }
  if (value && typeof value === "object" && "r" in value) {
    return { type: "COLOR", css: rgbToCss(value) };
  }
  if (typeof value === "number") {
    return { type: "FLOAT", css: value };
  }
  return null;
}

function breakpointValue(variableId, variable, modeId, variablesById) {
  const raw = variable.valuesByMode[modeId] ?? Object.values(variable.valuesByMode)[0];
  if (raw && typeof raw === "object" && raw.type === "VARIABLE_ALIAS") {
    const target = variablesById[raw.id];
    if (target) return { css: `var(--${cssVarName(target)})`, unit: "" };
  }
  const resolved = resolveValue(variableId, modeId, variablesById);
  return resolved ? { css: resolved.css, unit: "px" } : null;
}

export function buildCss({ variables, variableCollections }) {
  const collectionsByName = Object.fromEntries(
    Object.values(variableCollections).map((c) => [c.name, c])
  );

  const lines = { root: [], tablet: [], mobile: [] };

  for (const collectionName of COLLECTIONS_TO_EXPORT) {
    const collection = collectionsByName[collectionName];
    if (!collection) continue;

    const modesByName = Object.fromEntries(collection.modes.map((m) => [m.name, m.modeId]));
    const isBreakpointCollection = collection.modes.length > 1 &&
      collection.modes.every((m) => BREAKPOINT_MODES.includes(m.name));

    for (const variableId of collection.variableIds) {
      const variable = variables[variableId];
      if (!variable) continue;
      const name = cssVarName(variable);

      if (isBreakpointCollection) {
        const desktop = breakpointValue(variableId, variable, modesByName.Desktop, variables);
        const tablet = breakpointValue(variableId, variable, modesByName.Tablet, variables);
        const mobile = breakpointValue(variableId, variable, modesByName.Mobile, variables);
        if (desktop) lines.root.push(`  --${name}: ${desktop.css}${desktop.unit};`);
        if (tablet) lines.tablet.push(`  --${name}: ${tablet.css}${tablet.unit};`);
        if (mobile) lines.mobile.push(`  --${name}: ${mobile.css}${mobile.unit};`);
      } else {
        const modeId = collection.modes[0].modeId;
        const resolved = resolveValue(variableId, modeId, variables);
        if (!resolved) continue;
        // opacity/disabled é guardado em escala 0-100 no Figma (peculiaridade de
        // como a Plugin API liga variáveis a `opacity`, ver responsive-rules.md),
        // mas CSS espera 0-1 — converte na saída, não na fonte.
        const value =
          resolved.type === "FLOAT" && name.includes("opacity") ? resolved.css / 100 : resolved.css;
        lines.root.push(`  --${name}: ${value};`);
      }
    }
  }

  return `/* Gerado automaticamente por scripts/sync-tokens.mjs a partir da API do Figma. */
/* Não editar à mão — rode o script de novo pra atualizar. */
/* Gerado em: ${new Date().toISOString()} */

:root {
${lines.root.join("\n")}
}

@media (max-width: 1024px) {
  :root {
${lines.tablet.join("\n")}
  }
}

@media (max-width: 599px) {
  :root {
${lines.mobile.join("\n")}
  }
}
`;
}

function run(cmd) {
  return execSync(cmd, { cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf-8" }).trim();
}

async function main() {
  console.log(`Buscando variables do arquivo ${FILE_KEY}...`);
  const meta = await fetchVariables();
  const newCss = buildCss(meta);

  const oldCss = existsSync(TOKENS_CSS_PATH) ? readFileSync(TOKENS_CSS_PATH, "utf-8") : "";

  // Ignora as linhas de timestamp/comentário na comparação — só importa se um VALOR mudou.
  const stripTimestamp = (css) => css.replace(/\/\* Gerado em:.*\*\//, "");
  if (stripTimestamp(newCss) === stripTimestamp(oldCss)) {
    console.log("Nenhuma mudança nos tokens. Nada a fazer.");
    return;
  }

  console.log("Tokens mudaram — escrevendo tokens.css e criando branch + commit local...");
  writeFileSync(TOKENS_CSS_PATH, newCss);

  const branch = `tokens-sync-${Date.now()}`;
  const currentBranch = run("git rev-parse --abbrev-ref HEAD");
  run(`git checkout -b ${branch}`);
  run(`git add src/styles/tokens.css`);
  run(`git commit -m "Sync automático de tokens do Figma\n\nGerado por scripts/sync-tokens.mjs, sem edição manual."`);
  run(`git checkout ${currentBranch}`);

  console.log(
    [
      "",
      `✓ Branch "${branch}" criada com o commit dos tokens novos.`,
      `  Voltei pra branch "${currentBranch}" — nada foi enviado pro GitHub.`,
      "",
      "Pra abrir o PR de verdade, rode manualmente:",
      `  git push -u origin ${branch}`,
      `  gh pr create --title "Sync de tokens do Figma" --body "Gerado automaticamente"`,
    ].join("\n")
  );
}

if (isMain) {
  main().catch((err) => fail(err.message));
}
