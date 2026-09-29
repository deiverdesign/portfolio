import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HomeHeroV3 } from "./HomeHeroV3";

const meta = {
  title: "V3/HomeHeroV3",
  component: HomeHeroV3,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Estado estático final do hero. Paridade desktop: Figma 2262:61722 (wide) e 2262:61863 (narrow). Tablet/mobile ainda não têm contrato visual aprovado.",
      },
    },
  },
  args: {
    locale: "en",
  },
  argTypes: {
    locale: { control: "radio", options: ["en", "pt"] },
  },
} satisfies Meta<typeof HomeHeroV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnglishDesktop: Story = {};

export const PortugueseDesktop: Story = {
  args: { locale: "pt" },
};
