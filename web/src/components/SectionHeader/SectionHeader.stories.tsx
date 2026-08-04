import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionHeader } from "./SectionHeader";

const meta = {
  title: "Design System/SectionHeader",
  component: SectionHeader,
  parameters: { layout: "padded" },
  argTypes: {
    context: { control: "select", options: ["light", "dark"] },
    level: { control: "select", options: ["h1", "h2", "h3"] },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { eyebrow: "01 · Section Name", title: "Section Title", context: "light" },
};

export const Dark: Story = {
  args: { eyebrow: "01 · Section Name", title: "Section Title", context: "dark" },
  globals: { backgrounds: { value: "dark" } },
};

export const BothContexts: Story = {
  args: { eyebrow: "01 · Section Name", title: "Section Title" },
  render: () => (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ padding: 24, background: "#fff" }}>
        <SectionHeader eyebrow="01 · Section Name" title="Section Title" context="light" />
      </div>
      <div style={{ padding: 24, background: "var(--background-inverse)" }}>
        <SectionHeader eyebrow="01 · Section Name" title="Section Title" context="dark" />
      </div>
    </div>
  ),
};
