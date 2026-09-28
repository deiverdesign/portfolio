import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CarouselIndicatorsV3 } from "./CarouselIndicatorsV3";

function Interactive() {
  const [active, setActive] = useState(0);
  return (
    <CarouselIndicatorsV3
      count={3}
      activeIndex={active}
      onSelect={setActive}
      getLabel={(i) => `Página ${i + 1}`}
    />
  );
}

const meta = {
  title: "V3/CarouselIndicatorsV3",
  component: CarouselIndicatorsV3,
  parameters: { layout: "centered" },
} satisfies Meta<typeof CarouselIndicatorsV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactivo: Story = {
  name: "Clicável",
  args: {
    count: 3,
    activeIndex: 0,
    onSelect: () => {},
    getLabel: (i) => `Página ${i + 1}`,
  },
  render: () => <Interactive />,
};

export const Estatico: Story = {
  name: "Estados fixos",
  args: {
    count: 3,
    activeIndex: 0,
    onSelect: () => {},
    getLabel: (i) => `Página ${i + 1}`,
  },
};
