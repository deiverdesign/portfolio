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
    backgroundDesktop: raster("/images/v3/cases/intuit/hero-bg-desktop.png", 3280, 1008),
    backgroundTablet: raster("/images/v3/cases/intuit/hero-bg-tablet.png", 1876, 1634),
    backgroundMobile: raster("/images/v3/cases/intuit/hero-bg-mobile.png", 1378, 1755),
    // Trocado em 30/09/2026 pela versão em melhor qualidade que o Deiver
    // reexportou (era a mesma foto, mas em baixa).
    devices: raster("/images/v3/cases/intuit/hero-devices.png", 900, 809),
  },
  decisions: {
    // Decision 1 — Build the Foundations Before the Direction Was Settled.
    phones: raster("/images/v3/cases/intuit/decisions-1-phones.png", 1554, 1014),
    // Miniatura 1 — tela do sistema de tokens (Frame 446 no Figma).
    tokens: raster("/images/v3/cases/intuit/decisions-2-tokens.png", 894, 654),
    // Miniatura 2 — close da tabela de escala tipográfica (Image2-Line2).
    typeScale: raster("/images/v3/cases/intuit/decisions-3-typescale.png", 897, 654),
  },
  research: {
    // Composição já fechada (fundo azul + texto + as 4 fotos de
    // entrevistados) — uma imagem só, não uma montagem em código.
    interviews: raster("/images/v3/cases/intuit/research-interviews.png", 1200, 790),
  },
  cards: [
    raster("/images/v3/cases/intuit/research-card-1.png", 2098, 659),
    raster("/images/v3/cases/intuit/research-card-2.png", 2098, 659),
    raster("/images/v3/cases/intuit/research-card-3.png", 2098, 659),
  ] as RasterAsset[],
  outcome: {
    designSystem: raster("/images/v3/cases/intuit/outcome-design-system.png", 1452, 1035),
    bento: raster("/images/v3/cases/intuit/outcome-bento.png", 834, 603),
    lifestyle: raster("/images/v3/cases/intuit/outcome-lifestyle.png", 767, 603),
  },
};
