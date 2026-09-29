import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EyebrowV3 } from "./EyebrowV3";

const meta = {
  title: "V3/EyebrowV3",
  component: EyebrowV3,
  parameters: { layout: "centered" },
  args: { children: "Section label", gap: 8 },
  argTypes: {
    gap: { control: { type: "range", min: 0, max: 32, step: 1 } },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: 320, minHeight: 160, display: "grid", placeItems: "center" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EyebrowV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Entry: Story = {};

export const LongLabel: Story = {
  args: { children: "A longer reusable section label" },
};
