import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getCopy } from "@/content/site-copy";
import { SCRIOO_ASSETS } from "@/content/scrioo-assets";
import { CaseOutcomeV3 } from "./CaseOutcomeV3";
import { CaseTypeSpecimenCard } from "./CaseTypeSpecimenCard";

const meta = {
  title: "V3/Case/CaseOutcomeV3",
  component: CaseOutcomeV3,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CaseOutcomeV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scrioo: Story = {
  args: {
    eyebrow: getCopy("en", "shared.case.outcome.eyebrow"),
    title: getCopy("en", "scrioo.outcome.title"),
    body: getCopy("en", "scrioo.outcome.body"),
    checklist: [
      getCopy("en", "scrioo.outcome.1"),
      getCopy("en", "scrioo.outcome.2"),
      getCopy("en", "scrioo.outcome.3"),
      getCopy("en", "scrioo.outcome.4"),
    ],
    primaryMedia: SCRIOO_ASSETS.outcome.accessibilityHandoff,
    // Reaproveita a mesma foto do card "Progressive Detail" (decision 3)
    // — confirmado no Figma que essa imagem é usada nos dois lugares.
    secondaryMedia: SCRIOO_ASSETS.decisions.tabletMap,
    extra: (
      <CaseTypeSpecimenCard
        labelSrc={SCRIOO_ASSETS.outcome.typeSpecimenLabel}
        glyphSrc={SCRIOO_ASSETS.outcome.typeSpecimenGlyph}
        surfaceColor="var(--color-case-scrioo-surface)"
      />
    ),
  },
};
