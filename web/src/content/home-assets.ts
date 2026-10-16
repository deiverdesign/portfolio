export interface RasterAsset {
  src: string;
  width: number;
  height: number;
}

function raster(src: string, width: number, height: number): RasterAsset {
  return { src, width, height };
}

export const HOME_ASSETS = {
  identity: {
    logo: "/images/v3/home/identity/deiver-logo.svg",
    // Versão clara de verdade (fill trocado no arquivo, não filtro CSS) —
    // achado do Deiver em 28/09/2026: invert()+brightness() no NavBarV3
    // deixava o logo serrilhado sobre o fundo escuro do hero.
    logoInverse: "/images/v3/home/identity/deiver-logo-inverse.svg",
    jobTitle: "/images/v3/home/identity/job-title.svg",
    locationTree: "/images/v3/home/identity/tree-floripa.svg",
    // Exportado em 27/09/2026 (node "DEIVER-Graphism-Footer", 57×35) — só
    // usado no FooterV3, ao lado do copyright.
    graphismFooter: "/images/v3/home/identity/graphism-footer.svg",
  },
  hero: {
    // srcMobile: variante de 2280px de largura (vs 3040 do arquivo cheio),
    // pro <img srcSet> do HomeHeroV3 não baixar a versão desktop em telas
    // pequenas (Deiver, 16/10 — ~85KB em vez de ~150KB nesse tamanho).
    // 2280, não 1140: o slot mobile no CSS é 1140px, mas a maioria dos
    // celulares tem DPR 2 (precisa de ~2280px físicos pra ficar nítido).
    graphism: { ...raster("/images/v3/home/hero/deiver-graphism.webp", 3040, 1864), srcMobile: "/images/v3/home/hero/deiver-graphism-2280.webp" },
  },
  capabilities: [
    raster("/images/v3/home/capabilities/capability-01.webp", 895, 510),
    raster("/images/v3/home/capabilities/capability-02.webp", 895, 510),
    raster("/images/v3/home/capabilities/capability-03.webp", 895, 551),
  ],
  contact: {
    availableLabel: {
      en: "/images/v3/home/contact/available-label-en.svg",
      pt: "/images/v3/home/contact/available-label-pt.svg",
    },
    // Substituído em 27/09/2026: o Deiver atualizou o recorte no Figma
    // (node 1729:13198) — retrato já cortado no hexágono, sem o fundo
    // solto em volta que o antigo portrait.png tinha.
    portrait: raster("/images/v3/home/contact/portrait-hex.webp", 1128, 1368),
    graphismBackground: "/images/v3/home/contact/graphism-background.svg",
    graphismBackgroundTablet: "/images/v3/home/contact/graphism-tablet.svg",
  },
  decorative: {
    hexagonPattern: "/images/v3/home/decorative/hexagon-pattern.svg",
  },
  cases: {
    scrioo: {
      container: raster("/images/v3/home/cases/scrioo-container.webp", 716, 771),
      devices: raster("/images/v3/home/cases/scrioo-devices.webp", 2585, 1915),
    },
    hp: {
      devices: raster("/images/v3/home/cases/hp-devices.webp", 1300, 912),
      devicesMobile: raster("/images/v3/home/cases/hp-devices-mobile.webp", 4096, 2895),
    },
    theodoor: {
      device: raster("/images/v3/home/cases/theodoor-device.webp", 1121, 1038),
      deviceMobile: raster("/images/v3/home/cases/theodoor-device-mobile.webp", 2248, 1760),
    },
    intuit: {
      device: raster("/images/v3/home/cases/intuit-device.webp", 942, 1224),
      deviceMobile: raster("/images/v3/home/cases/intuit-device-mobile.webp", 1084, 1416),
    },
    aster: {
      background: raster("/images/v3/home/cases/aster-background.webp", 1497, 1885),
      foreground: raster("/images/v3/home/cases/aster-foreground.webp", 1200, 1008),
    },
  },
} as const;

export const HOME_BRANDS = [
  "aster",
  "cirrus",
  "hp",
  "hss",
  "intuit",
  "lightship",
  "mccormick",
  "nsc",
  "scrioo",
  "softplan",
  "theodoor",
  "track-and-field",
  "unimed",
] as const;

export type HomeBrand = (typeof HOME_BRANDS)[number];
export type HomeBrandVariant = "original" | "white";

/**
 * Tamanho "óptico" real de cada logo, em px, direto do componente raiz do
 * Figma (node 741:2636, symbol "Style=Default" de cada `Brands/*`,
 * conferido em 28/09/2026). Substitui a classificação anterior em só 2
 * baldes ("mark"/"wordmark" com altura fixa por balde) — o Deiver calibrou
 * esses 13 tamanhos individualmente no Figma pra já saírem opticamente
 * equivalentes entre si, então aqui é só ler o valor, não aproximar.
 *
 * Pra usar num contexto (case card, seção Brands, etc.): multiplique
 * width/height pela MESMA escala em todo o conjunto — nunca escale um
 * logo sozinho, ou volta a quebrar o equilíbrio óptico entre eles.
 */
export interface HomeBrandLogoSize {
  width: number;
  height: number;
}

export const HOME_BRAND_LOGO_SIZE: Record<HomeBrand, HomeBrandLogoSize> = {
  intuit: { width: 65.78, height: 12.6 },
  theodoor: { width: 86.18, height: 27.09 },
  cirrus: { width: 85.78, height: 16.64 },
  "track-and-field": { width: 47.84, height: 26.1 },
  lightship: { width: 72.97, height: 20.2 },
  hp: { width: 29.9, height: 29.9 },
  unimed: { width: 88.32, height: 12.87 },
  mccormick: { width: 38.64, height: 31.9 },
  hss: { width: 31.97, height: 31.97 },
  nsc: { width: 38.98, height: 32.2 },
  softplan: { width: 75.44, height: 16.42 },
  aster: { width: 64.4, height: 21.47 },
  scrioo: { width: 58, height: 18 },
};

export function getHomeBrandLogo(brand: HomeBrand, variant: HomeBrandVariant): string {
  return `/images/v3/home/brands/${variant}/${brand}.svg`;
}

/** `HOME_BRAND_LOGO_SIZE[brand]` × `scale` — ver o aviso lá em cima sobre
 * nunca escalar um logo sozinho, fora dessa função. */
export function getHomeBrandLogoSize(brand: HomeBrand, scale: number): HomeBrandLogoSize {
  const base = HOME_BRAND_LOGO_SIZE[brand];
  return { width: base.width * scale, height: base.height * scale };
}
