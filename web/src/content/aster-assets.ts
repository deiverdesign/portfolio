import type { RasterAsset } from "./home-assets";

function raster(src: string, width: number, height: number): RasterAsset {
  return { src, width, height };
}

export const ASTER_ASSETS = {
  hero: {
    backgroundDesktop: raster("/images/v3/cases/aster/hero-bg-desktop.png", 3280, 1008),
    backgroundTablet: raster("/images/v3/cases/aster/hero-bg-tablet.png", 1880, 1634),
    backgroundMobile: raster("/images/v3/cases/aster/hero-bg-mobile.png", 1653, 2106),
    devices: raster("/images/v3/cases/aster/hero-devices.png", 1168, 976),
  },
  context: raster("/images/v3/cases/aster/context.png", 1818, 1434),
  decisions: {
    primary: raster("/images/v3/cases/aster/decisions-1.png", 1554, 1014),
    secondary: raster("/images/v3/cases/aster/decisions-2.png", 1002, 603),
    tertiary: raster("/images/v3/cases/aster/decisions-3.png", 948, 603),
  },
  limits: {
    overview: raster("/images/v3/cases/aster/limits-overview.png", 1800, 1041),
    cards: [
      raster("/images/v3/cases/aster/limits-card-1.png", 2517, 791),
      raster("/images/v3/cases/aster/limits-card-2.png", 2517, 791),
      raster("/images/v3/cases/aster/limits-card-3.png", 2517, 791),
    ],
  },
  outcome: {
    primary: raster("/images/aster/aster-prototype-hero.png", 1200, 800),
    secondary: raster("/images/aster/aster-closing-workspace.png", 1200, 800),
    extra: raster("/images/aster/aster-figjam-overview.png", 1200, 800),
  },
} as const;
