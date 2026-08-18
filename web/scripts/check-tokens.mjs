#!/usr/bin/env node
/**
 * Verificação de tokens de tipografia.
 *
 * Reprova qualquer `font-size` escrito com valor cru (ex: 18px, 1.2rem),
 * token antigo ou referência a um token que não existe.
 *
 * Uso: node scripts/check-tokens.mjs
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const RAIZ = "src";
const ARQUIVO_TOKENS = "src/styles/tokens.css";

// Aqui os valores crus são corretos — é onde os tokens nascem.
const IGNORAR = [ARQUIVO_TOKENS];

// Valores que não são tamanho, então não precisam de token.
const PERMITIDOS = ["inherit", "initial", "unset", "0"];

const tokensDefinidos = new Set(
  [...readFileSync(ARQUIVO_TOKENS, "utf8").matchAll(/^\s*(--font-size-[a-z0-9-]+):/gm)]
    .map((match) => match[1])
);

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
    if (PERMITIDOS.includes(valor)) return;

    const referencia = valor.match(/^var\((--font-size-[a-z0-9-]+)\)$/);
    if (referencia) {
      if (!tokensDefinidos.has(referencia[1])) {
        violacoes.push({
          arquivo,
          linha: i + 1,
          valor,
          motivo: `token não definido: ${referencia[1]}`,
        });
      }
      return;
    }

    violacoes.push({
      arquivo,
      linha: i + 1,
      valor,
      motivo: valor.includes("--font-")
        ? "token de tipografia antigo ou fora da categoria font-size"
        : "font-size sem token",
    });
  });
}

for (const v of violacoes) {
  console.log(`✗ ${v.arquivo}:${v.linha}  font-size: ${v.valor}  (${v.motivo})`);
}

console.log("");

if (violacoes.length === 0) {
  console.log("Tudo passou — todo font-size usa um token definido da nova nomenclatura.");
  process.exit(0);
}

console.log(`${violacoes.length} font-size sem token.`);
process.exit(1);
