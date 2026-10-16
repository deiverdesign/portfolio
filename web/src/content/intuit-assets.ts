import type { RasterAsset } from "./home-assets";

function raster(src: string, width: number, height: number): RasterAsset {
  return { src, width, height };
}

/**
 * Figma: seção "Cases-Intuit" na página `Update-Incremental`, node
 * 2262:68921 (Desktop). Assets exportados pelo Deiver em 30/09/2026 em
 * `/Users/deiverbrito/Desktop/portfolio assets v3/Intuit`, copiados sem
 * reamostrar. Diferente da SCRIOO/HP: o Deiver exportou uma imagem real
 * pro fundo do hero mobile (não é gradiente CSS).
 */
export const INTUIT_ASSETS = {
  hero: {
    backgroundDesktop: raster("/images/v3/cases/intuit/hero-bg-desktop.webp", 3280, 1008),
    backgroundTablet: raster("/images/v3/cases/intuit/hero-bg-tablet.webp", 1876, 1634),
    backgroundMobile: raster("/images/v3/cases/intuit/hero-bg-mobile.webp", 1378, 1755),
    // Diferente das outras cases: Intuit usa um crop diferente por
    // breakpoint (Figma confirmado pelo Deiver em 30/09/2026) — a foto de
    // corpo inteiro só cabe numa tela mais alta (desktop); tablet/mobile
    // usam um corte mais fechado (cabeça+ombros). `devices` é o corte
    // fechado (base/fallback), `devicesDesktop` sobrescreve em telas
    // largas via `<picture>` em CaseHeroV3.
    // Trocado de novo em 30/09/2026 (v3) — proporção mais larga/curta,
    // funciona melhor dentro do teto de 700px do hero no tablet.
    devices: raster("/images/v3/cases/intuit/hero-devices-tablet.webp", 1196, 825),
    devicesDesktop: raster("/images/v3/cases/intuit/hero-devices-desktop.webp", 1029, 1272),
  },
  decisions: {
    // Decision 1 — Build the Foundations Before the Direction Was Settled.
    phones: raster("/images/v3/cases/intuit/decisions-1-phones.webp", 1554, 1014),
    // Miniatura 1 — tela do sistema de tokens (Frame 446 no Figma).
    tokens: raster("/images/v3/cases/intuit/decisions-2-tokens.webp", 894, 654),
    // Miniatura 2 — close da tabela de escala tipográfica (Image2-Line2).
    typeScale: raster("/images/v3/cases/intuit/decisions-3-typescale.webp", 897, 654),
  },
  research: {
    // Composição já fechada (fundo azul + texto + as 4 fotos de
    // entrevistados) — uma imagem só, não uma montagem em código.
    interviews: raster("/images/v3/cases/intuit/research-interviews.webp", 1200, 790),
  },
  cards: [
    raster("/images/v3/cases/intuit/research-card-1.webp", 2098, 659),
    raster("/images/v3/cases/intuit/research-card-2.webp", 2098, 659),
    raster("/images/v3/cases/intuit/research-card-3.webp", 2098, 659),
  ] as RasterAsset[],
  outcome: {
    designSystem: raster("/images/v3/cases/intuit/outcome-design-system.webp", 1452, 1035),
    bento: raster("/images/v3/cases/intuit/outcome-bento.webp", 834, 603),
    lifestyle: raster("/images/v3/cases/intuit/outcome-lifestyle.webp", 767, 603),
  },
};
