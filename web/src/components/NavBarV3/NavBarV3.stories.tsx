import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NavBarV3 } from "./NavBarV3";

const LINKS_EN = [
  { label: "Home", href: "/", active: true },
  { label: "About me", href: "/about" },
  { label: "Contact", href: "/#contact" },
  { label: "Resume", href: "/resume.pdf" },
];

const meta = {
  title: "V3/NavBarV3",
  component: NavBarV3,
  parameters: { layout: "fullscreen" },
  args: {
    locale: "en",
    context: "light",
    links: LINKS_EN,
  },
  argTypes: {
    context: { control: "radio", options: ["light", "dark"] },
  },
} satisfies Meta<typeof NavBarV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};

export const Dark: Story = {
  args: { context: "dark" },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
};
