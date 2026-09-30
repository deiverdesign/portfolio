import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getCopy, type CopyKey } from "@/content/site-copy";
import { SCRIOO_ASSETS } from "@/content/scrioo-assets";
import { CaseValidationV3 } from "./CaseValidationV3";

const meta = {
  title: "V3/Case/CaseValidationV3",
  component: CaseValidationV3,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CaseValidationV3>;

export default meta;
type Story = StoryObj<typeof meta>;

const BANNERS = [
  SCRIOO_ASSETS.validation.banner1,
  SCRIOO_ASSETS.validation.banner2,
  SCRIOO_ASSETS.validation.banner3,
];

function card(locale: "en" | "pt", index: 1 | 2 | 3) {
  return {
    banner: BANNERS[index - 1],
    name: getCopy(locale, `scrioo.validation.${index}.name` as CopyKey),
    questionLabel: getCopy(locale, "shared.case.validation.question"),
    question: getCopy(locale, `scrioo.validation.${index}.question` as CopyKey),
    testLabel: getCopy(locale, "shared.case.validation.test"),
    test: getCopy(locale, `scrioo.validation.${index}.test` as CopyKey),
    changedLabel: getCopy(locale, "shared.case.validation.changed"),
    changed: getCopy(locale, `scrioo.validation.${index}.changed` as CopyKey),
  };
}

export const Scrioo: Story = {
  args: {
    eyebrow: getCopy("en", "shared.case.validation.eyebrow"),
    title: getCopy("en", "scrioo.validation.title"),
    body: getCopy("en", "scrioo.validation.body"),
    media: SCRIOO_ASSETS.validation.darkModeTablet,
    cards: [card("en", 1), card("en", 2), card("en", 3)],
    conclusion: getCopy("en", "scrioo.validation.conclusion"),
  },
};
