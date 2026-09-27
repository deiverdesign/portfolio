import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TagV3 } from "./TagV3";

const meta = {
  title: "V3/TagV3",
  component: TagV3,
  args: { label: "AI" },
} satisfies Meta<typeof TagV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Row: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <TagV3 label="Design Systems" />
      <TagV3 label="AI" />
      <TagV3 label="Data-heavy UX" />
    </div>
  ),
};
