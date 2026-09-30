import type { RasterAsset } from "./home-assets";

function raster(src: string, width: number, height: number): RasterAsset {
  return { src, width, height };
}

/**
 * Exports canônicos fornecidos em `portfolio assets v3/HP`. Mantê-los em
 * um manifesto separado faz o case seguir o mesmo contrato da SCRIOO e
 * evita referências a URLs temporárias do Figma.
 */
export const HP_ASSETS = {
  hero: {
    backgroundDesktop: raster("/images/v3/cases/hp/hero-bg-desktop.png", 3280, 1008),
    backgroundTablet: raster("/images/v3/cases/hp/hero-bg-tablet.png", 1868, 1634),
    devices: raster("/images/v3/cases/hp/hero-devices.png", 1554, 1152),
  },
  context: {
    account: raster("/images/v3/cases/hp/context-account.png", 1818, 1434),
  },
  decisions: {
    devices: raster("/images/v3/cases/hp/decisions-devices.png", 1728, 1140),
  },
  openQuestions: {
    overview: raster("/images/v3/cases/hp/open-questions.png", 1800, 1185),
    cards: [
      raster("/images/v3/cases/hp/open-questions-return.png", 2517, 791),
      raster("/images/v3/cases/hp/open-questions-damage.png", 2517, 791),
      raster("/images/v3/cases/hp/open-questions-evidence.png", 2517, 791),
    ],
  },
  outcome: {
    system: raster("/images/v3/cases/hp/outcome-system.png", 1452, 951),
    brand: raster("/images/v3/cases/hp/outcome-brand.png", 963, 603),
    typeGlyph: "/images/v3/cases/hp/outcome-type.svg",
    typeLabel: "/images/v3/cases/hp/outcome-type-label.svg",
  },
} as const;
