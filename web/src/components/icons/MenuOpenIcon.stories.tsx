import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MenuOpenIcon } from "./MenuOpenIcon";

const meta = {
  title: "Design System/Icon/Menu Open",
  component: MenuOpenIcon,
  parameters: { layout: "centered" },
} satisfies Meta<typeof MenuOpenIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnDark: Story = {
  args: {
    style: {
      color: "var(--nav-menu-toggle-content-on-dark)",
      width: "var(--nav-menu-toggle-open-icon-size)",
      height: "var(--nav-menu-toggle-open-icon-size)",
    },
  },
  globals: { backgrounds: { value: "dark" } },
};

export const OnLight: Story = {
  args: {
    style: {
      color: "var(--nav-menu-toggle-content-on-light)",
      width: "var(--nav-menu-toggle-open-icon-size)",
      height: "var(--nav-menu-toggle-open-icon-size)",
    },
  },
  globals: { backgrounds: { value: "light" } },
};
