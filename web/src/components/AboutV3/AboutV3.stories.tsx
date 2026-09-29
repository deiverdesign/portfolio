import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AboutV3 } from "./AboutV3";

const meta = {
  title: "V3/AboutV3",
  component: AboutV3,
  parameters: { layout: "fullscreen" },
  args: { locale: "en" },
} satisfies Meta<typeof AboutV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Portuguese: Story = { args: { locale: "pt" } };
