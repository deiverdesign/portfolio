import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CapabilityCard } from "./CapabilityCard";

const meta = {
  title: "Design System/CapabilityCard",
  component: CapabilityCard,
  parameters: { layout: "padded" },
  globals: { backgrounds: { value: "dark" } },
} satisfies Meta<typeof CapabilityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  number: "01",
  title: "Label da competência",
  description:
    "Uma frase curta explicando o que essa competência significa e em que tipo de projeto ela aparece.",
  tags: ["Tag um", "Tag dois", "Tag três"],
  linkLabel: "Ver trabalhos relacionados",
  href: "#",
};

export const Default: Story = {
  args: { ...baseArgs },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
};

/** Grade — o card ocupa 100% da altura da célula, então o link fica sempre colado embaixo. */
export const Grid: Story = {
  args: { ...baseArgs },
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
      <div style={{ height: 340 }}>
        <CapabilityCard {...baseArgs} number="01" title="Label um" />
      </div>
      <div style={{ height: 340 }}>
        <CapabilityCard
          {...baseArgs}
          number="02"
          title="Label dois (texto mais curto)"
          description="Descrição mais curta pra mostrar que o link continua colado embaixo mesmo assim."
          tags={["Tag um"]}
        />
      </div>
    </div>
  ),
};
