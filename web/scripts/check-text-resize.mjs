#!/usr/bin/env node
/**
 * Auditoria de redimensionamento de texto (WCAG 1.4.4).
 *
 * Compara a página com a fonte raiz em 100% e 200%. O modo 200% simula
 * uma preferência de texto maior no navegador: tokens em rem acompanham
 * a raiz; valores fixos em px não acompanham.
 *
 * Uso: node scripts/check-text-resize.mjs
 */

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ALTURA_VIEWPORT = 900;
const LARGURAS = [320, 360, 599, 600, 768, 1023, 1024, 1280, 1440, 1920];
const ESCALAS = (process.env.TEXT_SCALES || "100,200")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isFinite(value) && value > 0);

// O conteúdo interno do Aster continua fora por causa do password gate.
const ROTAS = [
  "/",
  "/about",
  "/work",
  "/capabilities",
  "/cases/cure",
  "/cases/hp",
  "/cases/intuit",
  "/cases/theodoor",
  "/pt",
  "/pt/sobre",
  "/pt/work",
  "/pt/showcase",
  "/pt/competencias",
  "/pt/cases/cure",
  "/pt/cases/hp",
  "/pt/cases/intuit",
  "/pt/cases/theodoor",
];

function medir({ largura, escala }) {
  const achados = [];

  function temTextoDireto(el) {
    return Array.from(el.childNodes).some(
      (filho) => filho.nodeType === Node.TEXT_NODE && filho.textContent.trim() !== ""
    );
  }

  function seletor(el) {
    const partes = [];
    let atual = el;

    while (atual && atual !== document.body) {
      let parte = atual.tagName.toLowerCase();
      if (atual.id) {
        partes.unshift(`${parte}#${atual.id}`);
        break;
      }

      const pai = atual.parentElement;
      if (pai) {
        const irmaos = Array.from(pai.children).filter(
          (irmao) => irmao.tagName === atual.tagName
        );
        if (irmaos.length > 1) {
          parte += `:nth-of-type(${irmaos.indexOf(atual) + 1})`;
        }
      }

      partes.unshift(parte);
      atual = pai;
    }

    return partes.join(" > ");
  }

  function temAncestralComScrollHorizontal(el) {
    let ancestral = el.parentElement;
    while (ancestral) {
      if (["auto", "scroll"].includes(getComputedStyle(ancestral).overflowX)) {
        return true;
      }
      ancestral = ancestral.parentElement;
    }
    return false;
  }

  const documento = document.documentElement;
  if (documento.scrollWidth - documento.clientWidth > 1) {
    achados.push({
      tipo: "página mais larga que o viewport",
      largura,
      escala,
      seletor: "html",
      texto: "",
      scrollWidth: documento.scrollWidth,
      clientWidth: documento.clientWidth,
    });
  }

  for (const el of document.querySelectorAll("body *")) {
    if (!temTextoDireto(el)) continue;

    const estilo = getComputedStyle(el);
    if (estilo.display === "none" || estilo.visibility === "hidden") continue;
    if (["SVG", "CANVAS", "IFRAME"].includes(el.tagName)) continue;

    const overflowHorizontalPermitido = ["auto", "scroll"].includes(estilo.overflowX);
    const recortaVertical = ["hidden", "clip"].includes(estilo.overflowY);
    const horizontal = el.scrollWidth - el.clientWidth;
    const vertical = el.scrollHeight - el.clientHeight;
    const caixa = el.getBoundingClientRect();
    const ancestralComScrollHorizontal = temAncestralComScrollHorizontal(el);

    if (!overflowHorizontalPermitido && horizontal > 1) {
      achados.push({
        tipo: "texto mais largo que a caixa",
        largura,
        escala,
        seletor: seletor(el),
        texto: el.textContent.trim().slice(0, 70),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      });
    }

    if (
      !ancestralComScrollHorizontal &&
      (caixa.left < -1 || caixa.right > document.documentElement.clientWidth + 1)
    ) {
      achados.push({
        tipo: "texto fora do viewport",
        largura,
        escala,
        seletor: seletor(el),
        texto: el.textContent.trim().slice(0, 70),
        scrollWidth: Math.round(caixa.right),
        clientWidth: document.documentElement.clientWidth,
      });
    }

    // Um glifo pode passar alguns pixels da line-height sem perder conteúdo.
    // Vertical só é falha quando a própria caixa realmente recorta a sobra.
    if (recortaVertical && vertical > 1) {
      achados.push({
        tipo: "texto mais alto que a caixa",
        largura,
        escala,
        seletor: seletor(el),
        texto: el.textContent.trim().slice(0, 70),
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
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

    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `,
    });

    const reportados = new Set();

    for (const escala of ESCALAS) {
      await page.evaluate((valor) => {
        document.documentElement.style.setProperty("font-size", `${valor}%`, "important");
      }, escala);

      for (const largura of LARGURAS) {
        await page.setViewportSize({ width: largura, height: ALTURA_VIEWPORT });
        const achados = await page.evaluate(medir, { largura, escala });

        for (const achado of achados) {
          const chave = `${escala}|${achado.tipo}|${achado.seletor}`;
          if (reportados.has(chave)) continue;
          reportados.add(chave);
          violacoes.push({ rota, ...achado });
        }
      }
    }

    await page.close();
  }
} finally {
  await browser.close();
}

for (const v of violacoes) {
  const dimensoes = v.scrollWidth
    ? `scrollWidth ${v.scrollWidth} > clientWidth ${v.clientWidth}`
    : `scrollHeight ${v.scrollHeight} > clientHeight ${v.clientHeight}`;
  console.log(
    `✗ ${v.escala}%  ${v.rota}  ${v.largura}px  ${v.tipo}  ${v.seletor}  "${v.texto}" (${dimensoes})`
  );
}

console.log("");

if (violacoes.length === 0) {
  console.log(
    `Tudo passou — nenhuma perda de conteúdo detectada em ${ESCALAS.map((v) => `${v}%`).join(" e ")}.`
  );
  process.exit(0);
}

const em100 = violacoes.filter((v) => v.escala === 100).length;
const em200 = violacoes.filter((v) => v.escala === 200).length;
console.log(`${violacoes.length} problema(s): ${em100} em 100% e ${em200} em 200%.`);
process.exit(1);
