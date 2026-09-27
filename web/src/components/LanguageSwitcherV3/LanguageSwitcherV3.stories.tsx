import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LanguageSwitcherV3 } from "./LanguageSwitcherV3";

const meta = {
  title: "V3/LanguageSwitcherV3",
  component: LanguageSwitcherV3,
  args: { locale: "en" },
  argTypes: {
    locale: { control: "radio", options: ["en", "pt"] },
  },
} satisfies Meta<typeof LanguageSwitcherV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Portuguese: Story = {
  args: { locale: "pt" },
};
