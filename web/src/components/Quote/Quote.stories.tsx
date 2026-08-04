import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Quote } from "./Quote";

const meta = {
  title: "Design System/Quote",
  component: Quote,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleParagraph: Story = {
  args: { children: null },
  render: () => <Quote>This is a short reflection quote, styled with a left accent bar.</Quote>,
};

export const MultipleParagraphs: Story = {
  args: { children: null },
  render: () => (
    <Quote>
      <p style={{ margin: 0 }}>First paragraph of the reflection.</p>
      <p style={{ margin: 0 }}>Second paragraph, continuing the thought.</p>
    </Quote>
  ),
};
