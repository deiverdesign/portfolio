#!/usr/bin/env node
/**
 * Gera um screenshot lado a lado: o node real no Figma (via REST API,
 * /v1/images) e uma story do Storybook (via Playwright) — pra comparação
 * visual rápida ao fechar um componente. Ver NORTE.md 2.2, regra 12.
 *
 * Requer FIGMA_TOKEN no ambiente, com escopo "File content: Read-only"
 * (não é o mesmo escopo do sync-tokens.mjs, que usa file_variables:read —
 * o mesmo token pode ter os dois escopos marcados). Nunca colar o token
 * no chat ou no repositório.
 *
 * Uso:
 *   node scripts/figma-compare.mjs \
 *     --node 2167:6206 \
 *     --story http://localhost:6006/iframe.html?id=v3-casecardlargev3--scrioo&viewMode=story \
 *     --out /caminho/de/saida.png
 */
import { chromium } from "playwright";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const FILE_KEY = "zpaQNzgjhG5ZKafe2cxnkm";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i += 2) {
    out[args[i].replace(/^--/, "")] = args[i + 1];
  }
  return out;
}

async function fetchFigmaScreenshot(nodeId, token) {
  const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`;
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  const body = await res.json();
  if (!res.ok || body.err) {
    throw new Error(`Figma REST API falhou (${res.status}): ${body.err ?? JSON.stringify(body)}`);
  }
  const imageUrl = body.images?.[nodeId];
  if (!imageUrl) {
    throw new Error(`Figma não retornou imagem para o node ${nodeId}. Resposta: ${JSON.stringify(body)}`);
  }
  const imgRes = await fetch(imageUrl);
  return Buffer.from(await imgRes.arrayBuffer());
}

async function main() {
  const { node, story, out } = parseArgs();
  if (!node || !story || !out) {
    throw new Error("Uso: --node <fileNode> --story <url> --out <caminho.png>");
  }
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    throw new Error(
      "FIGMA_TOKEN não encontrado. Configure no seu terminal com escopo " +
        "\"File content: Read-only\"; nunca cole o token no chat."
    );
  }

  const tmp = await mkdtemp(join(tmpdir(), "figma-compare-"));
  const figmaPngPath = join(tmp, "figma.png");
  const storyPngPath = join(tmp, "story.png");
  const htmlPath = join(tmp, "compare.html");

  console.log(`Buscando screenshot do Figma (node ${node})…`);
  const figmaPng = await fetchFigmaScreenshot(node, token);
  await writeFile(figmaPngPath, figmaPng);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });

  console.log(`Abrindo story: ${story}`);
  await page.goto(story, { waitUntil: "networkidle" });
  // O Vite (dev server do Storybook) pode ainda estar terminando um HMR de
  // CSS no instante do primeiro load — um reload duro força buscar o bundle
  // atualizado, em vez de arriscar fotografar um estado desatualizado.
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: storyPngPath });

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  body { margin: 0; font-family: -apple-system, sans-serif; background: #1a1a1a; }
  .row { display: flex; gap: 16px; padding: 16px; }
  figure { margin: 0; flex: 1; background: #fff; border-radius: 8px; overflow: hidden; }
  figcaption { padding: 8px 12px; font-size: 13px; font-weight: 600; background: #2a2a2a; color: #fff; }
  img { display: block; width: 100%; height: auto; }
</style></head>
<body>
  <div class="row">
    <figure><figcaption>Figma (node ${node})</figcaption><img src="file://${figmaPngPath}"></figure>
    <figure><figcaption>Storybook (build atual)</figcaption><img src="file://${storyPngPath}"></figure>
  </div>
</body></html>`;
  await writeFile(htmlPath, html);

  const comparePage = await browser.newPage();
  await comparePage.goto(`file://${htmlPath}`);
  await comparePage.waitForTimeout(200);
  await comparePage.screenshot({ path: out, fullPage: true });

  await browser.close();
  await rm(tmp, { recursive: true, force: true });
  console.log(`Comparativo salvo em: ${out}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
