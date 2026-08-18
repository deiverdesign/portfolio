// Gera src/styles/tokens.css a partir dos valores reais lidos do Figma.
// Rodar de novo sempre que os tokens do Figma mudarem: node scripts/generate-tokens.mjs

import { writeFileSync } from 'fs';

const primitives = {
  "primary-100": "#eef7f6", "primary-200": "#dbeeec", "primary-300": "#aadad6",
  "primary-400": "#68c2bb", "primary-500": "#389991", "primary-600": "#246963",
  "primary-700": "#1c5550", "primary-800": "#133f3b", "primary-900": "#0b2825",
  "secondary-100": "#f5f2e5", "secondary-200": "#e8e2c6", "secondary-300": "#c8bb83",
  "secondary-400": "#9c8d4d", "secondary-500": "#7c7140", "secondary-600": "#716638",
  "secondary-700": "#564d26", "secondary-800": "#3a3417", "secondary-900": "#2c2711",
  "gray-0": "#ffffff", "gray-100": "#f8f7f7", "gray-200": "#e5e3e1", "gray-300": "#bab7b2",
  "gray-400": "#8f8a84", "gray-500": "#746f6b", "gray-600": "#6c6761", "gray-700": "#4c4740",
  "gray-800": "#2a2621", "gray-900": "#1a1814",
  "danger-light": "#f5e6e5", "danger-base": "#b23c34", "danger-dark": "#63211d",
  "warning-light": "#f4e9d7", "warning-base": "#d7a042", "warning-dark": "#7a591f",
  "info-light": "#e5eef5", "info-base": "#347db2", "info-dark": "#1d4663",
  "success-light": "#e3f2eb", "success-base": "#358d61", "success-dark": "#1c4a33",
  "tertiary-100": "#edf8f7", "tertiary-200": "#d1eeec", "tertiary-300": "#9cdeda",
  "tertiary-400": "#7ed7d1", "tertiary-500": "#68d1ca", "tertiary-600": "#39bdb4",
  "tertiary-700": "#26807a", "tertiary-800": "#164d49", "tertiary-900": "#103735",
  "muted-100": "#efede7", "muted-200": "#e7e5db", "muted-300": "#d6d3c3",
  "muted-400": "#c5c0aa", "muted-500": "#bdb89f", "muted-600": "#9f9874",
  "muted-700": "#777152", "muted-800": "#5a563d", "muted-900": "#3d3a29",
  "alpha-secondary-0": "#ca9c5200", "alpha-secondary-30": "#ca9c524d",
};

const semantic = {
  "content-heading": "#1c5550", "content-primary": "#1a1814", "content-secondary": "#746f6b",
  "content-accent": "#7c7140", "content-muted": "#bdb89f", "content-muted-on-light": "#777152",
  "content-accent-on-dark": "#e8e2c6", "content-on-dark-primary": "#ffffff",
  "content-on-dark-secondary": "#7ed7d1",
  "background-surface": "#f8f7f7", "background-canvas": "#f8f7f7", "background-inverse": "#0b2825",
  "background-spotlight": "#1c5550", "background-primary": "#246963",
  "border-default": "#e5e3e1", "border-subtle": "#f8f7f7", "border-strong": "#bab7b2",
  "border-tag": "#c5c0aa", "border-tag-on-dark": "#e7e5db",
  "border-primary-default": "#389991", "border-primary-on-dark-subtle": "#1c5550",
  "action-primary-background": "#1a1814", "action-primary-content": "#ffffff",
  "action-secondary-content": "#1c5550", "action-secondary-border": "#bab7b2",
  "action-tertiary-content": "#746f6b",
  "action-chip-border": "#1a1814", "action-chip-background-selected": "#1a1814",
  "action-chip-content-selected": "#ffffff", "action-chip-content-default": "#746f6b",
  "action-overlay-pressed": "rgba(0,0,0,0.12)", "action-overlay-hover": "rgba(0,0,0,0.06)",
  "action-focus-ring": "#389991",
  "feedback-danger-background": "#f5e6e5", "feedback-danger-content": "#63211d", "feedback-danger-border": "#b23c34",
  "feedback-warning-background": "#f4e9d7", "feedback-warning-content": "#7a591f", "feedback-warning-border": "#d7a042",
  "feedback-info-background": "#e5eef5", "feedback-info-content": "#1d4663", "feedback-info-border": "#347db2",
  "feedback-success-background": "#e3f2eb", "feedback-success-content": "#1c4a33", "feedback-success-border": "#358d61",
};

// opacity/disabled é um valor à parte (não é cor)
const opacityDisabled = 0.4;

const spacing = {
  "space-100": { Desktop: 2, Tablet: 2, Mobile: 2.5 },
  "space-200": { Desktop: 4, Tablet: 4, Mobile: 5 },
  "space-300": { Desktop: 8, Tablet: 9, Mobile: 10 },
  "space-400": { Desktop: 12, Tablet: 14, Mobile: 15 },
  "space-500": { Desktop: 16, Tablet: 18, Mobile: 20 },
  "space-600": { Desktop: 20, Tablet: 22, Mobile: 25 },
  "space-700": { Desktop: 24, Tablet: 27, Mobile: 30 },
  "space-800": { Desktop: 32, Tablet: 36, Mobile: 40 },
  "space-900": { Desktop: 40, Tablet: 45, Mobile: 50 },
  "space-layout-100": { Desktop: 48, Tablet: 54, Mobile: 60 },
  "space-layout-200": { Desktop: 56, Tablet: 63, Mobile: 70 },
  "space-layout-300": { Desktop: 64, Tablet: 72, Mobile: 80 },
  "space-layout-400": { Desktop: 80, Tablet: 90, Mobile: 100 },
  "space-layout-500": { Desktop: 96, Tablet: 108, Mobile: 120 },
};

const fontScale = {
  "100": { Desktop: 8, Tablet: 9, Mobile: 10 },
  "200": { Desktop: 11, Tablet: 12.5, Mobile: 14 },
  "300": { Desktop: 12, Tablet: 13.5, Mobile: 15 },
  "400": { Desktop: 13, Tablet: 14.5, Mobile: 16 },
  "500": { Desktop: 14, Tablet: 16, Mobile: 17.5 },
  "600": { Desktop: 16, Tablet: 18, Mobile: 20 },
  "700": { Desktop: 26, Tablet: 26, Mobile: 22.1 },
  "800": { Desktop: 32, Tablet: 32, Mobile: 27.2 },
  "900": { Desktop: 48, Tablet: 40, Mobile: 30 },
};

// Os 12 papéis existentes continuam 1:1; os cinco adicionais começam sem uso.
const fontRoles = {
  "display-large": "900",
  "display-medium": "800",
  "heading-large": "700",
  "heading-medium": "600",
  "heading-small": "400",
  "body-large": "600",
  "body-medium": "500",
  "body-medium-emphasis": "500",
  "body-small": "300",
  "label-large": "500",
  "label-medium": "300",
  "label-small": "200",
  "data-medium": "300",
  "data-medium-emphasis": "300",
  "caption-medium": "300",
  "editorial-eyebrow": "200",
  "editorial-step-number": "100",
};

function block(obj, fn) {
  return Object.entries(obj).map(([k, v]) => `  --${k}: ${fn(v)};`).join('\n');
}

function spacingBlock(mode) {
  return Object.entries(spacing).map(([k, v]) => `  --${k}: ${v[mode]}px;`).join('\n');
}

function fontScaleBlock(mode) {
  return Object.entries(fontScale)
    .map(([k, v]) => `  --font-size-scale-${k}: ${v[mode]}px;`)
    .join('\n');
}

function fontRolesBlock() {
  return Object.entries(fontRoles)
    .map(([role, scale]) => `  --font-size-${role}: var(--font-size-scale-${scale});`)
    .join('\n');
}

const css = `/* Gerado a partir do Figma (fileKey zpaQNzgjhG5ZKafe2cxnkm) por scripts/generate-tokens.mjs */
/* Não editar à mão — rodar o script de novo quando os tokens do Figma mudarem. */

:root {
  /* Primitives — rampas de cor cruas, sem significado de uso */
${block(primitives, v => v)}

  /* Semantic — papel de uso, aponta pra um primitivo */
${block(semantic, v => v)}
  --opacity-disabled: ${opacityDisabled};

  /* Spacing — modo Desktop (padrão) */
${spacingBlock('Desktop')}

  /* Font size — escala responsiva, modo Desktop (padrão) */
${fontScaleBlock('Desktop')}

  /* Font size — papéis semânticos */
${fontRolesBlock()}
}

/* Tablet: 600px–1023px. Desktop começa exatamente em 1024px. */
@media (max-width: 1023px) {
  :root {
${spacingBlock('Tablet')}
${fontScaleBlock('Tablet')}
  }
}

/* Mobile: até 599px */
@media (max-width: 599px) {
  :root {
${spacingBlock('Mobile')}
${fontScaleBlock('Mobile')}
  }
}
`;

writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), css);
console.log('tokens.css gerado com sucesso.');
