import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CapabilitiesV3 } from "./CapabilitiesV3";

const meta = {
  title: "V3/CapabilitiesV3",
  component: CapabilitiesV3,
  parameters: { layout: "fullscreen" },
  args: { locale: "en" },
} satisfies Meta<typeof CapabilitiesV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Portuguese: Story = { args: { locale: "pt" } };
