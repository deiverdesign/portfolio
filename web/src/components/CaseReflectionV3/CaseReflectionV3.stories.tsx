import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getCopy } from "@/content/site-copy";
import { CaseReflectionV3 } from "./CaseReflectionV3";

const meta = {
  title: "V3/Case/CaseReflectionV3",
  component: CaseReflectionV3,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CaseReflectionV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScriooToHp: Story = {
  args: {
    eyebrow: getCopy("en", "shared.case.reflection.eyebrow"),
    title: getCopy("en", "scrioo.reflection.title"),
    lead: getCopy("en", "scrioo.reflection.lead"),
    quote: getCopy("en", "scrioo.reflection.quote"),
    close: getCopy("en", "scrioo.reflection.close"),
    nextLabel: getCopy("en", "shared.case.next"),
    next: {
      href: "/cases/hp",
      logoSrc: "/images/brands/hp.svg",
      logoAlt: "HP",
      name: getCopy("en", "shared.cases.hp.name"),
      summary: getCopy("en", "shared.cases.hp.summary"),
      background: "var(--color-case-hp-surface)",
    },
  },
};
