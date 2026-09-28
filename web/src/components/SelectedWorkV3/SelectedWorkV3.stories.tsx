import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SelectedWorkV3 } from "./SelectedWorkV3";

const meta = {
  title: "V3/SelectedWorkV3",
  component: SelectedWorkV3,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Rail responsivo dos cinco cases. Desktop 1993/1327, tablet 778 e mobile 390 conferidos nos nodes 2262:61769, 2262:61910, 2262:62051 e 2262:62192.",
      },
    },
  },
  args: { locale: "en" },
  argTypes: { locale: { control: "radio", options: ["en", "pt"] } },
} satisfies Meta<typeof SelectedWorkV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PortfolioHomeEnglish: Story = {};

export const PortfolioHomePortuguese: Story = { args: { locale: "pt" } };

export const PortfolioHomeMobile390: Story = {
  globals: { viewport: { value: "mobile1" } },
};
