import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ButtonV3, type ButtonV3Context, type ButtonV3Variant } from "./ButtonV3";

const meta = {
  title: "V3/ButtonV3",
  component: ButtonV3,
  args: {
    children: "Button label",
    variant: "primary",
    context: "default",
    size: "large",
  },
  argTypes: {
    variant: { control: "radio", options: ["primary", "secondary", "tertiary"] },
    context: { control: "radio", options: ["default", "inverted"] },
    size: { control: "radio", options: ["large", "medium"] },
  },
} satisfies Meta<typeof ButtonV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const VARIANTS: ButtonV3Variant[] = ["primary", "secondary", "tertiary"];
const CONTEXTS: ButtonV3Context[] = ["default", "inverted"];

/** Reproduz a grade de variantes do frame "Button-V3" (1580:2063) no Figma —
 * comparar lado a lado ao invés de aprovar variante por variante. */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {CONTEXTS.map((context) => (
        <div
          key={context}
          style={{
            display: "flex",
            gap: 24,
            padding: 24,
            background: context === "inverted" ? "#171b1a" : "#fcfbf7",
          }}
        >
          {VARIANTS.map((variant) => (
            <ButtonV3 key={variant} variant={variant} context={context}>
              Button label
            </ButtonV3>
          ))}
          <ButtonV3 variant="primary" context={context} disabled>
            Disabled
          </ButtonV3>
        </div>
      ))}
    </div>
  ),
};
