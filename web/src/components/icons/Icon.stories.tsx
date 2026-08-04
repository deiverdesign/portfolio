import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon, type IconName } from "./Icon";

const ICON_NAMES: IconName[] = ["download", "arrow-right", "menu", "close", "external-link"];

const meta = {
  title: "Design System/Icon",
  component: Icon,
  parameters: { layout: "centered" },
  argTypes: {
    name: { control: "select", options: ICON_NAMES },
    size: { control: "number" },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "arrow-right", size: 14 },
};

export const AllIcons: Story = {
  args: { name: "arrow-right" },
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 32 }}>
      {ICON_NAMES.map((name) => (
        <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Icon name={name} size={24} />
          <span style={{ fontSize: 12, color: "var(--content-secondary)" }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
