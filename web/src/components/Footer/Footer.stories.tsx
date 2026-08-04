import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer } from "./Footer";

const meta = {
  title: "Design System/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
  argTypes: {
    locale: { control: "select", options: ["pt", "en"] },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { locale: "pt" },
};

export const English: Story = {
  args: { locale: "en" },
};
