import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CaseHeroBackground } from "./CaseHeroBackground";

const meta = {
  title: "V3/CaseHeroBackground",
  component: CaseHeroBackground,
  parameters: { layout: "fullscreen" },
  globals: { backgrounds: { value: "dark" } },
  argTypes: {
    background: { control: "color" },
    noiseColor: { control: "color" },
  },
} satisfies Meta<typeof CaseHeroBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    background: "#0868ee",
    noiseColor: "#24b6ff",
    children: (
      <div
        style={{
          minHeight: "min(78svh, 980px)",
          padding: "clamp(24px, 5vw, 80px)",
          color: "white",
        }}
      >
        <p style={{ margin: 0, fontFamily: "var(--font-family-data)" }}>Category label</p>
        <h1 style={{ marginTop: 24, fontSize: "clamp(48px, 8vw, 120px)" }}>Case title</h1>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "clamp(16px, 3vw, 48px)" }}>
        <div style={{ overflow: "hidden", borderRadius: "clamp(24px, 3vw, 52px)" }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
