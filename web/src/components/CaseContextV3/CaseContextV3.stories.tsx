import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getCopy } from "@/content/site-copy";
import { SCRIOO_ASSETS } from "@/content/scrioo-assets";
import { CaseContextV3 } from "./CaseContextV3";

const meta = {
  title: "V3/Case/CaseContextV3",
  component: CaseContextV3,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CaseContextV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scrioo: Story = {
  args: {
    eyebrow: getCopy("en", "shared.case.context.eyebrow"),
    title: getCopy("en", "scrioo.context.title"),
    paragraphs: [
      getCopy("en", "scrioo.context.p1"),
      getCopy("en", "scrioo.context.p2"),
      getCopy("en", "scrioo.context.p3"),
    ],
    media: (
      <img
        src={SCRIOO_ASSETS.context.beforeAfter.src}
        width={SCRIOO_ASSETS.context.beforeAfter.width}
        height={SCRIOO_ASSETS.context.beforeAfter.height}
        alt=""
      />
    ),
  },
};
