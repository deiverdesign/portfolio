import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FooterV3 } from "./FooterV3";

const meta = {
  title: "V3/FooterV3",
  component: FooterV3,
  parameters: { layout: "fullscreen" },
  args: {
    locale: "en",
    homeHref: "/",
    aboutHref: "/about",
    resumeHref: "/resume.pdf",
    linkedinHref: "https://linkedin.com/in/deiverbrito",
  },
} satisfies Meta<typeof FooterV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Portuguese: Story = {
  args: { locale: "pt" },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
