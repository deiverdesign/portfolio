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
    jobTitle: "/images/v3/home/identity/job-title.svg",
    locationTree: "/images/v3/home/identity/tree-floripa.svg",
  },
  hero: {
    graphism: raster("/images/v3/home/hero/deiver-graphism.png", 3510, 2154),
  },
  capabilities: [
    raster("/images/v3/home/capabilities/capability-01.png", 895, 510),
    raster("/images/v3/home/capabilities/capability-02.png", 895, 510),
    raster("/images/v3/home/capabilities/capability-03.png", 895, 551),
  ],
  contact: {
    availableLabel: {
      en: "/images/v3/home/contact/available-label-en.svg",
      pt: "/images/v3/home/contact/available-label-pt.svg",
    },
    portrait: raster("/images/v3/home/contact/portrait.png", 484, 587),
    graphismBackground: "/images/v3/home/contact/graphism-background.svg",
  },
  decorative: {
    hexagonPattern: "/images/v3/home/decorative/hexagon-pattern.svg",
  },
  cases: {
    scrioo: {
      container: raster("/images/v3/home/cases/scrioo-container.png", 716, 771),
      devices: raster("/images/v3/home/cases/scrioo-devices.png", 2585, 1915),
    },
    hp: {
      devices: raster("/images/v3/home/cases/hp-devices.png", 1300, 912),
      devicesMobile: raster("/images/v3/home/cases/hp-devices-mobile.png", 4096, 2895),
    },
    theodoor: {
      device: raster("/images/v3/home/cases/theodoor-device.png", 1121, 1038),
      deviceMobile: raster("/images/v3/home/cases/theodoor-device-mobile.png", 2248, 1760),
    },
    intuit: {
      device: raster("/images/v3/home/cases/intuit-device.png", 942, 1224),
      deviceMobile: raster("/images/v3/home/cases/intuit-device-mobile.png", 1084, 1416),
    },
    aster: {
      background: raster("/images/v3/home/cases/aster-background.png", 1497, 1885),
      foreground: raster("/images/v3/home/cases/aster-foreground.png", 1200, 1008),
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

/** "mark" = selo/badge, aspect ratio ~1:1 (HP, McCormick, NSC, HSS).
 * "wordmark" = nome escrito, aspect ratio bem mais largo que alto (os
 * outros 9). Classificação medida em 27/09/2026 a partir do PDF de
 * referência do Deiver (Icones-tamanhos.pdf) — ver
 * `--logo-height-mark`/`--logo-height-wordmark` em tokens-v3.css pro
 * porquê essa distinção existe. */
export type HomeBrandLogoType = "mark" | "wordmark";

export const HOME_BRAND_LOGO_TYPE: Record<HomeBrand, HomeBrandLogoType> = {
  hp: "mark",
  mccormick: "mark",
  nsc: "mark",
  hss: "mark",
  aster: "wordmark",
  cirrus: "wordmark",
  intuit: "wordmark",
  lightship: "wordmark",
  scrioo: "wordmark",
  softplan: "wordmark",
  theodoor: "wordmark",
  "track-and-field": "wordmark",
  unimed: "wordmark",
};

export function getHomeBrandLogo(brand: HomeBrand, variant: HomeBrandVariant): string {
  return `/images/v3/home/brands/${variant}/${brand}.svg`;
}
