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
    backgroundDesktop: raster("/images/v3/cases/hp/hero-bg-desktop.webp", 3280, 1008),
    backgroundTablet: raster("/images/v3/cases/hp/hero-bg-tablet.webp", 1868, 1634),
    devices: raster("/images/v3/cases/hp/hero-devices.webp", 1554, 1152),
  },
  context: {
    account: raster("/images/v3/cases/hp/context-account.webp", 1818, 1434),
  },
  decisions: {
    devices: raster("/images/v3/cases/hp/decisions-devices.webp", 1728, 1140),
  },
  openQuestions: {
    overview: raster("/images/v3/cases/hp/open-questions.webp", 1800, 1185),
    cards: [
      raster("/images/v3/cases/hp/open-questions-return.webp", 2517, 791),
      raster("/images/v3/cases/hp/open-questions-damage.webp", 2517, 791),
      raster("/images/v3/cases/hp/open-questions-evidence.webp", 2517, 791),
    ],
  },
  outcome: {
    system: raster("/images/v3/cases/hp/outcome-system.webp", 1452, 951),
    brand: raster("/images/v3/cases/hp/outcome-brand.webp", 963, 603),
    typeGlyph: "/images/v3/cases/hp/outcome-type.svg",
    typeLabel: "/images/v3/cases/hp/outcome-type-label.svg",
  },
} as const;
