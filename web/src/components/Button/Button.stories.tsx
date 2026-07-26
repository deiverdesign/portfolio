import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta = {
  title: "Design System/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "tertiary"] },
    context: { control: "select", options: ["light", "dark"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryLight: Story = {
  args: { variant: "primary", context: "light", children: "Label" },
};

export const PrimaryDark: Story = {
  args: { variant: "primary", context: "dark", children: "Label" },
  globals: { backgrounds: { value: "dark" } },
};

export const Secondary: Story = {
  args: { variant: "secondary", context: "light", children: "Label" },
};

export const Tertiary: Story = {
  args: { variant: "tertiary", context: "light", children: "Label" },
};

export const Disabled: Story = {
  args: { variant: "primary", context: "light", children: "Label", disabled: true },
};

/** Todas as combinações lado a lado — útil pra comparar com o Figma de uma vez. */
export const AllVariants: Story = {
  args: { children: "Button" },
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 12, padding: 24, background: "#fff" }}>
        <Button variant="primary" context="light">Primary</Button>
        <Button variant="secondary" context="light">Secondary</Button>
        <Button variant="tertiary" context="light">Tertiary</Button>
        <Button variant="primary" context="light" disabled>Disabled</Button>
      </div>
      <div style={{ display: "flex", gap: 12, padding: 24, background: "var(--background-inverse)" }}>
        <Button variant="primary" context="dark">Primary</Button>
        <Button variant="secondary" context="dark">Secondary</Button>
        <Button variant="tertiary" context="dark">Tertiary</Button>
        <Button variant="primary" context="dark" disabled>Disabled</Button>
      </div>
    </div>
  ),
};
