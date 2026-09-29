import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HomeV3 } from "./HomeV3";

const meta = {
  title: "V3/HomeV3",
  component: HomeV3,
  parameters: { layout: "fullscreen" },
  args: {
    locale: "en",
    introEnabled: false,
    introSessionKey: null,
  },
  argTypes: {
    locale: { control: "radio", options: ["en", "pt"] },
  },
} satisfies Meta<typeof HomeV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteHomeEnglish: Story = {};

export const CompleteHomePortuguese: Story = { args: { locale: "pt" } };

export const CompleteHomeMobile390: Story = {
  globals: { viewport: { value: "mobile1" } },
};

export const FirstVisitMotionEnglish: Story = {
  args: { introEnabled: true },
};
