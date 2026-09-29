import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HexagonIntro } from "./HexagonIntro";

const meta = {
  title: "Visual/HexagonIntro Steps 01–14",
  component: HexagonIntro,
  parameters: { layout: "fullscreen" },
  globals: { backgrounds: { value: "light" } },
  decorators: [
    (Story) => (
      <div style={{ width: "100vw", minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ width: "100vw" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    autoPlay: { control: "boolean" },
    loop: { control: "boolean" },
    introHoldMs: { control: { type: "range", min: 0, max: 2_500, step: 50 } },
    loaderCycleMs: { control: { type: "range", min: 900, max: 3_000, step: 50 } },
    loaderCycles: { control: { type: "range", min: 0, max: 5, step: 1 } },
    rotationMs: { control: { type: "range", min: 0, max: 1_500, step: 20 } },
    resolveMs: { control: { type: "range", min: 900, max: 4_000, step: 50 } },
    finalHoldMs: { control: { type: "range", min: 0, max: 2_500, step: 50 } },
    direction: { control: "inline-radio", options: ["forward", "reverse"] },
  },
} satisfies Meta<typeof HexagonIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loop: Story = {
  args: {
    autoPlay: true,
    loop: true,
    introHoldMs: 700,
    loaderCycleMs: 1_600,
    loaderCycles: 2,
    rotationMs: 480,
    resolveMs: 2_400,
    finalHoldMs: 700,
  },
};

export const Once: Story = {
  args: {
    autoPlay: true,
    loop: false,
    introHoldMs: 700,
    loaderCycleMs: 1_600,
    loaderCycles: 2,
    rotationMs: 480,
    resolveMs: 2_400,
    finalHoldMs: 700,
  },
};

/* The direction decided on 01/set, at the pacing Deiver settled on by ear in the
   Controls panel: opens on the assembled symbol, decomposes it back to the
   square, and the square is what becomes the page. Reasoning in NORTE.md 6.6.

   No loader turns here, so `loaderCycleMs` is inert — kept at the value he left
   it on. The turn runs long on purpose: played backwards it is the last thing
   that happens before the square, so it carries the ending. */
export const Reverse: Story = {
  name: "Reverse — the decided direction",
  args: {
    autoPlay: true,
    loop: true,
    introHoldMs: 2_300,
    loaderCycleMs: 2_150,
    loaderCycles: 0,
    rotationMs: 1_040,
    resolveMs: 1_500,
    finalHoldMs: 1_650,
    direction: "reverse",
  },
};

/* The pacing Deiver picked by ear in the Controls panel. Two full loader turns
   before the symbol resolves, and a long opening beat on the square. */
export const Preferred: Story = {
  name: "Preferred pacing",
  args: {
    autoPlay: true,
    loop: true,
    introHoldMs: 1_250,
    loaderCycleMs: 1_700,
    loaderCycles: 2,
    rotationMs: 480,
    resolveMs: 1_800,
    finalHoldMs: 700,
  },
};

/* Codex's target pacing: geometry by 350 ms, decomposition by 700 ms, lettering
   by 1100 ms. No loader cycle — the square goes straight through to the hexagon
   instead of bouncing back to a square first, so the turn gets a tighter budget
   than elsewhere. */
export const Target: Story = {
  name: "Target — 2.2s opening, no bounce",
  args: {
    autoPlay: true,
    loop: true,
    introHoldMs: 200,
    loaderCycleMs: 900,
    loaderCycles: 0,
    rotationMs: 320,
    resolveMs: 950,
    finalHoldMs: 700,
  },
};

/* Deliberately slow, for examining a single passage frame by frame. */
export const Step04BStudy: Story = {
  name: "Step 04B — split transition study",
  args: {
    autoPlay: true,
    loop: true,
    introHoldMs: 450,
    loaderCycleMs: 900,
    loaderCycles: 1,
    rotationMs: 900,
    resolveMs: 4_000,
    finalHoldMs: 900,
  },
};

export const FinalStep: Story = {
  args: {
    autoPlay: false,
    loop: false,
    introHoldMs: 700,
    loaderCycleMs: 1_600,
    loaderCycles: 2,
    rotationMs: 480,
    resolveMs: 2_400,
    finalHoldMs: 700,
  },
};
