import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LinkTertiary } from "./LinkTertiary";

const meta = {
  title: "Design System/LinkTertiary",
  component: LinkTertiary,
  parameters: { layout: "centered" },
  argTypes: {
    context: { control: "select", options: ["light", "dark"] },
  },
} satisfies Meta<typeof LinkTertiary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { context: "light", children: "See related work", href: "#" },
};

export const Dark: Story = {
  args: { context: "dark", children: "See related work", href: "#" },
  globals: { backgrounds: { value: "dark" } },
};

export const BothContexts: Story = {
  args: { children: "Link", href: "#" },
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ padding: 24, background: "#fff" }}>
        <LinkTertiary context="light" href="#">
          See related work
        </LinkTertiary>
      </div>
      <div style={{ padding: 24, background: "var(--background-inverse)" }}>
        <LinkTertiary context="dark" href="#">
          See related work
        </LinkTertiary>
      </div>
    </div>
  ),
};
