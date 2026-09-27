import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ContactCTA } from "./ContactCTA";

const meta = {
  title: "V3/ContactCTA",
  component: ContactCTA,
  parameters: { layout: "fullscreen" },
  args: {
    locale: "en",
    contactHref: "#contact",
  },
} satisfies Meta<typeof ContactCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {
  args: { locale: "en" },
};

export const Portuguese: Story = {
  args: { locale: "pt" },
};

export const Mobile: Story = {
  args: { locale: "en" },
  globals: { viewport: { value: "mobile1" } },
};
