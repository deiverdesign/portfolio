import assert from "node:assert/strict";
import test from "node:test";

import { buildCss, compareCssVariables, validateMeta } from "./sync-tokens.mjs";

function fixture() {
  const variableCollections = {
    primitives: {
      id: "primitives",
      name: "Primitives",
      modes: [{ modeId: "base", name: "Default" }],
      variableIds: ["blue"],
    },
    semantic: {
      id: "semantic",
      name: "Semantic",
      modes: [{ modeId: "semantic-base", name: "Default" }],
      variableIds: ["accent"],
    },
    spacing: {
      id: "spacing",
      name: "Spacing",
      modes: [
        { modeId: "spacing-desktop", name: "Desktop" },
        { modeId: "spacing-tablet", name: "Tablet" },
        { modeId: "spacing-mobile", name: "Mobile" },
      ],
      variableIds: ["space"],
    },
    font: {
      id: "font",
      name: "Font size",
      modes: [
        { modeId: "font-desktop", name: "Desktop" },
        { modeId: "font-tablet", name: "Tablet" },
        { modeId: "font-mobile", name: "Mobile" },
      ],
      variableIds: ["font-size"],
    },
  };

  const variables = {
    blue: {
      id: "blue",
      name: "blue/500",
      variableCollectionId: "primitives",
      valuesByMode: { base: { r: 0, g: 0.5, b: 1, a: 1 } },
    },
    accent: {
      id: "accent",
      name: "content/accent",
      variableCollectionId: "semantic",
      valuesByMode: { "semantic-base": { type: "VARIABLE_ALIAS", id: "blue" } },
    },
    space: {
      id: "space",
      name: "space/500",
      variableCollectionId: "spacing",
      valuesByMode: {
        "spacing-desktop": 16,
        "spacing-tablet": 18,
        "spacing-mobile": 20,
      },
    },
    "font-size": {
      id: "font-size",
      name: "font-size-scale/600",
      variableCollectionId: "font",
      valuesByMode: {
        "font-desktop": 16,
        "font-tablet": 18,
        "font-mobile": 20,
      },
    },
  };

  return { variables, variableCollections };
}

test("gera modos responsivos e resolve aliases entre coleções", () => {
  const css = buildCss(fixture());
  assert.match(css, /--blue-500: #0080ff;/);
  assert.match(css, /--content-accent: #0080ff;/);
  assert.match(css, /--space-500: 16px;/);
  assert.match(css, /--space-500: 18px;/);
  assert.match(css, /--space-500: 20px;/);
  assert.match(css, /--font-size-scale-600: 1rem;/);
  assert.match(css, /--font-size-scale-600: 1\.125rem;/);
  assert.match(css, /--font-size-scale-600: 1\.25rem;/);
});

test("falha quando falta um modo responsivo obrigatório", () => {
  const meta = fixture();
  meta.variableCollections.spacing.modes = meta.variableCollections.spacing.modes.filter(
    (mode) => mode.name !== "Tablet"
  );
  assert.throws(() => validateMeta(meta), /Spacing.*Tablet/);
});

test("falha em nomes CSS duplicados", () => {
  const meta = fixture();
  meta.variables.duplicate = {
    id: "duplicate",
    name: "blue 500",
    variableCollectionId: "primitives",
    valuesByMode: { base: 1 },
  };
  meta.variableCollections.primitives.variableIds.push("duplicate");
  assert.throws(() => validateMeta(meta), /Nome CSS duplicado --blue-500/);
});

test("relata drift sem considerar extensões locais como remoções", () => {
  const current = `:root {
  --blue-500: #0080ff;
  --content-accent: #0080ff;
  --space-500: 16px;
  --font-size-scale-600: 1rem;
  --local-extension: 42px;
}
@media (max-width: 1023px) { :root {
  --space-500: 17px;
  --font-size-scale-600: 1.125rem;
} }
@media (max-width: 599px) { :root {
  --space-500: 20px;
  --font-size-scale-600: 1.25rem;
} }`;

  const drift = compareCssVariables(current, buildCss(fixture()));
  assert.deepEqual(drift.missing, []);
  assert.deepEqual(drift.changed, [
    { mode: "Tablet", name: "space-500", current: "17px", candidate: "18px" },
  ]);
  assert.deepEqual(drift.preserved, [
    { mode: "Desktop", name: "local-extension", current: "42px" },
  ]);
});
