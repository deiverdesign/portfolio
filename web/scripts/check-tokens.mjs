#!/usr/bin/env node
/**
 * Verificação de tokens de tipografia.
 *
 * Reprova qualquer `font-size` escrito com valor cru (ex: 18px, 1.2rem)
 * em vez de um token do design system (ex: var(--font-body)).
 *
 * Uso: node scripts/check-tokens.mjs
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const RAIZ = "src";

// Aqui os valores crus são corretos — é onde os tokens nascem.
const IGNORAR = ["src/styles/tokens.css"];

// Valores que não são tamanho, então não precisam de token.
const PERMITIDOS = ["inherit", "initial", "unset", "0"];

function listarCss(dir) {
  const saida = [];
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) saida.push(...listarCss(caminho));
    else if (nome.endsWith(".css")) saida.push(caminho);
  }
  return saida;
}

const violacoes = [];

for (const arquivo of listarCss(RAIZ)) {
  if (IGNORAR.includes(arquivo)) continue;

  readFileSync(arquivo, "utf8").split("\n").forEach((linha, i) => {
    const achou = linha.match(/font-size:\s*([^;]+);/);
    if (!achou) return;

    const valor = achou[1].trim();
    if (valor.startsWith("var(")) return;        // usa token — ok
    if (PERMITIDOS.includes(valor)) return;

    violacoes.push({ arquivo, linha: i + 1, valor });
  });
}

for (const v of violacoes) {
  console.log(`✗ ${v.arquivo}:${v.linha}  font-size: ${v.valor}`);
}

console.log("");

if (violacoes.length === 0) {
  console.log("Tudo passou — todo font-size usa token.");
  process.exit(0);
}

console.log(`${violacoes.length} font-size sem token.`);
process.exit(1);
