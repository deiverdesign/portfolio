import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tag } from "./Tag";

const meta = {
  title: "Design System/Tag",
  component: Tag,
  parameters: { layout: "centered" },
  argTypes: {
    context: { control: "select", options: ["light", "dark"] },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { context: "light", children: "Label" },
};

export const Dark: Story = {
  args: { context: "dark", children: "Label" },
  globals: { backgrounds: { value: "dark" } },
};

export const BothContexts: Story = {
  args: { children: "Tag" },
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, padding: 24, background: "#fff" }}>
        <Tag context="light">Label</Tag>
        <Tag context="light">Label</Tag>
      </div>
      <div style={{ display: "flex", gap: 8, padding: 24, background: "var(--background-inverse)" }}>
        <Tag context="dark">Label</Tag>
        <Tag context="dark">Label</Tag>
      </div>
    </div>
  ),
};
