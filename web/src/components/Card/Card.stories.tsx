import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./Card";

const meta = {
  title: "Design System/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    padding: { control: "select", options: ["compact", "spacious"] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {
  args: { padding: "compact", children: null },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Card {...args}>
        <h3 style={{ margin: 0 }}>Card title</h3>
        <p style={{ margin: 0 }}>A short description of what this card represents.</p>
      </Card>
    </div>
  ),
};

export const Spacious: Story = {
  args: { padding: "spacious", children: null },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Card {...args}>
        <h3 style={{ margin: 0 }}>Card title</h3>
        <p style={{ margin: 0 }}>A short description of what this card represents.</p>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  args: { padding: "spacious", href: "#", children: null },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Card {...args}>
        <span style={{ fontSize: 12, textTransform: "uppercase" }}>Next case</span>
        <h3 style={{ margin: 0 }}>Case Study Two →</h3>
        <p style={{ margin: 0, fontStyle: "italic" }}>Hover to see the border highlight.</p>
      </Card>
    </div>
  ),
};
