#!/usr/bin/env node
/**
 * Verificação de overflow de texto.
 *
 * Abre páginas reais num browser (Playwright) e reprova qualquer elemento
 * de texto cujo conteúdo seja mais largo que a própria caixa
 * (scrollWidth > clientWidth) — sinal de texto cortado/estourando.
 *
 * Cada rota carrega uma vez só; a varredura de larguras é feita
 * redimensionando o viewport da mesma página (page.setViewportSize),
 * não recarregando.
 *
 * Uso: node scripts/check-overflow.mjs
 */

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const LARGURA_MIN = 360;
const LARGURA_MAX = 1920;
const PASSO = 20;
const ALTURA_VIEWPORT = 900;

// Rota única pra validar o script funcionando antes de expandir.
const ROTAS = ["/capabilities"];

// Lista completa de rotas do site — trocar a constante ROTAS acima por
// esta depois de confirmar que o script funciona em /capabilities.
// /cases/aster fica de fora por enquanto: está atrás de password gate.
// const ROTAS = [
//   "/",
//   "/about",
//   "/work",
//   "/capabilities",
//   "/cases/cure",
//   "/cases/hp",
//   "/cases/intuit",
//   "/cases/theodoor",
//   "/pt",
//   "/pt/sobre",
//   "/pt/work",
//   "/pt/showcase",
//   "/pt/competencias",
//   "/pt/cases/cure",
//   "/pt/cases/hp",
//   "/pt/cases/intuit",
//   "/pt/cases/theodoor",
// ];

// Roda dentro da página (browser), não do Node — por isso vem tudo junto
// numa função só, sem depender de nada de fora.
function medirOverflow(larguraAtual) {
  const ATRIBUTO_JA_REPORTADO = "data-overflow-reportado";
  const achados = [];

  function temFilhoDeTexto(el) {
    for (const filho of el.childNodes) {
      if (filho.nodeType === Node.TEXT_NODE && filho.textContent.trim() !== "") {
        return true;
      }
    }
    return false;
  }

  function gerarSeletor(el) {
    const partes = [];
    let atual = el;
    while (atual && atual.nodeType === Node.ELEMENT_NODE && atual !== document.body) {
      let parte = atual.tagName.toLowerCase();
      if (atual.id) {
        partes.unshift(`${parte}#${atual.id}`);
        break;
      }
      const pai = atual.parentElement;
      if (pai) {
        const irmaosMesmaTag = Array.from(pai.children).filter(
          (c) => c.tagName === atual.tagName
        );
        if (irmaosMesmaTag.length > 1) {
          parte += `:nth-of-type(${irmaosMesmaTag.indexOf(atual) + 1})`;
        }
      }
      partes.unshift(parte);
      atual = pai;
    }
    return partes.join(" > ");
  }

  for (const el of document.querySelectorAll("body *")) {
    if (el.hasAttribute(ATRIBUTO_JA_REPORTADO)) continue;

    // Só elementos com texto próprio (filho direto de nó de texto) —
    // não contêineres que só embrulham outros elementos.
    if (!temFilhoDeTexto(el)) continue;

    const tag = el.tagName;
    if (tag === "SVG" || tag === "CANVAS" || tag === "IFRAME") continue;

    const estilo = getComputedStyle(el);
    if (estilo.display === "none" || estilo.visibility === "hidden") continue;

    // overflow-x intencional (carrossel, bloco de código) não é bug.
    if (estilo.overflowX === "auto" || estilo.overflowX === "scroll") continue;

    // margem de 1px pra ignorar arredondamento de sub-pixel do browser.
    if (el.scrollWidth - el.clientWidth > 1) {
      el.setAttribute(ATRIBUTO_JA_REPORTADO, "1");
      achados.push({
        largura: larguraAtual,
        seletor: gerarSeletor(el),
        texto: el.textContent.trim().slice(0, 60),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      });
    }
  }

  return achados;
}

const violacoes = [];
const browser = await chromium.launch();

try {
  for (const rota of ROTAS) {
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}${rota}`, { waitUntil: "networkidle" });

    for (let largura = LARGURA_MIN; largura <= LARGURA_MAX; largura += PASSO) {
      await page.setViewportSize({ width: largura, height: ALTURA_VIEWPORT });
      const achados = await page.evaluate(medirOverflow, largura);
      for (const achado of achados) {
        violacoes.push({ rota, ...achado });
      }
    }

    await page.close();
  }
} finally {
  await browser.close();
}

for (const v of violacoes) {
  console.log(
    `✗ ${v.rota}  ${v.largura}px  ${v.seletor}  "${v.texto}" (scrollWidth ${v.scrollWidth} > clientWidth ${v.clientWidth})`
  );
}

console.log("");

if (violacoes.length === 0) {
  console.log("Tudo passou — nenhum overflow de texto encontrado.");
  process.exit(0);
}

console.log(`${violacoes.length} overflow(s) de texto encontrado(s).`);
process.exit(1);
