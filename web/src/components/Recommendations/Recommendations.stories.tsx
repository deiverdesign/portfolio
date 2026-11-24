import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Recommendations } from "./Recommendations";

const meta = {
  title: "V3/Recommendations",
  component: Recommendations,
  parameters: { layout: "fullscreen" },
  args: { locale: "en" },
} satisfies Meta<typeof Recommendations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnglishCollapsed: Story = {};

export const EnglishExpanded: Story = {
  args: { initialExpanded: true },
};

export const Portuguese: Story = {
  args: { locale: "pt" },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
