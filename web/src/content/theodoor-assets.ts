import type { RasterAsset } from "./home-assets";

function raster(src: string, width: number, height: number): RasterAsset {
  return { src, width, height };
}

/** Exports canônicos fornecidos em `portfolio assets v3/Theodoor`. */
export const THEODOOR_ASSETS = {
  hero: {
    backgroundDesktop: raster("/images/v3/cases/theodoor/hero-bg-desktop.png", 3280, 1008),
    backgroundTablet: raster("/images/v3/cases/theodoor/hero-bg-tablet.png", 1688, 1634),
    devices: raster("/images/v3/cases/theodoor/hero-devices.png", 1551, 1248),
  },
  context: { image: raster("/images/v3/cases/theodoor/context.png", 1818, 1434) },
  decisions: {
    primary: raster("/images/v3/cases/theodoor/decisions-1.png", 1554, 1014),
    secondary: raster("/images/v3/cases/theodoor/decisions-2.png", 1002, 582),
    tertiary: raster("/images/v3/cases/theodoor/decisions-3.png", 504, 582),
  },
  prototyping: {
    overview: raster("/images/v3/cases/theodoor/prototyping-overview.png", 1800, 1239),
    cards: [
      raster("/images/v3/cases/theodoor/prototyping-1.png", 1678, 527),
      raster("/images/v3/cases/theodoor/prototyping-2.png", 1678, 527),
      raster("/images/v3/cases/theodoor/prototyping-3.png", 1678, 527),
    ],
  },
  outcome: {
    image: raster("/images/v3/cases/theodoor/outcome.png", 1500, 847),
    video: "/images/v3/cases/theodoor/outcome-prototype.mp4",
  },
} as const;
