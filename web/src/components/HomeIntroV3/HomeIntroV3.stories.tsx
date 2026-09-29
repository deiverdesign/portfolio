import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HomeIntroV3 } from "./HomeIntroV3";

const meta = {
  title: "V3/HomeIntroV3",
  component: HomeIntroV3,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Cenário real da abertura da Home: HexagonIntro reverse, handoff do quadrado e entrada do HomeHeroV3. A story desliga a memória de sessão para permitir replay ao recarregar.",
      },
    },
  },
  args: {
    locale: "en",
    sessionKey: null,
    introEnabled: true,
  },
  argTypes: {
    locale: { control: "radio", options: ["en", "pt"] },
    introEnabled: { control: "boolean" },
    sessionKey: { control: false },
  },
} satisfies Meta<typeof HomeIntroV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstVisitDesktop: Story = {};

export const PortugueseFirstVisitDesktop: Story = {
  args: { locale: "pt" },
};

export const ReturningVisitDesktop: Story = {
  args: { introEnabled: false },
};
