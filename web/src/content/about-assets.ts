import type { RasterAsset } from "./home-assets";

function raster(src: string, width: number, height: number): RasterAsset {
  return { src, width, height };
}

/**
 * Figma: "Portfolio-Deiver-About", node 2262:64510 (Desktop-Laptop 1327px:
 * 2262:64648). Assets baixados em 28/09/2026 via get_design_context, não
 * recriados/aproximados.
 */
export const ABOUT_ASSETS = {
  hero: {
    // Recorte com leve overflow no Figma (a ilustração é ~5% maior que o
    // frame que a contém, cortada por overflow:hidden) — ver
    // AboutHeroV3.module.css pro tratamento exato dessa borda.
    graphism: raster("/images/v3/about/hero/deiver-graphism-about.png", 2145, 1472),
    photo: raster("/images/v3/about/hero/deiver-photo-about.png", 1320, 1485),
  },
  beliefs: {
    photo1: raster("/images/v3/about/beliefs/deiver-about-photo1.png", 1371, 582),
    photo2: raster("/images/v3/about/beliefs/deiver-about-photo2.png", 504, 555),
    photo3: raster("/images/v3/about/beliefs/deiver-about-photo3.png", 819, 555),
    // Diferente do badge estático usado no Home (HOME_ASSETS.contact.
    // availableLabel): este tem o texto "AVAILABLE TO WORK" cravado no
    // próprio SVG, sem variante por idioma — conferido visualmente no
    // Figma, não presumido igual ao do Home.
    availableBadge: "/images/v3/about/beliefs/available-badge.svg",
  },
} as const;
