import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BrandsSectionV3 } from "./BrandsSectionV3";

const meta = {
  title: "V3/BrandsSectionV3",
  component: BrandsSectionV3,
  parameters: { layout: "fullscreen" },
  args: { locale: "en" },
} satisfies Meta<typeof BrandsSectionV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Portuguese: Story = { args: { locale: "pt" } };
