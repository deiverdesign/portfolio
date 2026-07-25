import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavBar } from "./NavBar";

const meta = {
  title: "Design System/NavBar",
  component: NavBar,
  parameters: { layout: "fullscreen" },
  argTypes: {
    context: { control: "select", options: ["light", "dark"] },
    lang: { control: "select", options: ["PT", "EN"] },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: { context: "dark", lang: "PT" },
};

export const Light: Story = {
  args: { context: "light", lang: "PT" },
};

/**
 * A NavBar não faz reflow — ela troca pra uma variante estruturalmente
 * diferente (menu hambúrguer) abaixo de 1024px. Redimensione o painel
 * de preview do Storybook pra ver a troca acontecer.
 */
export const ResizeToSeeHamburger: Story = {
  args: { context: "dark", lang: "PT" },
  parameters: {
    docs: {
      description: {
        story:
          "Redimensione a largura do preview (ou o viewport do Storybook) pra menos de 1024px pra ver o menu virar hambúrguer.",
      },
    },
  },
};
