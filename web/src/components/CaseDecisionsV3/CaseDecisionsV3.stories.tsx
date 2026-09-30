import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getCopy, type CopyKey } from "@/content/site-copy";
import { SCRIOO_ASSETS } from "@/content/scrioo-assets";
import { CaseDecisionsV3 } from "./CaseDecisionsV3";

const meta = {
  title: "V3/Case/CaseDecisionsV3",
  component: CaseDecisionsV3,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CaseDecisionsV3>;

export default meta;
type Story = StoryObj<typeof meta>;

function decision(locale: "en" | "pt", index: 1 | 2 | 3, media: { src: string; width: number; height: number }) {
  return {
    title: getCopy(locale, `scrioo.decisions.${index}.title` as CopyKey),
    problem: getCopy(locale, `scrioo.decisions.${index}.problem` as CopyKey),
    proposal: getCopy(locale, `scrioo.decisions.${index}.proposal` as CopyKey),
    argument: getCopy(locale, `scrioo.decisions.${index}.argument` as CopyKey),
    media,
  };
}

export const Scrioo: Story = {
  args: {
    locale: "en",
    eyebrow: getCopy("en", "shared.case.decisions.eyebrow"),
    title: getCopy("en", "scrioo.decisions.title"),
    items: [
      decision("en", 1, SCRIOO_ASSETS.decisions.phones),
      decision("en", 2, SCRIOO_ASSETS.decisions.collage),
      decision("en", 3, SCRIOO_ASSETS.decisions.tabletZoom),
    ],
  },
};
