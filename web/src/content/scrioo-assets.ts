import type { RasterAsset } from "./home-assets";

function raster(src: string, width: number, height: number): RasterAsset {
  return { src, width, height };
}

/**
 * Figma: seção "SCRIOO" na página `Update-Incremental`, nodes 2262:65858
 * (Desktop), 2262:66000 (Laptop), 2262:66168 (Tablet), 2262:66324 (Mobile).
 * Assets exportados pelo Deiver em 29/09/2026 em
 * `/Users/deiverbrito/Desktop/portfolio assets v3/SCRIOO`, copiados sem
 * reamostrar.
 */
export const SCRIOO_ASSETS = {
  hero: {
    // Desktop e tablet usam a imagem exportada (cor + luz atmosférica já
    // incorporadas, conforme o contrato de hero background do
    // V3-HANDOFF.md). Mobile não tem imagem: é um gradiente radial CSS
    // puro, ver `--gradient-case-scrioo-hero-mobile` em tokens-v3.css.
    backgroundDesktop: raster("/images/v3/cases/scrioo/hero-bg-desktop.png", 3280, 1008),
    backgroundTablet: raster("/images/v3/cases/scrioo/hero-bg-tablet.png", 1868, 1634),
    devices: raster("/images/v3/cases/scrioo/hero-devices.png", 2585, 1915),
  },
  context: {
    // Estava salvo como "Intuit-img3.png" na pasta de exportação — nome
    // errado, conteúdo é o before/after do mapa de risco da SCRIOO
    // (confirmado abrindo o arquivo, não pelo nome). Ver lição do
    // NORTE.md 2.2/7: nome de arquivo é rótulo, não conteúdo.
    beforeAfter: raster("/images/v3/cases/scrioo/context-before-after.png", 1818, 1434),
  },
  decisions: {
    // Decision 1 — Simplify Risk Markers on the Map.
    phones: raster("/images/v3/cases/scrioo/decisions-1-phones.png", 1036, 676),
    // Decision 2 — Compare Supplier Risk Over Time.
    collage: raster("/images/v3/cases/scrioo/decisions-2-collage.png", 668, 388),
    // Decision 3 — Use Progressive Disclosure for Dense Information. Zoom
    // na tela (sem mãos), diferente da foto de mãos+tablet reaproveitada
    // no Outcome (secondaryMedia) — são dois crops legítimos da mesma
    // sessão de fotos, não a mesma imagem duas vezes (confirmado no
    // Figma em 29/09/2026: o Outcome usa mesmo a foto de mãos completa).
    tabletZoom: raster("/images/v3/cases/scrioo/decisions-3-tablet-zoom.png", 840, 388),
    // Reaproveitada como está no Outcome (secondaryMedia) — não renomear
    // pra "hands" nem afins, mantém o nome histórico do dado.
    tabletMap: raster("/images/v3/cases/scrioo/decisions-3-tablet-map.png", 636, 402),
  },
  validation: {
    // Mockup do tablet com o rótulo "Dark mode" já embutido na imagem.
    darkModeTablet: raster("/images/v3/cases/scrioo/validation-darkmode-tablet.png", 2055, 1335),
    // Ilustrações abstratas no topo de cada card do carrossel, na mesma
    // ordem dos 3 itens de validação. Adicionadas pelo Deiver em
    // 29/09/2026 (faltavam no primeiro lote de assets).
    banner1: raster("/images/v3/cases/scrioo/validation-1-banner.png", 2098, 659),
    banner2: raster("/images/v3/cases/scrioo/validation-2-banner.png", 2098, 659),
    banner3: raster("/images/v3/cases/scrioo/validation-3-banner.png", 2098, 659),
  },
  outcome: {
    accessibilityHandoff: raster(
      "/images/v3/cases/scrioo/outcome-accessibility-handoff.png",
      968,
      634,
    ),
    // Dois SVGs de glifo (não texto real) — mesmo padrão dos ícones: o
    // Figma exportou os traçados, não uma string editável.
    typeSpecimenGlyph: "/images/v3/cases/scrioo/outcome-typespecimen.svg",
    typeSpecimenLabel: "/images/v3/cases/scrioo/outcome-typespecimen-label.svg",
  },
} as const;
