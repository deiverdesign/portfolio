#!/usr/bin/env node
/**
 * Regressão tipográfica responsiva.
 *
 * Valida no browser os contratos que não aparecem em lint ou build:
 * - a Renamor está carregada;
 * - displays mantêm hierarquia óptica sobre o body;
 * - existe somente uma inicial cursiva por título;
 * - não há overflow nem sucessão de linhas órfãs.
 */

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const WIDTHS = [375, 600, 788, 1024, 1440];
const HEIGHT = 1000;
const MIN_DISPLAY_TO_BODY_RATIO = 1.5;
const MIN_HOME_HERO_TO_BODY_RATIO = 2.25;
const MIN_HOME_LONG_HERO_TO_BODY_RATIO = 2;

const ROUTES = [
  "/",
  "/about",
  "/work",
  "/capabilities",
  "/cases/cure",
  "/cases/hp",
  "/cases/intuit",
  "/cases/theodoor",
  "/cases/aster",
  "/pt",
  "/pt/sobre",
  "/pt/work",
  "/pt/showcase",
  "/pt/competencias",
  "/pt/cases/cure",
  "/pt/cases/hp",
  "/pt/cases/intuit",
  "/pt/cases/theodoor",
  "/pt/cases/aster",
];

function tokenContractForWidth(width) {
  if (width <= 599) {
    return {
      "--font-size-renamor-from-boldonse-900": 67.5,
      "--font-size-renamor-from-boldonse-800": 61.2,
      "--font-size-renamor-from-boldonse-700": 49.725,
      "--font-size-display-hero": 61.2,
      "--font-size-display-hero-long": 48,
      "--font-size-display-hero-localized-long": 42,
      "--font-size-display-page": 49.725,
      "--font-size-display-case-hero": 61.2,
      "--font-size-display-case-hero-long": 48,
      "--font-size-display-capability": 54,
      "--font-size-display-cta": 49.725,
    };
  }

  if (width <= 1023) {
    return {
      "--font-size-renamor-from-boldonse-900": 90,
      "--font-size-renamor-from-boldonse-800": 72,
      "--font-size-renamor-from-boldonse-700": 58.5,
      "--font-size-display-hero": 72,
      "--font-size-display-hero-long": 72,
      "--font-size-display-hero-localized-long": 72,
      "--font-size-display-page": 58.5,
      "--font-size-display-case-hero": 72,
      "--font-size-display-case-hero-long": 72,
      "--font-size-display-capability": 90,
      "--font-size-display-cta": 58.5,
    };
  }

  return {
    "--font-size-renamor-from-boldonse-900": 108,
    "--font-size-renamor-from-boldonse-800": 72,
    "--font-size-renamor-from-boldonse-700": 58.5,
    "--font-size-display-hero": 72,
    "--font-size-display-hero-long": 72,
    "--font-size-display-hero-localized-long": 72,
    "--font-size-display-page": 58.5,
    "--font-size-display-case-hero": 72,
    "--font-size-display-case-hero-long": 72,
    "--font-size-display-capability": 92,
    "--font-size-display-cta": 72,
  };
}

function inspectTypography({
  route,
  width,
  minRatio,
  minHomeHeroRatio,
  minHomeLongHeroRatio,
  expectedTokens,
}) {
  const isVisible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  };

  const textNodes = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent?.trim() || !node.parentElement || !isVisible(node.parentElement)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  };

  const wordLines = (element) => {
    const nodes = textNodes(element);
    const pieces = nodes.map((node) => node.textContent ?? "");
    const text = pieces.join("");
    const offsets = [];
    let cursor = 0;

    for (let index = 0; index < nodes.length; index += 1) {
      offsets.push({ node: nodes[index], start: cursor, end: cursor + pieces[index].length });
      cursor += pieces[index].length;
    }

    const words = [];
    for (const match of text.matchAll(/\S+/g)) {
      const start = match.index;
      const end = start + match[0].length;
      const startPiece = offsets.find((piece) => start >= piece.start && start < piece.end);
      const endPiece = [...offsets].reverse().find((piece) => end > piece.start && end <= piece.end);
      if (!startPiece || !endPiece) continue;

      const range = document.createRange();
      range.setStart(startPiece.node, start - startPiece.start);
      range.setEnd(endPiece.node, end - endPiece.start);
      const rect = range.getBoundingClientRect();
      words.push({ word: match[0], top: Math.round(rect.top), left: Math.round(rect.left) });
    }

    const lines = [];
    for (const item of words) {
      let line = lines.find((candidate) => Math.abs(candidate.top - item.top) <= 2);
      if (!line) {
        line = { top: item.top, words: [] };
        lines.push(line);
      }
      line.words.push(item);
    }

    return lines
      .sort((a, b) => a.top - b.top)
      .map((line) => line.words.sort((a, b) => a.left - b.left).map((item) => item.word));
  };

  const paragraphs = [...document.querySelectorAll("p")].filter(isVisible);
  const maxBodySize = paragraphs.reduce(
    (largest, element) => Math.max(largest, Number.parseFloat(getComputedStyle(element).fontSize)),
    0
  );
  const violations = [];
  let hasRenamorHeading = false;

  for (const [token, expected] of Object.entries(expectedTokens)) {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.fontSize = `var(${token})`;
    document.body.append(probe);
    const actual = Number.parseFloat(getComputedStyle(probe).fontSize);
    probe.remove();

    if (!Number.isFinite(actual) || Math.abs(actual - expected) > 0.05) {
      violations.push(`token fora da matriz: ${token} = ${actual}px; esperado ${expected}px`);
    }
  }

  if (document.documentElement.scrollWidth - document.documentElement.clientWidth > 1) {
    violations.push("página mais larga que o viewport");
  }

  for (const heading of [...document.querySelectorAll("h1, h2, h3")].filter(isVisible)) {
    const nodes = textNodes(heading);
    const hasRenamorText = nodes.some((node) =>
      getComputedStyle(node.parentElement).fontFamily.toLowerCase().includes("renamor")
    );
    if (!hasRenamorText) continue;
    hasRenamorHeading = true;

    const style = getComputedStyle(heading);
    const size = Number.parseFloat(style.fontSize);
    const text = heading.textContent.trim();
    const transforms = [...heading.querySelectorAll("span")].map(
      (span) => getComputedStyle(span).textTransform
    );
    const uppercaseCount = transforms.filter((value) => value === "uppercase").length;
    const lowercaseCount = transforms.filter((value) => value === "lowercase").length;
    const isBrand = Boolean(heading.querySelector('[data-display-variant="brand"]'));

    const isHomeHero = heading.tagName === "H1" && ["/", "/pt"].includes(route);
    const requiredRatio =
      isHomeHero && route === "/pt"
        ? minHomeLongHeroRatio
        : isHomeHero
          ? minHomeHeroRatio
          : minRatio;

    if (size < maxBodySize * requiredRatio) {
      violations.push(
        `display sem hierarquia: "${text}" (${size}px vs body ${maxBodySize}px; mínimo ${requiredRatio}×)`
      );
    }

    const invalidInitialContract = isBrand
      ? uppercaseCount !== 0 || lowercaseCount !== 1
      : uppercaseCount !== 1 || lowercaseCount < 1;

    if (invalidInitialContract) {
      violations.push(
        `contrato da inicial: "${text}" (${uppercaseCount} uppercase, ${lowercaseCount} lowercase${isBrand ? ", brand" : ""})`
      );
    }

    if (heading.scrollWidth - heading.clientWidth > 1) {
      violations.push(`overflow no display: "${text}"`);
    }

    const lines = wordLines(heading);
    const singleWordLines = lines.filter((line) => line.length === 1).length;
    if (lines.length >= 3 && singleWordLines >= 2) {
      violations.push(`linhas órfãs repetidas: "${text}" — ${JSON.stringify(lines)}`);
    }
  }

  const renamorFaces = [...document.fonts].filter((face) =>
    face.family.toLowerCase().includes("renamor")
  );
  if (
    hasRenamorHeading &&
    (document.fonts.status !== "loaded" || !renamorFaces.some((face) => face.status === "loaded"))
  ) {
    violations.push("Renamor não carregada");
  }

  return { route, width, violations };
}

const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const failures = [];
const consoleErrors = [];

page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(`${page.url()}: ${message.text()}`);
});
page.on("pageerror", (error) => consoleErrors.push(`${page.url()}: ${error.message}`));

try {
  for (const route of ROUTES) {
    await page.setViewportSize({ width: WIDTHS[0], height: HEIGHT });
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      );
      const result = await page.evaluate(inspectTypography, {
        route,
        width,
        minRatio: MIN_DISPLAY_TO_BODY_RATIO,
        minHomeHeroRatio: MIN_HOME_HERO_TO_BODY_RATIO,
        minHomeLongHeroRatio: MIN_HOME_LONG_HERO_TO_BODY_RATIO,
        expectedTokens: tokenContractForWidth(width),
      });
      failures.push(...result.violations.map((violation) => ({ route, width, violation })));
    }
  }
} finally {
  await browser.close();
}

for (const failure of failures) {
  console.log(`✗ ${failure.route} ${failure.width}px — ${failure.violation}`);
}
for (const error of consoleErrors) {
  console.log(`✗ console — ${error}`);
}

if (failures.length || consoleErrors.length) {
  console.log(`\n${failures.length + consoleErrors.length} problema(s) tipográfico(s) encontrado(s).`);
  process.exit(1);
}

console.log(
  `Tudo passou — ${ROUTES.length} rotas × ${WIDTHS.length} larguras, sem regressão tipográfica.`
);
