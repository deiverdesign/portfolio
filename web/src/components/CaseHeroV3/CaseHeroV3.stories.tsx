import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getCopy } from "@/content/site-copy";
import { SCRIOO_ASSETS } from "@/content/scrioo-assets";
import { CaseHeroV3 } from "./CaseHeroV3";

const meta = {
  title: "V3/Case/CaseHeroV3",
  component: CaseHeroV3,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CaseHeroV3>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mesmo texto usado no hover do card da Home (SelectedWorkV3 `TAGS.scrioo`)
// — precedente já existente de manter esses rótulos em inglês nas duas
// línguas, não são chaves do catálogo ainda.
const SCRIOO_HERO_TAGS = ["Design Systems", "AI", "Data-heavy UX"];

export const English: Story = {
  args: {
    locale: "en",
    tags: SCRIOO_HERO_TAGS,
    title: getCopy("en", "scrioo.hero.title"),
    summary: getCopy("en", "scrioo.hero.summary"),
    backHref: "/v3",
    devices: SCRIOO_ASSETS.hero.devices,
    backgroundDesktop: SCRIOO_ASSETS.hero.backgroundDesktop,
    backgroundTablet: SCRIOO_ASSETS.hero.backgroundTablet,
    backgroundMobile: "var(--gradient-case-scrioo-hero-mobile)",
    noiseColor: "var(--color-case-scrioo-accent)",
  },
};

export const Portuguese: Story = {
  args: {
    ...English.args,
    locale: "pt",
    tags: SCRIOO_HERO_TAGS,
    title: getCopy("pt", "scrioo.hero.title"),
    summary: getCopy("pt", "scrioo.hero.summary"),
    backHref: "/pt/v3",
  },
};
