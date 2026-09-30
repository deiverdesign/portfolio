import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getCopy } from "@/content/site-copy";
import { CaseMetaRowV3 } from "./CaseMetaRowV3";

const meta = {
  title: "V3/Case/CaseMetaRowV3",
  component: CaseMetaRowV3,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CaseMetaRowV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scrioo: Story = {
  args: {
    items: [
      {
        icon: "person-card",
        label: getCopy("en", "shared.case.role.label"),
        value: getCopy("en", "scrioo.context.role"),
      },
      {
        icon: "handshake-2",
        label: getCopy("en", "shared.case.collab.label"),
        value: getCopy("en", "scrioo.context.collab"),
      },
    ],
  },
};
