import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HexagonMorph } from "./HexagonMorph";

const meta = {
  title: "Visual/HexagonMorph",
  component: HexagonMorph,
  parameters: { layout: "centered" },
  globals: { backgrounds: { value: "light" } },
  decorators: [
    (Story) => (
      <div style={{ width: "min(72vw, 26rem)" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    autoPlay: { control: "boolean" },
    state: { control: "radio", options: ["hexagon", "rectangle"] },
    transitionDurationMs: {
      control: { type: "range", min: 150, max: 1_800, step: 50 },
    },
  },
} satisfies Meta<typeof HexagonMorph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loop: Story = {
  args: {
    autoPlay: true,
    state: "hexagon",
    transitionDurationMs: 300,
  },
};

export const Hexagon: Story = {
  args: {
    autoPlay: false,
    state: "hexagon",
    transitionDurationMs: 650,
  },
};

export const Rectangle: Story = {
  args: {
    autoPlay: false,
    state: "rectangle",
    transitionDurationMs: 650,
  },
};
