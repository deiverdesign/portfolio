#!/usr/bin/env node
/**
 * Verificação automatizada e enxuta do bilíngue PT/EN — não substitui
 * revisão manual, mas pega os erros estruturais mais fáceis de deixar
 * passar despercebido: lang errado, link interno que troca de idioma
 * sem querer, e strings óbvias do idioma errado vazando na página.
 *
 * Uso:
 *   node scripts/check-i18n.mjs [baseUrl]
 *   (default baseUrl: http://localhost:3001 — rode contra `npm run dev`
 *   ou, pra um retrato mais fiel de produção, `npm run build && npm run start`)
 */

const baseUrl = process.argv[2] || process.env.BASE_URL || "http://localhost:3001";

const PT_ROUTES = [
  "/",
  "/sobre",
  "/competencias",
  "/cases/cure",
  "/cases/hp",
  "/cases/theodoor",
  "/cases/intuit",
  "/cases/aster",
];

const EN_ROUTES = [
  "/en",
  "/en/about",
  "/en/capabilities",
  "/en/cases/cure",
  "/en/cases/hp",
  "/en/cases/theodoor",
  "/en/cases/intuit",
  "/en/cases/aster",
];

// Palavras que só existem em PT — se aparecerem numa rota EN, é vazamento.
// Curta de propósito: só termos inequívocos, sem falso positivo plausível.
const PT_ONLY_WORDS = ["não", "você", "está", "então", "português", "média", "é o único"];

// Idem pro sentido contrário — termos EN inequívocos que não deveriam
// aparecer soltos numa página PT. Exclui os labels de produto do ASTER
// (AI Draft, My Notes, Insight, Known/Unknown Patient, Ambiguous Match,
// Restart, Undo, Hard No), que ficam em inglês nas duas versões de
// propósito, por serem nomes literais de elementos da interface.
const EN_ONLY_WORDS = [
  " the ",
  " is not ",
  " was ",
  " were ",
  " I designed",
  " I built",
  "Back to work",
  "Back to portfolio",
];

const ASTER_ALLOWLIST = [
  "AI Draft",
  "My Notes",
  "Insight",
  "Known Patient",
  "Unknown Patient",
  "Ambiguous Match",
  "Restart",
  "Undo",
  "Hard No",
];

function stripAllowlist(html) {
  let out = html;
  for (const term of ASTER_ALLOWLIST) {
    out = out.split(term).join("");
  }
  return out;
}

async function fetchRoute(path) {
  const res = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  const html = await res.text();
  return { status: res.status, html };
}

function checkLang(html, expected) {
  const match = html.match(/<html[^>]*\blang="([^"]+)"/i);
  const found = match?.[1];
  return { pass: found === expected, found };
}

function findInternalLinks(html) {
  const links = [];
  const re = /<a\s+[^>]*href="(\/[^"#][^"]*)"/gi;
  let m;
  while ((m = re.exec(html))) {
    links.push(m[1]);
  }
  return links;
}

// Assets estáticos (PDF, imagens etc.) não são rotas localizadas — são o
// mesmo arquivo pras duas versões de idioma, então ficam fora do check.
const STATIC_ASSET = /\.[a-z0-9]{2,4}$/i;

function checkLinksStayInLocale(links, locale) {
  const violations = [];
  for (const href of links) {
    if (STATIC_ASSET.test(href)) continue;
    const isEnHref = href === "/en" || href.startsWith("/en/");
    if (locale === "pt" && isEnHref) violations.push(href);
    if (locale === "en" && !isEnHref) violations.push(href);
  }
  return [...new Set(violations)];
}

function checkResidualStrings(html, locale) {
  const blocklist = locale === "pt" ? EN_ONLY_WORDS : PT_ONLY_WORDS;
  const haystack = locale === "pt" ? stripAllowlist(html) : html;
  return blocklist.filter((word) => haystack.includes(word));
}

async function run() {
  let failures = 0;
  console.log(`Checando bilíngue PT/EN contra ${baseUrl}\n`);

  for (const path of PT_ROUTES) {
    const { status, html } = await fetchRoute(path);
    const lang = checkLang(html, "pt-BR");
    // O seletor de idioma aponta de propósito pra rota EN equivalente —
    // exclui esse único link do check de "fica no idioma atual".
    const links = findInternalLinks(html).filter((h) => !html.includes(`href="${h}" aria-label="Mudar para`));
    const linkViolations = checkLinksStayInLocale(links, "pt");
    const residual = checkResidualStrings(html, "pt");

    const ok = status === 200 && lang.pass && linkViolations.length === 0 && residual.length === 0;
    if (!ok) failures++;
    console.log(`${ok ? "✓" : "✗"} PT ${path} — status ${status}, lang=${lang.found ?? "?"}`);
    if (!lang.pass) console.log(`   lang esperado "pt-BR", achou "${lang.found}"`);
    if (linkViolations.length) console.log(`   links saindo do PT: ${linkViolations.join(", ")}`);
    if (residual.length) console.log(`   possível string em EN vazando: ${residual.join(", ")}`);
  }

  console.log("");

  for (const path of EN_ROUTES) {
    const { status, html } = await fetchRoute(path);
    const lang = checkLang(html, "en");
    const links = findInternalLinks(html).filter((h) => !html.includes(`href="${h}" aria-label="Switch to`));
    const linkViolations = checkLinksStayInLocale(links, "en");
    const residual = checkResidualStrings(html, "en");

    const ok = status === 200 && lang.pass && linkViolations.length === 0 && residual.length === 0;
    if (!ok) failures++;
    console.log(`${ok ? "✓" : "✗"} EN ${path} — status ${status}, lang=${lang.found ?? "?"}`);
    if (!lang.pass) console.log(`   lang esperado "en", achou "${lang.found}"`);
    if (linkViolations.length) console.log(`   links saindo do EN: ${linkViolations.join(", ")}`);
    if (residual.length) console.log(`   possível string em PT vazando: ${residual.join(", ")}`);
  }

  console.log(`\n${failures === 0 ? "Tudo passou." : `${failures} rota(s) com problema.`}`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error("Erro rodando a verificação:", err.message);
  console.error("O servidor está rodando em", baseUrl, "? (npm run dev, ou build+start)");
  process.exit(1);
});
