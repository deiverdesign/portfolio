import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ICON_V3_NAMES, IconV3 } from "./IconV3";

const meta = {
  title: "V3/IconV3",
  component: IconV3,
  args: { name: "arrow-right", size: 24 },
  argTypes: {
    name: { control: "select", options: ICON_V3_NAMES },
  },
} satisfies Meta<typeof IconV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Biblioteca completa — todos os ícones exportados em 27/09/2026. */
export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
        gap: 16,
        padding: 16,
      }}
    >
      {ICON_V3_NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            padding: 16,
            border: "1px solid #e5e9e7",
            borderRadius: 8,
          }}
        >
          <IconV3 name={name} size={24} />
          <code style={{ fontSize: 11, textAlign: "center" }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};
