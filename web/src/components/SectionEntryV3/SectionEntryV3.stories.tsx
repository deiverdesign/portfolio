import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EyebrowV3 } from "@/components/EyebrowV3/EyebrowV3";
import { SectionEntryV3 } from "./SectionEntryV3";

const meta = {
  title: "V3/SectionEntryV3",
  component: SectionEntryV3,
  parameters: { layout: "centered" },
  args: { children: null },
} satisfies Meta<typeof SectionEntryV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleAndBody: Story = {
  render: () => (
    <SectionEntryV3 style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <h2 data-motion-part="title" style={{ margin: 0 }}>Section title</h2>
      <p data-motion-part="body" style={{ margin: 0 }}>
        A short supporting sentence demonstrates the reusable entry cadence.
      </p>
    </SectionEntryV3>
  ),
};

export const WithEyebrow: Story = {
  render: () => (
    <SectionEntryV3 hasEyebrow style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <EyebrowV3 data-motion-part="eyebrow">Section label</EyebrowV3>
      <h2 data-motion-part="title" style={{ margin: 0 }}>Section title</h2>
      <p data-motion-part="body" style={{ margin: 0 }}>
        The title begins after the eyebrow and the body follows sixty milliseconds later.
      </p>
    </SectionEntryV3>
  ),
};
