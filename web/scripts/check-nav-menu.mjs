#!/usr/bin/env node
/**
 * Contrato visual e funcional do menu responsivo da NavBar.
 *
 * Verifica os contextos dark/light em mobile e tablet, incluindo tokens,
 * dimensões do controle, bounds do SVG, estado ARIA e estabilidade da caixa
 * ao trocar do ícone de abrir para o de fechar.
 */

import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const VIEWPORTS = [
  { name: "mobile", width: 381, height: 800 },
  { name: "tablet", width: 788, height: 800 },
];
const CONTEXTS = [
  { name: "dark", route: "/", colorToken: "--nav-menu-toggle-content-on-dark" },
  { name: "light", route: "/about", colorToken: "--nav-menu-toggle-content-on-light" },
];

function closeTo(actual, expected, tolerance = 0.25) {
  return Math.abs(actual - expected) <= tolerance;
}

const failures = [];
const browser = await chromium.launch();

try {
  for (const viewport of VIEWPORTS) {
    for (const context of CONTEXTS) {
      const page = await browser.newPage({ viewport });
      const browserErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") browserErrors.push(message.text());
      });
      page.on("pageerror", (error) => browserErrors.push(error.message));

      await page.goto(`${BASE_URL}${context.route}`, { waitUntil: "networkidle" });

      const closed = await page.evaluate(({ colorToken }) => {
        const button = document.querySelector('nav:not([aria-hidden]) button[aria-expanded]');
        if (!(button instanceof HTMLButtonElement)) return { missing: "menu button" };

        const icon = button.querySelector("svg");
        if (!(icon instanceof SVGSVGElement)) return { missing: "open icon" };

        const resolver = document.createElement("span");
        resolver.style.color = `var(${colorToken})`;
        resolver.style.position = "fixed";
        resolver.style.visibility = "hidden";
        document.body.appendChild(resolver);
        const tokenColor = getComputedStyle(resolver).color;
        resolver.remove();

        const buttonBox = button.getBoundingClientRect();
        const iconBox = icon.getBoundingClientRect();
        return {
          expanded: button.getAttribute("aria-expanded"),
          label: button.getAttribute("aria-label"),
          buttonWidth: buttonBox.width,
          buttonHeight: buttonBox.height,
          iconWidth: iconBox.width,
          iconHeight: iconBox.height,
          viewBox: icon.getAttribute("viewBox"),
          buttonColor: getComputedStyle(button).color,
          tokenColor,
          pathFill: getComputedStyle(icon.querySelector("path")).fill,
          errorOverlay: Boolean(
            document.querySelector(
              "[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay",
            ),
          ),
          hasContent: document.body.innerText.trim().length > 0,
        };
      }, { colorToken: context.colorToken });

      const prefix = `${context.name}/${viewport.name}`;
      if (closed.missing) failures.push(`${prefix}: ${closed.missing} não encontrado`);
      else {
        if (closed.expanded !== "false") failures.push(`${prefix}: aria-expanded inicial não é false`);
        if (!closeTo(closed.buttonWidth, 50) || !closeTo(closed.buttonHeight, 50)) {
          failures.push(`${prefix}: controle mede ${closed.buttonWidth}×${closed.buttonHeight}, esperado 50×50`);
        }
        if (!closeTo(closed.iconWidth, 50) || !closeTo(closed.iconHeight, 50)) {
          failures.push(`${prefix}: ícone aberto mede ${closed.iconWidth}×${closed.iconHeight}, esperado 50×50`);
        }
        if (closed.viewBox !== "0 0 50 50") failures.push(`${prefix}: viewBox do export foi alterado`);
        if (closed.buttonColor !== closed.tokenColor) {
          failures.push(`${prefix}: cor ${closed.buttonColor} não resolve o token ${closed.tokenColor}`);
        }
        if (closed.pathFill !== closed.tokenColor) {
          failures.push(`${prefix}: vetor não herdou a cor tokenizada (${closed.pathFill})`);
        }
        if (closed.errorOverlay) failures.push(`${prefix}: overlay de erro do framework visível`);
        if (!closed.hasContent) failures.push(`${prefix}: página sem conteúdo`);
      }

      await page.locator('nav:not([aria-hidden]) button[aria-expanded]').click();
      const opened = await page.evaluate(() => {
        const button = document.querySelector('nav:not([aria-hidden]) button[aria-expanded]');
        if (!(button instanceof HTMLButtonElement)) return { missing: "menu button" };
        const icon = button.querySelector("svg");
        if (!(icon instanceof SVGSVGElement)) return { missing: "close icon" };
        const buttonBox = button.getBoundingClientRect();
        const iconBox = icon.getBoundingClientRect();
        return {
          expanded: button.getAttribute("aria-expanded"),
          buttonWidth: buttonBox.width,
          buttonHeight: buttonBox.height,
          iconWidth: iconBox.width,
          iconHeight: iconBox.height,
        };
      });

      if (opened.missing) failures.push(`${prefix}: ${opened.missing} não encontrado após clique`);
      else {
        if (opened.expanded !== "true") failures.push(`${prefix}: aria-expanded não mudou para true`);
        if (!closeTo(opened.buttonWidth, 50) || !closeTo(opened.buttonHeight, 50)) {
          failures.push(`${prefix}: caixa mudou ao abrir (${opened.buttonWidth}×${opened.buttonHeight})`);
        }
        if (!closeTo(opened.iconWidth, 20) || !closeTo(opened.iconHeight, 20)) {
          failures.push(`${prefix}: ícone de fechar mede ${opened.iconWidth}×${opened.iconHeight}, esperado 20×20`);
        }
      }

      for (const error of browserErrors) failures.push(`${prefix}: console — ${error}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  failures.forEach((failure) => console.log(`✗ ${failure}`));
  console.log(`\n${failures.length} falha(s) no contrato do menu responsivo.`);
  process.exit(1);
}

console.log("Tudo passou — menu 50×50, cores tokenizadas e estados estáveis em mobile/tablet.");
