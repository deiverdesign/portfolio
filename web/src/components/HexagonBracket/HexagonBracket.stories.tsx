import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HexagonBracket } from "./HexagonBracket";

const meta = {
  title: "V3/HexagonBracket",
  component: HexagonBracket,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "10rem",
          minWidth: "24rem",
          color: "var(--color-foreground-brand-default)",
          fontFamily: "var(--font-family-data)",
          fontSize: "var(--font-size-meta-label)",
          letterSpacing: "var(--letter-spacing-meta-label)",
          textTransform: "uppercase",
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    open: { control: "boolean" },
    gap: { control: { type: "range", min: 0, max: 96, step: 4 } },
    strokeWidth: { control: { type: "range", min: 0.5, max: 4, step: 0.5 } },
  },
} satisfies Meta<typeof HexagonBracket>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  name: "Fechado — o hexágono",
  args: { open: false, gap: 24, strokeWidth: 3, children: "ABOUT" },
};

export const Open: Story = {
  name: "Aberto — emoldurando um label",
  args: { open: true, gap: 24, strokeWidth: 3, children: "ABOUT" },
};
